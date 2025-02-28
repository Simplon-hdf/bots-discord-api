import { Test, TestingModule } from '@nestjs/testing';
import { PromotionsService } from './promotions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Promotion } from './entities/promotion.entity';
import { Role } from '../roles/entities/role.entity';
import { Member } from '../members/entities/member.entity';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Repository } from 'typeorm';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

describe('PromotionsService', () => {
  let service: PromotionsService;
  let promotionRepository: Repository<Promotion>;
  let roleRepository: Repository<Role>;
  let memberRepository: Repository<Member>;

  const mockPromotionRepository = {
    create: vi.fn(),
    save: vi.fn(),
    find: vi.fn(),
    findOne: vi.fn(),
    findOneBy: vi.fn(),
    remove: vi.fn(),
  };

  const mockRoleRepository = {
    create: vi.fn(),
    save: vi.fn(),
    findOneBy: vi.fn(),
  };

  const mockMemberRepository = {
    findOneBy: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromotionsService,
        {
          provide: getRepositoryToken(Promotion),
          useValue: mockPromotionRepository,
        },
        {
          provide: getRepositoryToken(Role),
          useValue: mockRoleRepository,
        },
        {
          provide: getRepositoryToken(Member),
          useValue: mockMemberRepository,
        },
      ],
    }).compile();

    service = module.get<PromotionsService>(PromotionsService);
    promotionRepository = module.get<Repository<Promotion>>(getRepositoryToken(Promotion));
    roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
    memberRepository = module.get<Repository<Member>>(getRepositoryToken(Member));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new promotion with associated role', async () => {
      const createPromotionDto: CreatePromotionDto = {
        name: 'Test Promotion',
        startDate: new Date(),
        endDate: new Date(),
        status: 'active',
        uuidCourse: '123e4567-e89b-12d3-a456-426614174000',
        uuidGuild: '123456789012345678',
        uuidRole: '234567890123456789',
      };

      const newRole = {
        uuidRole: '234567890123456789',
        uuidGuild: '123456789012345678',
        name: 'Test Promotion',
        memberCount: 0,
        rolePosition: 0,
        hoist: false,
        color: "#000000",
      };

      const savedPromotion = {
        uuid: '123e4567-e89b-12d3-a456-426614174001',
        ...createPromotionDto,
      };

      mockRoleRepository.create.mockReturnValue(newRole);
      mockRoleRepository.save.mockResolvedValue(newRole);
      mockPromotionRepository.create.mockReturnValue(savedPromotion);
      mockPromotionRepository.save.mockResolvedValue(savedPromotion);

      const result = await service.create(createPromotionDto);

      expect(mockRoleRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        uuidRole: createPromotionDto.uuidRole,
        uuidGuild: createPromotionDto.uuidGuild,
        name: createPromotionDto.name,
      }));
      expect(mockRoleRepository.save).toHaveBeenCalledWith(newRole);
      expect(mockPromotionRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        ...createPromotionDto,
        uuidRole: newRole.uuidRole,
      }));
      expect(mockPromotionRepository.save).toHaveBeenCalledWith(savedPromotion);
      expect(result).toEqual(savedPromotion);
    });
  });

  describe('findAll', () => {
    it('should return an array of promotions with relations', async () => {
      const promotions = [
        { uuid: '123e4567-e89b-12d3-a456-426614174001', name: 'Promotion 1' },
        { uuid: '123e4567-e89b-12d3-a456-426614174002', name: 'Promotion 2' },
      ];
      mockPromotionRepository.find.mockResolvedValue(promotions);

      const result = await service.findAll();

      expect(mockPromotionRepository.find).toHaveBeenCalledWith({
        relations: ['followers', 'managers', 'category', 'course', 'campus', 'role', 'guild']
      });
      expect(result).toEqual(promotions);
    });
  });

  describe('findOne', () => {
    it('should return a single promotion with relations', async () => {
      const promotion = { uuid: '123e4567-e89b-12d3-a456-426614174001', name: 'Promotion 1' };
      mockPromotionRepository.findOne.mockResolvedValue(promotion);

      const result = await service.findOne('123e4567-e89b-12d3-a456-426614174001');

      expect(mockPromotionRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: '123e4567-e89b-12d3-a456-426614174001' },
        relations: ['followers', 'managers', 'category', 'course', 'campus', 'role', 'guild']
      });
      expect(result).toEqual(promotion);
    });
  });

  describe('update', () => {
    it('should update a promotion', async () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174001';
      const updatePromotionDto: UpdatePromotionDto = { 
        name: 'Updated Promotion',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-12-31'),
      };
      
      const existingPromotion = { 
        uuid,
        name: 'Old Promotion',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-11-30'),
        updatedAt: new Date(),
      };
      
      const updatedPromotion = { 
        ...existingPromotion,
        ...updatePromotionDto,
        updatedAt: expect.any(Date),
      };

      mockPromotionRepository.findOne.mockResolvedValue(existingPromotion);
      mockPromotionRepository.save.mockResolvedValue(updatedPromotion);

      const result = await service.update(uuid, updatePromotionDto);

      expect(mockPromotionRepository.findOne).toHaveBeenCalledWith({
        where: { uuid },
        relations: ['followers', 'managers', 'category', 'course', 'campus', 'role', 'guild']
      });
      expect(mockPromotionRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        ...existingPromotion,
        ...updatePromotionDto,
        updatedAt: expect.any(Date),
      }));
      expect(result).toEqual(updatedPromotion);
    });
  });

  describe('remove', () => {
    it('should remove a promotion', async () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174001';
      const promotion = { uuid, name: 'Promotion to Remove' };
      
      mockPromotionRepository.findOne.mockResolvedValue(promotion);
      mockPromotionRepository.remove.mockResolvedValue(promotion);

      const result = await service.remove(uuid);

      expect(mockPromotionRepository.findOne).toHaveBeenCalledWith({
        where: { uuid },
        relations: ['followers', 'managers', 'category', 'course', 'campus', 'role', 'guild']
      });
      expect(mockPromotionRepository.remove).toHaveBeenCalledWith(promotion);
      expect(result).toEqual(promotion);
    });
  });

  describe('addFollower', () => {
    it('should add a member as follower to a promotion', async () => {
      const uuidPromotion = '123e4567-e89b-12d3-a456-426614174001';
      const uuidMember = '123e4567-e89b-12d3-a456-426614174002';
      
      const promotion = { 
        uuid: uuidPromotion, 
        name: 'Test Promotion',
        followers: [],
      };
      
      const member = { uuidMember, guildUsername: 'TestUser' };
      const updatedPromotion = { 
        ...promotion,
        followers: [member],
      };

      mockPromotionRepository.findOne.mockResolvedValue(promotion);
      mockMemberRepository.findOneBy.mockResolvedValue(member);
      mockPromotionRepository.save.mockResolvedValue(updatedPromotion);

      const result = await service.addFollower(uuidPromotion, uuidMember);

      expect(mockPromotionRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: uuidPromotion },
        relations: ['followers']
      });
      expect(mockMemberRepository.findOneBy).toHaveBeenCalledWith({ uuidMember });
      expect(mockPromotionRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        ...promotion,
        followers: [member],
      }));
      expect(result).toEqual(updatedPromotion);
    });
  });

  describe('addManager', () => {
    it('should add a member as manager to a promotion', async () => {
      const uuidPromotion = '123e4567-e89b-12d3-a456-426614174001';
      const uuidMember = '123e4567-e89b-12d3-a456-426614174002';
      
      const promotion = { 
        uuid: uuidPromotion, 
        name: 'Test Promotion',
        managers: [],
      };
      
      const member = { uuidMember, guildUsername: 'TestUser' };
      const updatedPromotion = { 
        ...promotion,
        managers: [member],
      };

      mockPromotionRepository.findOne.mockResolvedValue(promotion);
      mockMemberRepository.findOneBy.mockResolvedValue(member);
      mockPromotionRepository.save.mockResolvedValue(updatedPromotion);

      const result = await service.addManager(uuidPromotion, uuidMember);

      expect(mockPromotionRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: uuidPromotion },
        relations: ['managers']
      });
      expect(mockMemberRepository.findOneBy).toHaveBeenCalledWith({ uuidMember });
      expect(mockPromotionRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        ...promotion,
        managers: [member],
      }));
      expect(result).toEqual(updatedPromotion);
    });
  });
}); 