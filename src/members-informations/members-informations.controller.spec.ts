import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MembersInformationsController } from './members-informations.controller';
import { MembersInformationsService } from './members-informations.service';
import { CreateMemberInformationsDto } from './dto/create-member-informations.dto';
import { UpdateMemberInformationsDto } from './dto/update-member-informations.dto';

// Création d'un mock du service
const mockMembersInformationsService = {
  create: vi.fn(),
  findAll: vi.fn(),
  findOne: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
};

describe('MembersInformationsController', () => {
  let controller: MembersInformationsController;

  beforeEach(() => {
    controller = new MembersInformationsController(
      mockMembersInformationsService as unknown as MembersInformationsService
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new member information', async () => {
    const dto: CreateMemberInformationsDto = {
      uuidMember: '123e4567-e89b-12d3-a456-4266141740000000',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    };
    mockMembersInformationsService.create.mockResolvedValue(dto);
    expect(await controller.create(dto)).toEqual(dto);
    expect(mockMembersInformationsService.create).toHaveBeenCalledWith(dto);
  });

  it('should return an array of members informations', async () => {
    const result = [{ uuid: '123e4567-e89b-12d3-a456-4266141740000000', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' }];
    mockMembersInformationsService.findAll.mockResolvedValue(result);
    expect(await controller.findAll()).toEqual(result);
    expect(mockMembersInformationsService.findAll).toHaveBeenCalled();
  });

  it('should return a single member information', async () => {
    const result = { uuid: '123e4567-e89b-12d3-a456-4266141740000000', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' };
    mockMembersInformationsService.findOne.mockResolvedValue(result);
    expect(await controller.findOne('123e4567-e89b-12d3-a456-4266141740000000')).toEqual(result);
    expect(mockMembersInformationsService.findOne).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-4266141740000000');
  });

  it('should update a member information', async () => {
    const dto: UpdateMemberInformationsDto = { firstName: 'Jane' };
    const result = { uuid: '123e4567-e89b-12d3-a456-4266141740000000', firstName: 'Jane', lastName: 'Doe', email: 'john.doe@example.com' };
    mockMembersInformationsService.update.mockResolvedValue(result);
    expect(await controller.update('123e4567-e89b-12d3-a456-4266141740000000', dto)).toEqual(result);
    expect(mockMembersInformationsService.update).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-4266141740000000', dto);
  });

  it('should delete a member information', async () => {
    mockMembersInformationsService.remove.mockResolvedValue({ affected: 1 });
    expect(await controller.remove('123e4567-e89b-12d3-a456-4266141740000000')).toEqual({ affected: 1 });
    expect(mockMembersInformationsService.remove).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-4266141740000000');
  });
});
