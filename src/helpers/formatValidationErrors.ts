import { ValidationError } from "class-validator";

export default (errors: ValidationError[]) => {
  const formattedErrors:
    | {
        field: string;
        code: string;
        description: string;
      }[] = errors.map((oneError) => {
    return {
      code: oneError.constraints
        ? Object.keys(oneError.constraints).join("")
        : "uknown",
      field: oneError.property,
      description: oneError.constraints
        ? Object.values(oneError.constraints).join("\n")
        : "uknown",
    };
  });
  return formattedErrors;
};
