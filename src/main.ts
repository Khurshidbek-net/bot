import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function start() {
  try {
    const PORT = process.env.PORT ?? 3030;
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix("api");
    app.use(cookieParser());

    app.enableCors({
      origin:(origin, callback) =>{
        const allowedOrigins = [
          "http://localhost:4000",
          "http://localhost:3000",
          "https://api.skidkachi.uz",
        ];

        if(!origin || allowedOrigins.includes(origin)){
          callback(null, true)
        }else{
          callback(new BadRequestException("Not allowed by CORS"))
        }
      },
      methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
      credential: true
    })

    const config = new DocumentBuilder()
      .setTitle("Chegirma Api")
      .setDescription('API documentation for My NestJS App')
      .setVersion('1.0')
      .addTag("Nest validation, swagger, sequelize, cookie, bot")
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, document);
    await app.listen(PORT, () =>{
      console.log(`Server running at: http://localhost:${PORT}`);
    })
  } catch (error) {
    console.log(error)
  }
}
start();
