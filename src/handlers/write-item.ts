import 'source-map-support/register';
import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult
} from "aws-lambda";

import { write } from '../utils/dynamodb';

export const writeItemHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
    console.info('the event!:', event);

    let response;
    if (event.body) {
      const body = JSON.parse(event.body);
      const item = { PK: { S: body.id }, quote: { S: body.quote } };

      const res = await write(item);

      console.info('Written to DynamoDB:', res)

      response = {
          statusCode: 200,
          body: JSON.stringify(item)
      };
    } else {
        response = {
            statusCode: 419,
            body: 'something about teapots'
        }
    }

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
