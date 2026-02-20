import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common'
import { Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest()
    const status = exception.getStatus()
    const exceptionResponse = exception.getResponse()

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: typeof exceptionResponse === 'string' ? exceptionResponse : (exceptionResponse as any).message,
      errors: typeof exceptionResponse === 'object' ? (exceptionResponse as any).errors : undefined,
    }

    this.logger.warn(`HTTP Exception: ${status} - ${request.method} ${request.url}`)

    response.status(status).json(errorResponse)
  }
}
