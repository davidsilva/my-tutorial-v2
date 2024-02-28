import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import Stripe from "stripe";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.REGION,
});

const ssmClient = new SSMClient({ region: process.env.REGION });

let stripe;

const getUserData = async (username) => {
  const command = new AdminGetUserCommand({
    UserPoolId: process.env.USER_POOL_ID,
    Username: username,
  });

  try {
    const data = await cognitoClient.send(command);
    console.log("DATA: ", data);
    return data.UserAttributes;
  } catch (err) {
    console.error("Error: ", err);
    return null;
  }
};

const getUserEmail = async (username) => {
  const data = await getUserData(username);
  const email = data.find((attr) => attr.Name === "email");
  return email.Value;
};

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

stripe = getStripeClient();

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export async function handler(event) {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  try {
    // token comes from stripe
    const { id, cart, total, address, username, token } = event.arguments.input;
    const email = await getUserEmail(event);

    await stripe.charges.create({
      amount: total * 100,
      currency: "usd",
      source: token,
      description: `Order ${new Date()} by ${email}`,
    });
    return { id, cart, total, address, username, email };
  } catch (err) {
    throw new Error(err);
  }
}
