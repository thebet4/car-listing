import { z } from "zod";

const schema = z.object({
  make: z.string({
    required_error: "Make is a required field",
  }),
  model: z.string({
    required_error: "Model is a required field",
  }),
  year: z.number({
    required_error: "Year is a required field",
  }),
  price: z.number({
    required_error: "Price is a required field",
  }),
  mileage: z.number({
    required_error: "Mileage is a required field",
  }),
  color: z.string().optional(),
  vin: z.string({
    required_error: "VIN is a required field",
  }),
});

export const validateEntry = (data: any) => {
  const result = schema.safeParse(data);
  return result.success ? null : result.error.format();
};
