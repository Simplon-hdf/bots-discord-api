import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GuildsTemplatesService } from './guilds-templates.service';
import { GuildTemplate } from './entities/guild-template.entity';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('GuildsTemplatesService', () => {
  let service: GuildsTemplatesService;
  let repository: Repository<GuildTemplate>;

  const mockRepository = {
    create: vi.fn(),
    save: vi.fn(),
    find: vi.fn(),
    findOneBy: vi.fn(),
    findOne: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GuildsTemplatesService,
        {
          provide: getRepositoryToken(GuildTemplate),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<GuildsTemplatesService>(GuildsTemplatesService);
    repository = module.get<Repository<GuildTemplate>>(getRepositoryToken(GuildTemplate));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new guild template', async () => {
      const createDto = {
        uuid: '123456789012345678',
        name: 'Test Template',
        description: 'Test Description',
        configuration: {
          welcomeChannel: '123456789',
          prefix: '!',
          language: 'fr'
        }
      };

      const newTemplate = { ...createDto, id: 1 };
      mockRepository.create.mockReturnValue(newTemplate);
      mockRepository.save.mockResolvedValue(newTemplate);

      const result = await service.create(createDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(newTemplate);
      expect(result).toEqual(newTemplate);
    });
  });

  describe('findAll', () => {
    it('should return an array of guild templates', async () => {
      const templates = [
        { id: 1, name: 'Template 1' },
        { id: 2, name: 'Template 2' },
      ];
      mockRepository.find.mockResolvedValue(templates);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['guild', 'category']
      });
      expect(result).toEqual(templates);
    });
  });

  describe('findOne', () => {
    it('should return a guild template by uuid', async () => {
      const template = { id: 1, name: 'Template 1' };
      const uuid = '123456789012345678';
      mockRepository.findOne.mockResolvedValue(template);

      const result = await service.findOne(uuid);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { uuid },
        relations: ['guild', 'category']
      });
      expect(result).toEqual(template);
    });
  });

  describe('update', () => {
    it('should update a guild template', async () => {
      const uuid = '123456789012345678';
      const updateDto = { name: 'Updated Template' };
      
      // Créer un objet template existant
      const existingTemplate = { 
        id: 1, 
        uuid: '123456789012345678',
        name: 'Test Template', 
        description: 'Test Description',
        configuration: {
          language: 'fr',
          prefix: '!',
          welcomeChannel: '123456789',
        },
        updatedAt: new Date()
      };
      
      // Réinitialiser les mocks
      vi.clearAllMocks();
      
      // Mock findOneBy pour retourner le template existant
      mockRepository.findOneBy.mockResolvedValue(existingTemplate);
      
      // Mock save pour simuler la sauvegarde
      mockRepository.save.mockImplementation((entity) => {
        // Vérifier que l'entité a bien été mise à jour
        expect(entity.name).toBe('Updated Template');
        expect(entity.updatedAt).toBeInstanceOf(Date);
        
        // Retourner l'entité mise à jour
        return Promise.resolve(entity);
      });
      
      // Appeler la méthode update
      const result = await service.update(uuid, updateDto);
      
      // Vérifier que findOneBy a été appelé avec le bon uuid
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ uuid });
      
      // Vérifier que save a été appelé
      expect(mockRepository.save).toHaveBeenCalled();
      
      // Vérifier que le résultat contient les bonnes valeurs
      expect(result.name).toBe('Updated Template');
      expect(result.description).toBe('Test Description');
      expect(result.updatedAt).toBeInstanceOf(Date);
    });
    
    it('should return null if template not found', async () => {
      const uuid = '123456789012345678';
      const updateDto = { name: 'Updated Template' };
      
      // Réinitialiser les mocks
      vi.clearAllMocks();
      
      // Simuler le comportement du service
      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await service.update(uuid, updateDto);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ uuid });
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete a guild template', async () => {
      const uuid = '123456789012345678';
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(uuid);

      expect(mockRepository.delete).toHaveBeenCalledWith({ uuid });
    });
  });
});
