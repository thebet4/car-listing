export interface Car {
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  color: string;
  vin: string;
}

export interface UploadCarRequest {
  file: string;
}

export interface UploadCarResponse {
  message: string;
  statusCode: number;
  file?: string;
}

export interface CarRepository {
  uploadCarList: (input: UploadCarRequest) => Promise<UploadCarResponse | null>;
}
