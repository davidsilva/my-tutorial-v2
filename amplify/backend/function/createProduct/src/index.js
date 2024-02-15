import AWS from "aws-sdk";

async function getStripeSecretKey() {
  const ssm = new AWS.SSM();
  const response = await ssm
    .getParameters({
      Names: ["STRIPE_SECRET_KEY"],
      WithDecryption: true,
    })
    .promise();

  const parameter = response.Parameters.find(
    (p) => p.Name === "STRIPE_SECRET_KEY"
  );

  return parameter.Value;
}
/*
Use the following code to retrieve configured secrets from SSM:

const aws = require('aws-sdk');

const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["STRIPE_SECRET_KEY"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();

Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
*/
/* Amplify Params - DO NOT EDIT
	API_MYTUTORIALV2_GRAPHQLAPIENDPOINTOUTPUT
	API_MYTUTORIALV2_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  return {
    statusCode: 200,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*",
    //      "Access-Control-Allow-Headers": "*"
    //  },
    body: JSON.stringify("Hello from Lambda!"),
  };
};
