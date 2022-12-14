import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import { AuthModule } from './auth/auth.module';
import {typeormConfig} from "./config/typeorm.config";

@Module({
  imports: [TypeOrmModule.forRoot(typeormConfig), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
