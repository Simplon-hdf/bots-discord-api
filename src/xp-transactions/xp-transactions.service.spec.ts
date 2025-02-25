import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { XpTransactionsService } from './xp-transactions.service';
import { XpTransaction, XpTransactionType, XpTransactionSource } from './entities/xp-transaction.entity';
import { Member } from '../members/entities/member.entity';
import { CreateXpTransactionDto } from './dto/create-xp-transaction.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('XpTransactionsService', () => {
  let service: XpTransactionsService;
  let xpTransactionRepository: Repository<XpTransaction>;
  let memberRepository: Repository<Member>;

  const mockMember = {
    uuidMember: '123e4567-e89b-12d3-a456-426614174000',
    guildUsername: 'TestUser',
    communityRole: 'Member',
  } as Member;

  const mockXpTransaction = {
    uuidXpTransaction: '123e4567-e89b-12d3-a456-426614174001',
    transactionType: XpTransactionType.GAIN,
    source: XpTransactionSource.VOTE,
    transactionValue: '100.00',
    reason: 'Test transaction',
    notes: 'Test notes',
    createdAt: new Date(),
    member: mockMember,
  } as XpTransaction;

  const mockCreateDto: CreateXpTransactionDto = {
    uuidMember: mockMember.uuidMember,
    transactionType: XpTransactionType.GAIN,
    source: XpTransactionSource.VOTE,
    transactionValue: '100.00',
    reason: 'Test transaction',
    notes: 'Test notes',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        XpTransactionsService,
        {
          provide: getRepositoryToken(XpTransaction),
          useValue: {
            create: vi.fn().mockReturnValue(mockXpTransaction),
            save: vi.fn().mockResolvedValue(mockXpTransaction),
            find: vi.fn().mockResolvedValue([mockXpTransaction]),
            findOne: vi.fn().mockResolvedValue(mockXpTransaction),
          },
        },
        {
          provide: getRepositoryToken(Member),
          useValue: {
            findOne: vi.fn().mockResolvedValue(mockMember),
          },
        },
      ],
    }).compile();

    service = module.get<XpTransactionsService>(XpTransactionsService);
    xpTransactionRepository = module.get<Repository<XpTransaction>>(
      getRepositoryToken(XpTransaction),
    );
    memberRepository = module.get<Repository<Member>>(
      getRepositoryToken(Member),
    );
  });

  describe('create', () => {
    it('devrait créer une nouvelle transaction XP', async () => {
      const result = await service.create(mockCreateDto);
      expect(result).toBeDefined();
      expect(result.transactionType).toBe(mockXpTransaction.transactionType);
      expect(result.transactionValue).toBe(mockXpTransaction.transactionValue);
    });

    it('devrait lever une exception si le membre n\'existe pas', async () => {
      vi.spyOn(memberRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.create(mockCreateDto)).rejects.toThrow(NotFoundException);
    });

    it('devrait lever une exception si la valeur de la transaction est invalide', async () => {
      const invalidDto = { ...mockCreateDto, transactionValue: 'invalid' };
      await expect(service.create(invalidDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('devrait retourner toutes les transactions XP', async () => {
      const result = await service.findAll();
      expect(result).toHaveLength(1);
      expect(result[0].uuidXpTransaction).toBe(mockXpTransaction.uuidXpTransaction);
    });
  });

  describe('findByMember', () => {
    it('devrait retourner les transactions XP d\'un membre', async () => {
      const result = await service.findByMember(mockMember.uuidMember);
      expect(result).toHaveLength(1);
      expect(result[0].member.uuidMember).toBe(mockMember.uuidMember);
    });

    it('devrait lever une exception si le membre n\'existe pas', async () => {
      vi.spyOn(memberRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.findByMember('invalid-uuid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('devrait retourner une transaction XP spécifique', async () => {
      const result = await service.findOne(mockXpTransaction.uuidXpTransaction);
      expect(result.uuidXpTransaction).toBe(mockXpTransaction.uuidXpTransaction);
    });

    it('devrait lever une exception si la transaction n\'existe pas', async () => {
      vi.spyOn(xpTransactionRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.findOne('invalid-uuid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('devrait lever une exception car la suppression n\'est pas autorisée', async () => {
      await expect(service.remove(mockXpTransaction.uuidXpTransaction)).rejects.toThrow(BadRequestException);
    });
  });
}); 