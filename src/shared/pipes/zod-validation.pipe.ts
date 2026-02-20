import { UnprocessableEntityException } from '@nestjs/common'
import { createZodValidationPipe, ZodValidationPipe } from 'nestjs-zod'
import { ZodError } from 'zod'

const CustomZodValidationPipe: typeof ZodValidationPipe = createZodValidationPipe({
  createValidationException: (error: ZodError) => {
    return new UnprocessableEntityException({
      statusCode: 422,
      message: 'Validation failed',
      errors: error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
        code: issue.code,
      })),
    })
  },
})

export default CustomZodValidationPipe
