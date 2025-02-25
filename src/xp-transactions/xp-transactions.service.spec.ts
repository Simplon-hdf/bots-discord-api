import { Test, TestingModule } from '@nestjs/testing';
import { XpTransactionsService } from './xp-transactions.service';
import { CreateXpTransactionDto } from './dto/create-xp-transaction.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { XpTransaction, XpTransactionType, XpTransactionSource } from './entities/xp-transaction.entity';
import { Member } from '../members/entities/member.entity';
import { Repository } from 'typeorm';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('XpTransactionsService', () => {
  let service: XpTransactionsService;
  let xpTransactionRepository: Repository<XpTransaction>;
  let memberRepository: Repository<Member>;

  // Mock des données de test
  const mockCreateDto: CreateXpTransactionDto = {
    uuidMember: '123e4567-e89b-12d3-a456-426614174000',
    transactionType: XpTransactionType.GAIN,
    source: XpTransactionSource.VOTE,
    transactionValue: '100.00',
    reason: 'Test transaction',
    notes: 'Test notes'
  };

  const mockMember = {
    uuidMember: '123e4567-e89b-12d3-a456-426614174000',
    guildUsername: 'TestUser',
    communityRole: 'Member'
  };

  const mockTransaction = {
    uuidXpTransaction: '550e8400-e29b-41d4-a716-446655440000',
    ...mockCreateDto,
    member: mockMember,
    createdAt: new Date()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        XpTransactionsService,
        {
          provide: getRepositoryToken(XpTransaction),
          useValue: {
            create: vi.fn().mockReturnValue(mockTransaction),
            save: vi.fn().mockResolvedValue(mockTransaction),
            find: vi.fn().mockResolvedValue([mockTransaction]),
            findOne: vi.fn().mockResolvedValue(mockTransaction)
          }
        },
        {
          provide: getRepositoryToken(Member),
          useValue: {
            findOne: vi.fn().mockResolvedValue(mockMember)
          }
        }
      ],
    }).compile();

    service = module.get<XpTransactionsService>(XpTransactionsService);
    xpTransactionRepository = module.get<Repository<XpTransaction>>(getRepositoryToken(XpTransaction));
    memberRepository = module.get<Repository<Member>>(getRepositoryToken(Member));
  });

  describe('create', () => {
    it('devrait créer une nouvelle transaction XP', async () => {
      // Act
      const result = await service.create(mockCreateDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.uuidXpTransaction).toBe(mockTransaction.uuidXpTransaction);
    });

    it('devrait échouer si le membre n\'existe pas', async () => {
      // Arrange
      vi.spyOn(memberRepository, 'findOne').mockResolvedValueOnce(null);

      // Act & Assert
      await expect(service.create(mockCreateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('devrait retourner toutes les transactions XP', async () => {
      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].uuidXpTransaction).toBe(mockTransaction.uuidXpTransaction);
    });
  });

  describe('findByMember', () => {
    it('devrait retourner les transactions XP d\'un membre', async () => {
      // Act
      const result = await service.findByMember(mockMember.uuidMember);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].uuidXpTransaction).toBe(mockTransaction.uuidXpTransaction);
    });

    it('devrait échouer si le membre n\'existe pas', async () => {
      // Arrange
      vi.spyOn(memberRepository, 'findOne').mockResolvedValueOnce(null);

      // Act & Assert
      await expect(service.findByMember('invalid-uuid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('devrait retourner une transaction XP spécifique', async () => {
      // Act
      const result = await service.findOne(mockTransaction.uuidXpTransaction);

      // Assert
      expect(result).toBeDefined();
      expect(result.uuidXpTransaction).toBe(mockTransaction.uuidXpTransaction);
    });

    it('devrait échouer si la transaction n\'existe pas', async () => {
      // Arrange
      vi.spyOn(xpTransactionRepository, 'findOne').mockResolvedValueOnce(null);

      // Act & Assert
      await expect(service.findOne('invalid-uuid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('devrait échouer car la suppression n\'est pas autorisée', async () => {
      // Act & Assert
      await expect(service.remove(mockTransaction.uuidXpTransaction)).rejects.toThrow(BadRequestException);
    });
  });
}); 