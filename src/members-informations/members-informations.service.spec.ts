import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { MembersInformationsService } from './members-informations.service';
import { Repository } from 'typeorm';
import { MemberInformation } from './entities/member-information.entity';
import { CreateMemberInformationsDto } from './dto/create-member-informations.dto';
import { UpdateMemberInformationsDto } from './dto/update-member-informations.dto';

const mockRepository = {
  find: vi.fn(),
  findOneBy: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
  update: vi.fn(),
};

describe('MembersInformationsService', () => {
  let service: MembersInformationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersInformationsService,
        {
          provide: getRepositoryToken(MemberInformation),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MembersInformationsService>(MembersInformationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new member information', async () => {
    const dto: CreateMemberInformationsDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    };
    const entity = { 
      ...dto, 
      uuid: '123e4567-e89b-12d3-a456-426614174000',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockRepository.save.mockResolvedValue(entity);

    const result = await service.create(dto);
    expect(result).toEqual(entity);
    expect(mockRepository.save).toHaveBeenCalledWith(dto);
  });

  it('should return an array of members informations', async () => {
    const result = [{
      uuid: '123e4567-e89b-12d3-a456-426614174000',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }];
    mockRepository.find.mockResolvedValue(result);

    expect(await service.findAll()).toEqual(result);
    expect(mockRepository.find).toHaveBeenCalled();
  });

  it('should return a single member information', async () => {
    const result = {
      uuid: '123e4567-e89b-12d3-a456-426614174000',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockRepository.findOneBy.mockResolvedValue(result);

    expect(await service.findOne('123e4567-e89b-12d3-a456-426614174000')).toEqual(result);
    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ uuid: '123e4567-e89b-12d3-a456-426614174000' });
  });

  it('should update a member information', async () => {
    const dto: UpdateMemberInformationsDto = { firstName: 'Jane' };
    const existingMemberInfo = {
      uuid: '123e4567-e89b-12d3-a456-426614174000',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const updatedMemberInfo = {
      ...existingMemberInfo,
      firstName: 'Jane',
      updatedAt: expect.any(Date)
    };
    
    // Réinitialiser les mocks
    vi.clearAllMocks();
    
    // Mock findOneBy pour retourner le membre existant
    mockRepository.findOneBy.mockResolvedValue(existingMemberInfo);
    
    // Mock save pour simuler la sauvegarde
    mockRepository.save.mockImplementation((entity) => {
      // Vérifier que l'entité a bien été mise à jour
      expect(entity.firstName).toBe('Jane');
      expect(entity.updatedAt).toBeInstanceOf(Date);
      
      // Retourner l'entité mise à jour
      return Promise.resolve(entity);
    });
    
    // Appeler la méthode update
    const result = await service.update('123e4567-e89b-12d3-a456-426614174000', dto);
    
    // Vérifier que findOneBy a été appelé avec le bon uuid
    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ uuid: '123e4567-e89b-12d3-a456-426614174000' });
    
    // Vérifier que save a été appelé
    expect(mockRepository.save).toHaveBeenCalled();
    
    // Vérifier que le résultat contient les bonnes valeurs
    expect(result.firstName).toBe('Jane');
    expect(result.lastName).toBe('Doe');
    expect(result.email).toBe('john.doe@example.com');
    expect(result.updatedAt).toBeInstanceOf(Date);
  });

  it('should delete a member information', async () => {
    const result = { affected: 1 };
    mockRepository.delete.mockResolvedValue(result);

    expect(await service.remove('123e4567-e89b-12d3-a456-426614174000')).toEqual(result);
    expect(mockRepository.delete).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
  });
});

