import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  Car,
  CarRepository,
  UploadCarResponse,
  UploadCarRequest,
} from "./car.interface";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

import xlsxToJson from "../../utils/xlsxToJson";
import extractZodErrors from "../../shared/extractZodErrors";
import jsonToXlsx from "../../utils/jsonToXlsx";
import uuid4 from "uuid4";
import { validateEntry } from "./car.schema";

export class DynamoCarRepository implements CarRepository {
  private TABLE_NAME: string;
  private dynamoClient: DynamoDBClient;
  private docClient: DynamoDBDocumentClient;
  constructor() {
    this.dynamoClient = new DynamoDBClient({});
    this.docClient = DynamoDBDocumentClient.from(this.dynamoClient);
    this.TABLE_NAME = "car-listing-challenge";
  }

  async uploadCarList(input: UploadCarRequest): Promise<UploadCarResponse> {
    const carList = xlsxToJson(input.file) as Car[];

    let hasErrors = false;
    const invalidData: Car[] = [];
    const errorData: string[] = [];

    for (const car of carList) {
      const errors = validateEntry(car); // Assume this returns the Zod error object
      if (errors) {
        hasErrors = true;
        const { message } = extractZodErrors(errors);

        invalidData.push(car);
        errorData.push(message);
      } else {
        await this.docClient.send(
          new PutCommand({
            TableName: this.TABLE_NAME,
            Item: {
              id: uuid4(),
              ...car,
            },
          })
        );
      }
    }

    if (!hasErrors) {
      return {
        statusCode: 200,
        message: "All entrances are valid",
      };
    }

    const invalidEntrances = invalidData.map((row, index) => {
      return {
        ...row,
        "Validation errors": errorData[index],
      };
    });

    const outputBuffer = jsonToXlsx(invalidEntrances);

    return {
      statusCode: 200,
      message: "Some entrances are invalid",
      file: outputBuffer.toString("base64"),
    };
  }
}
