import { Test, TestingModule } from '@nestjs/testing';
import { GuildController } from './guilds.controller';
import { GuildService } from './guilds.service';

describe('GuildController', () => {
  let controller: GuildController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuildController],
      providers: [GuildService],
    }).compile();

    controller = module.get<GuildController>(GuildController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
