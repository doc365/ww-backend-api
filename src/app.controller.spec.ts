import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = module.get<AppController>(AppController);
  });

  describe('health()', () => {
    it('should return service health status', () => {
      expect(appController.health()).toEqual({
        status: 'ok',
        service: 'ww-backend-api',
      });
    });
  });
});
