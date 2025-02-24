import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IdentificationRequestsController } from './identification-requests.controller';
import { IdentificationRequestsService } from './identification-requests.service';
import { CreateIdentificationRequestDto } from './dto/create-identification-request.dto';
import { UpdateIdentificationRequestDto } from './dto/update-identification-request.dto';

const mockIdentificationRequestsService = {
  create: vi.fn(),
  findAll: vi.fn(),
  findOne: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
};

describe('IdentificationRequestsController', () => {
  let controller: IdentificationRequestsController;

  beforeEach(() => {
    controller = new IdentificationRequestsController(mockIdentificationRequestsService as unknown as IdentificationRequestsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new identification request', async () => {
    const dto: CreateIdentificationRequestDto = {
      uuidMember: '123e4567-e89b-12d3-a456-426614174000',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
    };
    const result = { ...dto, uuid: '123e4567-e89b-12d3-a456-426614174001' };
    mockIdentificationRequestsService.create.mockResolvedValue(result);
    expect(await controller.create(dto)).toEqual(result);
    expect(mockIdentificationRequestsService.create).toHaveBeenCalledWith(dto);
  });

  it('should return an array of identification requests', async () => {
    const result = [{ uuid: '123e4567-e89b-12d3-a456-426614174000', uuidMember: '123e4567-e89b-12d3-a456-426614174000', firstname: 'John', lastname: 'Doe', email: 'john.doe@example.com' }];
    mockIdentificationRequestsService.findAll.mockResolvedValue(result);
    expect(await controller.findAll()).toEqual(result);
    expect(mockIdentificationRequestsService.findAll).toHaveBeenCalled();
  });

  it('should return a single identification request', async () => {
    const result = { uuid: '123e4567-e89b-12d3-a456-426614174000', uuidMember: '123e4567-e89b-12d3-a456-426614174000', firstname: 'John', lastname: 'Doe', email: 'john.doe@example.com' };
    mockIdentificationRequestsService.findOne.mockResolvedValue(result);
    expect(await controller.findOne('123e4567-e89b-12d3-a456-426614174000')).toEqual(result);
    expect(mockIdentificationRequestsService.findOne).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
  });

  it('should update an identification request', async () => {
    const dto: UpdateIdentificationRequestDto = { firstname: 'Jane' };
    const result = { uuid: '123e4567-e89b-12d3-a456-426614174000', uuidMember: '123e4567-e89b-12d3-a456-426614174000', firstname: 'Jane', lastname: 'Doe', email: 'john.doe@example.com' };
    mockIdentificationRequestsService.update.mockResolvedValue(result);
    expect(await controller.update('123e4567-e89b-12d3-a456-426614174000', dto)).toEqual(result);
    expect(mockIdentificationRequestsService.update).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000', dto);
  });

  it('should delete an identification request', async () => {
    mockIdentificationRequestsService.remove.mockResolvedValue({ affected: 1 });
    expect(await controller.remove('123e4567-e89b-12d3-a456-426614174000')).toEqual({ affected: 1 });
    expect(mockIdentificationRequestsService.remove).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
  });
});
