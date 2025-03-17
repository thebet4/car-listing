import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CarUseCase } from "../../../../useCases/car.usecase";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "No file was provided" }),
    };
  }

  const carUseCase = new CarUseCase();

  const response = await carUseCase.uploadCarList({
    file: event.body,
  });

  return {
    statusCode: response.statusCode,
    body: JSON.stringify({
      message: response.message,
      file: response.file,
    }),
  };
};
