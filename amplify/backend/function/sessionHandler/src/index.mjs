/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	API_MYTUTORIALV2_GRAPHQLAPIIDOUTPUT
	API_MYTUTORIALV2_GRAPHQLAPIENDPOINTOUTPUT
	TABLENAME
	AWS_AMPLIFY_ID
Amplify Params - DO NOT EDIT */
import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { v4 as uuidv4 } from "uuid";

const ddbClient = new DynamoDBClient({ region: process.env.REGION });
const tableName = `${process.env.TABLENAME}-${process.env.ENV}`;

async function getSession(sessionId) {
  if (!sessionId) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Session ID is required",
      }),
    };
  }

  const getItemCommand = new GetItemCommand({
    TableName: tableName,
    Key: marshall({ id: sessionId }),
  });

  try {
    const response = await ddbClient.send(getItemCommand);
    const session = unmarshall(response.Item);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify(session),
    };
  } catch (error) {
    console.error(`Error getting session: ${error}`);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({
        message: "Error getting session",
      }),
    };
  }
}

async function createSession(userId) {
  const id = uuidv4();
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  const session = {
    id,
    createdAt,
    updatedAt,
    __typename: "Session",
    userId: userId ? userId : null,
  };

  const putItemCommand = new PutItemCommand({
    TableName: tableName,
    Item: marshall(session),
  });

  try {
    await ddbClient.send(putItemCommand);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify(session),
    };
  } catch (error) {
    console.error(`Error creating session: ${error}`);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({
        message: "Error creating session",
      }),
    };
  }
}

async function updateSession(event) {
  if (!event.body) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({
        message: "Request body is required",
      }),
    };
  }
  const body = JSON.parse(event.body);
  console.log("body", body);
  const sessionId = body.id;
  const userId = body.userId ? body.userId : null;
  const updatedAt = new Date().toISOString();

  const params = {
    TableName: tableName,
    Key: marshall({ id: sessionId }, { removeUndefinedValues: true }),
    UpdateExpression: "SET #userId = :userId, #updatedAt = :updatedAt",
    ExpressionAttributeNames: {
      "#userId": "userId",
      "#updatedAt": "updatedAt",
    },
    ExpressionAttributeValues: marshall(
      {
        ":userId": userId ? userId : null,
        ":updatedAt": updatedAt,
      },
      { removeUndefinedValues: true }
    ),
    ReturnValues: "UPDATED_NEW",
  };

  const updateItemCommand = new UpdateItemCommand(params);

  try {
    const { Attributes } = await ddbClient.send(updateItemCommand);
    const unmarshalledAttributes = unmarshall(Attributes);
    return {
      statusCode: 200,
      //  Uncomment below to enable CORS requests
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify(unmarshalledAttributes),
    };
  } catch (error) {
    console.error(`Error updating session: ${error}`);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({
        message: "Error updating session",
      }),
    };
  }
}

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

export async function handler(event) {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const sessionId = event.pathParameters
    ? event.pathParameters.sessionId
    : null;

  const userId = event.queryStringParameters
    ? event.queryStringParameters.userId
    : null;

  const httpMethod =
    event.httpMethod ||
    (event.requestContext &&
      event.requestContext.http &&
      event.requestContext.http.method);

  switch (httpMethod) {
    case "POST":
      return createSession(userId);
    case "GET":
      return getSession(sessionId);
    case "PATCH":
      return updateSession(event);
    default:
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
        },
        body: JSON.stringify({
          message: "Invalid input",
        }),
      };
  }
}
