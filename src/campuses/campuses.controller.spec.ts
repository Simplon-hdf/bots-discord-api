import { Test, TestingModule } from '@nestjs/testing';
import { CampusController } from './campuses.controller';
import { CampusService } from './campuses.service';

describe('CampusController', () => {
  let controller: CampusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampusController],
      providers: [CampusService],
    }).compile();

    controller = module.get<CampusController>(CampusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
