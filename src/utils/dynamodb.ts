const { DynamoDBClient, ScanCommand, PutItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const REGION = "ap-southeast-2";

const dbclient = new DynamoDBClient({ region: REGION, endpoint: 'http://dynamodb:8000' });

export async function readAll() {
  const params = {
    TableName: process.env.DB_TABLE,
    ProjectionExpression: "PK"
  };

  try {
    const data = await dbclient.send(new ScanCommand(params));
    return data.Items
  } catch (err) {
    console.log("Error", err);
  }
}

export async function write(item: object) {
  const params = {
    TableName: process.env.DB_TABLE,
    Item: item
  }
  try {
    const data = await dbclient.send(new PutItemCommand(params));
    console.info('data:', data);
    return data
  } catch (err) {
    console.error(err);
  }
};

export async function read (id: any) {
  const params = {
    TableName: process.env.DB_TABLE,
    Key: {
      PK: { S: id },
    },
    ProjectionExpression: "PK, quote",
  };
  const data = await dbclient.send(new GetItemCommand(params));
  console.log("Success", data.Item);
  return data.Item;
};
