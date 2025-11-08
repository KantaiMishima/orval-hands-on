import zod from "zod";

export const generateValidatorByZod = <T>(schema: zod.ZodType<T>) => {
  return (values: unknown): string => {
    const result = schema.safeParse(values);
    if (result.success) {
      return "";
    } else {
      return zod.prettifyError(result.error);
    }
  };
}