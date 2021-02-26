const {
  DynamoDBClient,
  DynamoDBClientConfig,
  ScanCommand,
  PutItemCommand,
  GetItemCommand
} = require("@aws-sdk/client-dynamodb");

const config: InstanceType<typeof DynamoDBClientConfig> = {
  region: "ap-southeast-2"
}

if (process.env.AWS_SAM_LOCAL) {
  config.endpoint = "http://dynamodb:8000"
}

const dbclient = new DynamoDBClient(config);

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
