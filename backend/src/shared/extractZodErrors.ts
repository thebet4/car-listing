const extractZodErrors = (
  errorsObj: any
): { message: string; invalidFields: string[] } => {
  if (!errorsObj || typeof errorsObj !== "object")
    return { message: "", invalidFields: [] };

  const errorList: string[] = [];
  const invalidFields: string[] = [];

  Object.entries(errorsObj).forEach(([key, value]: [string, any]) => {
    if (key === "_errors" && Array.isArray(value) && value.length > 0) {
      errorList.push(value.join(", "));
    } else if (typeof value === "object" && "_errors" in value) {
      errorList.push(value._errors.join(", "));
      invalidFields.push(key); // Track which fields have errors
    }
  });

  return { message: errorList.join(" | "), invalidFields };
};

export default extractZodErrors;
