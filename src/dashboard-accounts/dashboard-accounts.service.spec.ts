import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DashboardAccountService } from './dashboard-accounts.service';
import { DashboardAccount } from './entities/dashboard-account.entity';
import { Repository } from 'typeorm';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotFoundException } from '@nestjs/common';

describe('DashboardAccountService', () => {
  let service: DashboardAccountService;
  let repository: Repository<DashboardAccount>;

  const mockDashboardAccount = {
    uuidDashboardAccount: '123e4567-e89b-12d3-a456-426614174000',
    uuidDiscord: '123456789012345678',
    email: 'test@example.com',
    password: 'hashedPassword123'
  };

  const mockRepository = {
    create: vi.fn(),
    save: vi.fn(),
    findOne: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DashboardAccountService,
        {
          provide: getRepositoryToken(DashboardAccount),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DashboardAccountService>(DashboardAccountService);
    repository = module.get<Repository<DashboardAccount>>(getRepositoryToken(DashboardAccount));
  });

  describe('create', () => {
    it('should create a dashboard account', async () => {
      const createDto = {
        email: 'test@example.com',
        password: 'password123'
      };

      mockRepository.create.mockReturnValue(mockDashboardAccount);
      mockRepository.save.mockResolvedValue(mockDashboardAccount);

      const createDtoWithUUID = {
        ...createDto,
        uuidDashboardAccount: mockDashboardAccount.uuidDashboardAccount
        uuidDiscord: mockDashboardAccount.uuidDiscord
      };

      const result = await service.create(createDtoWithUUID);

      expect(result).toEqual(mockDashboardAccount);
      expect(mockRepository.create).toHaveBeenCalledWith(createDtoWithUUID);
      expect(mockRepository.save).toHaveBeenCalledWith(mockDashboardAccount);
    });
  });

  describe('getByUUID', () => {
    it('should return a dashboard account', async () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      mockRepository.findOne.mockResolvedValue(mockDashboardAccount);

      const result = await service.getByUUID(uuid);

      expect(result).toEqual(mockDashboardAccount);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { uuidDashboardAccount: uuid }
      });
    });

    it('should throw NotFoundException when account not found', async () => {
      const uuid = 'non-existent-uuid';
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getByUUID(uuid)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteByUUID', () => {
    it('should delete a dashboard account', async () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      mockRepository.findOne.mockResolvedValue(mockDashboardAccount);
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.deleteByUUID(uuid);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { uuidDashboardAccount: uuid }
      });
      expect(mockRepository.delete).toHaveBeenCalledWith({ uuidDashboardAccount: uuid });
    });

    it('should throw NotFoundException when account not found', async () => {
      const uuid = 'non-existent-uuid';
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteByUUID(uuid)).rejects.toThrow(NotFoundException);
    });
  });
});