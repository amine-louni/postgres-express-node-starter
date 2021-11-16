import { ValidationError } from "class-validator";

export default (errors: ValidationError[]) => {
    const formattedErrors: { field: string, code: string, description: string }[] = errors.map((oneError) => {
        return {
            code: 'uknown_error', field: oneError.property, description: Object.values(oneError.constraints!).join('\n')
        }
    })
    return formattedErrors;
}