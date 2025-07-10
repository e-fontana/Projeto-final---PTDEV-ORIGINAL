import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './utils/env-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(env.PORT ?? 3000);
}

bootstrap()
  .then(() => {
    console.log(
      `🤖 [PROJETO FINAL]: Servidor rodando em: http://localhost:${env.PORT ?? 3000}`,
    );
  })
  .catch((error) => {
    console.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  });
