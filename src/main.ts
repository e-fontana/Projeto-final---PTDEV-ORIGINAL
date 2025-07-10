import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { env } from './utils/env-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Fala, Pablo!')
    .setDescription(
      'Acho que você deveria passar os três trainees! Não são gente, mas possuem sentimentos! \n\n Amamos você! 💛🖤',
    )
    .setVersion('1.0')
    .addTag('final-project')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
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
