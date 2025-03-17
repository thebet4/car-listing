import { DynamoCarRepository } from "../domain/car/car.repository";
import { UploadCarRequest } from "../domain/car/car.interface";

export class CarUseCase {
  private carRepository: DynamoCarRepository;
  constructor() {
    this.carRepository = new DynamoCarRepository();
  }

  async uploadCarList({ file }: UploadCarRequest) {
    try {
      const response = this.carRepository.uploadCarList({
        file,
      });

      return response;
    } catch (error) {
      return {
        statusCode: 502,
        message: "Internal Server Error",
      };
    }
  }
}
