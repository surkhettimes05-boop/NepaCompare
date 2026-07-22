import { Test, TestingModule } from '@nestjs/testing';
import { WellnessController } from './wellness.controller';

describe('WellnessController', () => {
  let controller: WellnessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WellnessController],
    }).compile();

    controller = module.get<WellnessController>(WellnessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
