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
  id: Joi.string().optional(),
  stripeProductId: Joi.string().optional(),
  stripePriceId: Joi.string().optional(),
}).unknown();

const getStripeSecretKey = async () => {
  const command = new GetParameterCommand({
    Name: "/amplify/d1orozue7xcs1n/envamb/AMPLIFY_createProduct_STRIPE_SECRET_KEY",
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

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export const handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  let { id, ...input } = event.arguments.input;

  const isNewProduct = !id;

  // Generate id if it doesn't exist
  if (isNewProduct) {
    id = uuidv4();
  }

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
    const stripe = await getStripeClient();

    let stripeProduct;
    let stripePrice;

    const stripeProductInput = (({ name, description }) => ({
      name,
      description,
    }))(input);

    const stripePriceInput = (({ price }) => ({
      unit_amount: price,
      currency: "usd",
    }))(input);

    if (!isNewProduct) {
      // Fetch the from DynamoDB
      const getItemCommand = new GetItemCommand({
        TableName: tableName,
        Key: marshall({
          id,
        }),
      });

      const { Item: product } = await dynamodbClient.send(getItemCommand);

      if (!product) {
        throw new Error("Product not found");
      }

      const unmarshalledProduct = unmarshall(product);

      // Update the product in Stripe
      if (unmarshalledProduct.stripeProductId) {
        stripeProduct = await stripe.products.update(
          unmarshalledProduct.stripeProductId,
          stripeProductInput
        );

        // If price has changed, update the price in Stripe
        if (input.price && unmarshalledProduct.price !== input.price) {
          stripePrice = await stripe.prices.update(
            unmarshalledProduct.stripePriceId,
            stripePriceInput
          );
        }
      } else {
        // Create a new product in Stripe
        stripeProduct = await stripe.products.create(stripeProductInput);

        stripePrice = await stripe.prices.create({
          product: stripeProduct.id,
          ...stripePriceInput,
        });

        // Update the product in DynamoDB with the new Stripe IDs
        unmarshalledProduct.stripeProductId = stripeProduct.id;
        unmarshalledProduct.stripePriceId = stripePrice.id;

        const putItemCommand = new PutItemCommand({
          TableName: tableName,
          Item: marshall(unmarshalledProduct),
        });

        await dynamodbClient.send(putItemCommand);
      }
    } else {
      // Create a new product in Stripe
      stripeProduct = await stripe.products.create(stripeProductInput);

      // Create a new price in Stripe
      stripePrice = await stripe.prices.create({
        product: stripeProduct.id,
        ...stripePriceInput,
      });
    }

    const putItemCommand = new PutItemCommand({
      TableName: tableName,
      Item: marshall({
        id,
        ...input,
        stripeProductId: stripeProduct.id,
        stripePriceId: stripePrice.id,
      }),
    });

    await dynamodbClient.send(putItemCommand);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: isNewProduct
          ? "Product updated successfully"
          : "Product created successfully",
        product: {
          id,
          ...input,
          stripeProductId: stripeProduct.id,
          stripePriceId: stripePrice.id,
        },
      }),
    };
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
