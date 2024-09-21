import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getPostgresConfig } from '../configs/postgres.config';
import { UserModule } from './user/user.module';
import { DoctorModule } from './doctor/doctor.module';
import { AppointmentModule } from './appointment/appointment.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { UploadModule } from './upload/upload.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './.env',
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '30d' },
      }),
    }),
    TypeOrmModule.forRootAsync(getPostgresConfig()),
    UserModule,
    DoctorModule,
    AppointmentModule,
    AuthModule,
    UploadModule,
    QueueModule,
  ],
  providers: [AuthGuard],
  controllers: [],
})

export class AppModule {}
