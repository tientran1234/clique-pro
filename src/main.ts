import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { cleanupOpenApiDoc } from 'nestjs-zod'
import envConfig from './shared/config'

async function bootstrap() {
  const logger = new Logger('Bootstrap')

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  })

  // Enable CORS
  const allowedOrigins = envConfig.ALLOWED_ORIGINS.split(',')
  app.enableCors({
    origin: envConfig.NODE_ENV === 'development' ? true : allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  })

  // Global prefix
  app.setGlobalPrefix('api')

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Clique Dating API')
    .setDescription('The API for the Clique dating application')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const documentFactory = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, cleanupOpenApiDoc(documentFactory), {
    swaggerOptions: {
      persistAuthorization: true,
    },
  })

  const port = envConfig.PORT
  await app.listen(port)

  logger.log(`🚀 Application is running on: http://localhost:${port}/api`)
  logger.log(`📚 Swagger Docs: http://localhost:${port}/api`)
  logger.log(`📊 Environment: ${envConfig.NODE_ENV}`)
  logger.log(`🗄️  Database: ${envConfig.DATABASE_URL.split('?')[0]}`)
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start application:', error)
  process.exit(1)
})
