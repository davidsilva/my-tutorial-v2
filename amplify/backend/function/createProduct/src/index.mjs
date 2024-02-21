import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import Joi from "joi";

const ssmClient = new SSMClient({ region: process.env.REGION });
const dynamodbClient = new DynamoDBClient({ region: process.env.REGION });

const tableName = `${process.env.TABLENAME}-${process.env.ENV}`;

let stripe;

const inputSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  image: Joi.string().optional().allow(""),
  id: Joi.string().optional(),
  stripeProductId: Joi.string().optional(),
  stripePriceId: Joi.string().optional(),
}).unknown();

const getStripeSecretKey = async () => {
  // Seems problematic to get the Amplify App ID from the environment
  const command = new GetParameterCommand({
    Name: `/amplify/${process.env.AWS_AMPLIFY_ID}/${process.env.ENV}/AMPLIFY_createProduct_STRIPE_SECRET_KEY`,
    WithDecryption: true,
  });

  const response = await ssmClient.send(command);

  return response.Parameter.Value;
};

const getStripeClient = async () => {
  if (!stripe) {
    const secretKey = await getStripeSecretKey();
    stripe = new Stripe(secretKey);
  }

  return stripe;
};

const createStripeProductId = async ({ name, description }) => {
  if (!name || !description) {
    return Promise.reject("Name and description are required");
  }

  const stripe = await getStripeClient();

  const stripeProduct = await stripe.products.create({ name, description });

  return stripeProduct.id;
};

const createStripePriceId = async (input) => {
  if (!input.price) {
    return Promise.reject("Price is required");
  }

  const stripe = await getStripeClient();

  const stripePrice = await stripe.prices.create({
    product: input.stripeProductId,
    unit_amount: input.price,
    currency: "usd",
  });

  return stripePrice.id;
};

const createProduct = async (input) => {
  if (!input || !input.name || !input.description || !input.price) {
    return Promise.reject("Name, description, and price are required");
  }

  const stripeProductId = await createStripeProductId(input);
  const stripePriceId = await createStripePriceId(input.price);

  const id = uuidv4();
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  const product = {
    ...input,
    id,
    stripeProductId,
    stripePriceId,
    createdAt,
    updatedAt,
  };

  const putItemCommand = new PutItemCommand({
    TableName: tableName,
    Item: marshall(product),
  });

  await dynamodbClient.send(putItemCommand);

  return Promise.resolve(product);
};

const updateProduct = async (input) => {
  if (!input || !input.id) {
    return Promise.reject("ID is required");
  }

  // Get the product from DynamoDB
  // If we can't find the product, we can't update it
  const getItemCommand = new GetItemCommand({
    TableName: tableName,
    Key: marshall({
      id: input.id,
    }),
  });

  const { Item: dynamoItem } = await dynamodbClient.send(getItemCommand);
  const product = unmarshall(dynamoItem);

  if (!product) {
    return Promise.reject("Could not update product because it was not found");
  }

  const createdAt = input.createdAt || new Date().toISOString();
  const updatedAt = new Date().toISOString();
  let stripeProductId = product.stripeProductId;
  let stripePriceId = product.stripePriceId;

  if (!stripeProductId) {
    // Create a new product in Stripe
    stripeProductId = await createStripeProductId(input);
    // If there is no Stripe Product ID, there should be no Stripe Price ID
    // So let's create one
    stripePriceId = await createStripePriceId({ ...input, stripeProductId });
  }

  if (!stripePriceId || input.price !== product.price) {
    // Create a new price in Stripe
    stripePriceId = await createStripePriceId({ ...input, stripeProductId });
  }

  const updatedProduct = {
    ...input,
    createdAt,
    updatedAt,
    stripeProductId,
    stripePriceId,
  };

  const putItemCommand = new PutItemCommand({
    TableName: tableName,
    Item: marshall(updatedProduct),
  });

  await dynamodbClient.send(putItemCommand);

  return Promise.resolve(updatedProduct);
};

/**
 * @typedef {Object} Event
 * @property {string} operation
 * @property {Object} payload
 * @property {Object} payload.Item
 * @property {string} payload.Item.id
 * @property {string} payload.Item.name
 * @property {string} payload.Item.description
 * @property {number} payload.Item.price
 * @property {string} payload.Item.image
 * @property {string} payload.Item.stripeProductId
 * @property {string} payload.Item.stripePriceId
 */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export const handler = async (event, context) => {
  console.log(`CONTEXT: ${JSON.stringify(context)}`);
  if (!event) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Invalid input",
      }),
    };
  }

  console.log(`EVENT: ${JSON.stringify(event)}`);

  let { ...input } = event.payload.Item;
  let result;

  const { error } = inputSchema.validate(input);
  /*
   * This is giving a lot of error information to the client, which could
   * be a security risk in a real-world, production application.
   * Here, we're just using it for development and debugging purposes.
   */
  if (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Invalid input",
        error: error.details,
      }),
    };
  }

  try {
    switch (event.operation) {
      case "create":
        result = await createProduct(input);
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: "Product created successfully",
            product: result,
          }),
        };
      case "update":
        if (!input || !input.id) {
          return {
            statusCode: 400,
            body: JSON.stringify({
              message: "Invalid input: ID is required for update operation",
            }),
          };
        }
        result = await updateProduct(input);
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: "Product updated successfully",
            product: result,
          }),
        };
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: "Invalid operation",
          }),
        };
    }
  } catch (error) {
    /*
     * This is giving a lot of error information to the client, which could
     * be a security risk in a real-world, production application.
     * Here, we're just using it for development and debugging purposes.
     */
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred",
        error: error,
      }),
    };
  }
};
