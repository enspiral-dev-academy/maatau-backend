// Create a DocumentClient that represents the query to add an item
import DynamoDB from 'aws-sdk/clients/dynamodb';

// Declare some custom client just to illustrate how TS will include only used files into lambda distribution
export default class CustomDynamoClient {
    table: string;
    docClient: DynamoDB.DocumentClient;

    // (we know that the || 'MatatauTable' is wrong but we'll come back to that lol)
    constructor(table = process.env.DB_TABLE || 'MatatauTable') {
      console.log('table:', table)
      const options = {
        region: 'ap-southeast-2'
      }
      if (process.env.AWS_SAM_LOCAL) {
        console.log('Using local DynamoDB database')
        // options.endpoint = 'http://dynamodb:8000'
      }
      this.docClient = new DynamoDB.DocumentClient(options);
      this.table = table;
    }

    async readAll() {
        const data = await this.docClient.scan({ TableName: this.table }).promise();
        return data.Items;
    }

    async read(id: any) {
        var params = {
            TableName : this.table,
            Key: { PK: id },
        };
        const data = await this.docClient.get(params).promise();
        return data.Item;
    }

    async write(Item: object) {
        const params = {
            TableName: this.table,
            Item,
        };

        return await this.docClient.put(params).promise();
    }
}
