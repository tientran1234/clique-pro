import { Module, Global } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

const sharedServices = [PrismaService]

@Global()
@Module({
  providers: sharedServices,
  exports: sharedServices,
})
export class SharedModule {}
