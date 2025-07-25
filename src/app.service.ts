import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message:
        'Salve, corretor! Você está no ar! Bem-vindo ao mundo dos trainees! 🚀',
    };
  }
}
