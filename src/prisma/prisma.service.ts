import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name)

  constructor() {
    super({
      // OPTIMIZATION: Connection pooling configuration
      datasources: {
        db: {
          url: process.env.DATABASE_URL + '?connection_limit=10&pool_timeout=20&connect_timeout=10',
        },
      },
      // OPTIMIZATION: Query logging for debugging
      log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
      ],
    })

    // Log slow queries (> 1000ms)
    // @ts-expect-error - Prisma query event type not properly exposed
    this.$on('query', (e: any) => {
      if (e.duration > 1000) {
        this.logger.warn(`🐌 Slow query detected (${e.duration}ms): ${e.query.substring(0, 100)}...`)
      }
    })
  }

  async onModuleInit() {
    try {
      await this.$connect()
      this.logger.log('✅ Database connected successfully')
    } catch (error) {
      this.logger.error('❌ Failed to connect to database', error)
      throw error
    }
  }

  async onModuleDestroy() {
    await this.$disconnect()
    this.logger.log('🔌 Database disconnected')
  }

  // Helper method to clean database (useful for testing)
  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production')
    }

    const models = Reflect.ownKeys(this).filter((key) => key[0] !== '_' && key !== 'constructor')

    return Promise.all(
      models.map((modelKey) => {
        const model = this[modelKey as keyof typeof this]
        if (model && typeof model === 'object' && 'deleteMany' in model) {
          return (model as any).deleteMany()
        }
      }),
    )
  }

  // Helper for transaction queries with better logging
  async runTransaction<T>(
    fn: (prisma: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>) => Promise<T>,
    options?: { timeout?: number },
  ): Promise<T> {
    const startTime = Date.now()
    try {
      const result = await this.$transaction(fn, {
        timeout: options?.timeout || 30000, // 30s default
      })
      const duration = Date.now() - startTime
      if (duration > 5000) {
        this.logger.warn(`⚠️ Long transaction: ${duration}ms`)
      }
      return result
    } catch (error) {
      this.logger.error('Transaction failed:', error)
      throw error
    }
  }
}
