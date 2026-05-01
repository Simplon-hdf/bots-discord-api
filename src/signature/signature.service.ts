import { Injectable, NotFoundException, Logger, Inject } from '@nestjs/common';
import { IPromotionsServiceToken, IPromotionsService } from 'src/promotions/interfaces/promotion.interface';
import { IMembersServiceToken, IMembersService } from 'src/members/interfaces/member.interface';
import { IRolesServicesToken, IRolesService } from 'src/roles/interfaces/role.interface';
import { IGuildsServiceToken, IGuildsService } from 'src/guilds/interfaces/guild.interface';
import { IChannelsServiceToken, IChannelsService } from 'src/channels/interfaces/channel.interface';
import { IDiscordUsersServiceToken, IDiscordUsersService } from 'src/discord-users/interfaces/discord-user.interface';


import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion } from '../promotions/entities/promotion.entity';
import { Member } from '../members/entities/member.entity';
import { Channel } from '../channels/entities/channel.entity';
import { Role } from '../roles/entities/role.entity';
import { Category } from '../categories/entities/category.entity';
import { DiscordUser } from '../discord-users/entities/discord-user.entity';
import { v4 as uuidv4 } from 'uuid';
import { PromotionSignatureDto, MembreDto, PromotionsSignatureResponseDto, RoleDto } from './dto/promotion-signature.dto';
import { Course } from '../courses/entities/course.entity';

@Injectable()
export class SignatureService {
  private readonly logger = new Logger(SignatureService.name);

  constructor(
    @Inject(IPromotionsServiceToken)
    private readonly promotionsService: IPromotionsService,

    @Inject(IMembersServiceToken)
    private readonly membersService: IMembersService,

    @Inject(IRolesServicesToken)
    private readonly rolesService: IRolesService,

    @Inject(IGuildsServiceToken)
    private readonly guildsService: IGuildsService,

    @Inject(IChannelsServiceToken)
    private readonly channelsService: IChannelsService,

    @Inject(IDiscordUsersServiceToken)
    private readonly discordUsersService: IDiscordUsersService,

    @InjectRepository(Promotion)
    private promotionRepository: Repository<Promotion>,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(DiscordUser)
    private discordUserRepository: Repository<DiscordUser>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  /**
   * Récupère toutes les promotions avec leurs signatures depuis la base de données
   */
  async getAllPromotions(): Promise<PromotionsSignatureResponseDto> {
    let promotions = await this.promotionRepository.find({
      relations: ['category', 'followers', 'managers', 'role'],
    });

    if (promotions.length === 0) {
      this.logger.log('No promotions found. Generating test data...');
      await this.createTestData();
      promotions = await this.promotionRepository.find({
        relations: ['category', 'followers', 'managers', 'role'],
      });
    }

    return {
      promotions: promotions.map(promotion => this.mapPromotionToDto(promotion)),
    };
  }

  /**
   * Récupère une promotion spécifique par son UUID
   */
  async getPromotionSignature(uuid: string): Promise<PromotionSignatureDto> {
    const promotion = await this.promotionRepository.findOne({
      where: { uuid },
      relations: ['category', 'followers', 'managers', 'role'],
    });

    if (!promotion) {
      throw new Error(`Promotion with UUID ${uuid} not found`);
    }

    return this.mapPromotionToDto(promotion);
  }

  /**
   * Convertit une entité Promotion en DTO de signature
   */
  private mapPromotionToDto(promotion: Promotion): PromotionSignatureDto {
    // Filtrer les membres par rôle community
    const projectManager = promotion.managers?.find(member => member.communityRole === 'ProjectManager');
    const trainers = promotion.managers?.filter(member => member.communityRole === 'Trainer') || [];
    const learners = promotion.followers?.filter(member => member.communityRole === 'Learner') || [];

    // Rôles par défaut pour la démo
    const defaultRoles = (roleType: string, promoName: string): RoleDto[] => {
      const roles: RoleDto[] = [];
      
      // Rôle de type (apprenant, formateur, cdp)
      if (roleType) {
        roles.push({
          id: roleType === 'apprenant' ? '1344616774402052126' : 
              roleType === 'formateur' ? '1344616774402052129' : '1344616774402052127',
          nom: roleType
        });
      }
      
      // Rôle de la promotion (slug du nom)
      if (promoName) {
        const slug = promoName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        roles.push({
          id: `1344616774402052128`, // ID générique pour la démo
          nom: slug
        });
      }
      
      return roles;
    };

    // Créer un DTO pour le channel/forum (s'il existe)
    const channel = promotion.category ? 
      { 
        snowflake: promotion.category.uuid, 
        nom: promotion.category.name 
      } : 
      { 
        snowflake: "000000000000000000", 
        nom: `Forum de ${promotion.name}` 
      };

    // Créer un objet chargeDeProjet par défaut si aucun n'existe
    const defaultChargeDeProjet: MembreDto = {
      snowflake: projectManager?.uuidDiscord || "000000000000000000",
      nom: projectManager?.guildUsername || "Chargé de projet non assigné",
      roles: defaultRoles('cdp', promotion.name)
    };

    return {
      uuid: promotion.uuid,
      nom: promotion.name,
      channel,
      chargeDeProjet: projectManager ? {
        snowflake: projectManager.uuidDiscord,
        nom: projectManager.guildUsername,
        roles: defaultRoles('cdp', promotion.name)
      } : defaultChargeDeProjet,
      formateurs: trainers.map(trainer => ({
        snowflake: trainer.uuidDiscord,
        nom: trainer.guildUsername,
        roles: defaultRoles('formateur', promotion.name)
      })),
      apprenants: learners.map(learner => ({
        snowflake: learner.uuidDiscord,
        nom: learner.guildUsername,
        roles: defaultRoles('apprenant', promotion.name)
      }))
    };
  }

  /**
   * Génère des données de test pour la signature d'une promotion
   */
  async generateTestPromotionSignature(): Promise<{ promotions: PromotionSignatureDto[] }> {
    const testData: PromotionSignatureDto[] = [
      {
        uuid: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        nom: 'Cda P4 Vals',
        channel: {
          snowflake: '1344640530763485265',
          nom: 'Forum de la Cda P4 Vals'
        },
        chargeDeProjet: {
          snowflake: '987654321098765432',
          nom: 'Jean Dupont',
          roles: [
            {
              id: '1344616774402052127',
              nom: 'cdp'
            },
            {
              id: '1344616774402052128',
              nom: 'cda-p4-vals'
            }
          ]
        },
        formateurs: [
          {
            snowflake: '111111111111111111',
            nom: 'Alice Martin',
            roles: [
              {
                id: '1344616774402052129',
                nom: 'formateur'
              },
              {
                id: '1344616774402052128',
                nom: 'cda-p4-vals'
              }
            ]
          },
          {
            snowflake: '222222222222222222',
            nom: 'Bob Durand',
            roles: [
              {
                id: '1344616774402052129',
                nom: 'formateur'
              },
              {
                id: '1344616774402052128',
                nom: 'cda-p4-vals'
              }
            ]
          }
        ],
        apprenants: [
          {
            snowflake: '843642001592811540',
            nom: 'Abel-Karine',
            roles: [
              {
                id: '1344616774402052126',
                nom: 'apprenant'
              },
              {
                id: '1344616774402052128',
                nom: 'cda-p4-vals'
              }
            ]
          },
          {
            snowflake: '871401908055711784',
            nom: 'Audrey',
            roles: [
              {
                id: '1344616774402052126',
                nom: 'apprenant'
              },
              {
                id: '1344616774402052128',
                nom: 'cda-p4-vals'
              }
            ]
          },
          {
            snowflake: '1151408937900453888',
            nom: 'Bobo la bête',
            roles: [
              {
                id: '1344616774402052126',
                nom: 'apprenant'
              },
              {
                id: '1344616774402052128',
                nom: 'cda-p4-vals'
              }
            ]
          },
          {
            snowflake: '223812446312202251',
            nom: 'Yohan',
            roles: [
              {
                id: '1344616774402052126',
                nom: 'apprenant'
              },
              {
                id: '1344616774402052128',
                nom: 'cda-p4-vals'
              }
            ]
          }
        ]
      },
      {
        uuid: 'c9bf9e57-1685-4c89-bafb-ff5af830be8a',
        nom: 'Promo PHP P2',
        channel: {
          snowflake: '1344611862003712050',
          nom: 'Forum de la Promo PHP P2'
        },
        chargeDeProjet: {
          snowflake: '876543210987654321',
          nom: 'Marie Dubois',
          roles: [
            {
              id: '1344616774402052127',
              nom: 'cdp'
            },
            {
              id: '1344616774402052130',
              nom: 'php-p2'
            }
          ]
        },
        formateurs: [
          {
            snowflake: '333333333333333334',
            nom: 'Paul Lefevre',
            roles: [
              {
                id: '1344616774402052129',
                nom: 'formateur'
              },
              {
                id: '1344616774402052130',
                nom: 'php-p2'
              }
            ]
          },
          {
            snowflake: '444444444444444445',
            nom: 'Sophie Bernard',
            roles: [
              {
                id: '1344616774402052129',
                nom: 'formateur'
              },
              {
                id: '1344616774402052130',
                nom: 'php-p2'
              }
            ]
          }
        ],
        apprenants: [
          {
            snowflake: '555555555555555556',
            nom: 'Lucas Morel',
            roles: [
              {
                id: '1344616774402052126',
                nom: 'apprenant'
              },
              {
                id: '1344616774402052130',
                nom: 'php-p2'
              }
            ]
          },
          {
            snowflake: '666666666666666667',
            nom: 'Emma Lefevre',
            roles: [
              {
                id: '1344616774402052126',
                nom: 'apprenant'
              },
              {
                id: '1344616774402052130',
                nom: 'php-p2'
              }
            ]
          }
        ]
      }
    ];

    return { promotions: testData };
  }

  /**
   * Crée des données de test et les enregistre en base de données
   */
  async createTestData(): Promise<PromotionsSignatureResponseDto> {
    this.logger.log('Creating test data...');
    
    try {
      // 0. Créer une guild (serveur Discord)
      const guildId = '987654321098765432';
      let existingGuild: any = null;
      
      try {
        existingGuild = await this.guildsService.findOne(guildId);
      } catch (error) {
        if (error.name !== 'NotFoundException') {
          throw error;
        }
      }
      
      if (!existingGuild) {
        this.logger.log('Creating test guild...');
        await this.guildsService.create({
          uuid: guildId,
          name: 'Test Discord Server',
          memberCount: '50', // Required field in Guild entity
          configuration: {
            welcomeChannel: '111111111111111111',
            prefix: '!'
          }
        });
      }
      
      // 1. Créer des catégories
      const categoryUuid = '123456789012345678';
      let category1 = await this.categoryRepository.findOne({
        where: { uuid: categoryUuid }
      });
      
      if (!category1) {
        category1 = await this.categoryRepository.save({
          uuid: categoryUuid,
          name: 'Formation Dev Web',
          position: 1,
          uuidGuild: guildId
        });
      }
      
      // 2. Créer des rôles s'ils n'existent pas déjà
      const rolePromotionUuid = '111222333444555666';
      let rolePromotion = await this.roleRepository.findOne({
        where: { uuidRole: rolePromotionUuid }
      });
      
      if (!rolePromotion) {
        rolePromotion = await this.roleRepository.save({
          uuidRole: rolePromotionUuid,
          name: 'Promotion Dev Web 2024',
          memberCount: 25,
          rolePosition: 3,
          hoist: true,
          color: '#FF5733',
          uuidGuild: guildId
        });
      }
      
      const roleLearnerUuid = '222333444555666777';
      let roleLearner = await this.roleRepository.findOne({
        where: { uuidRole: roleLearnerUuid }
      });
      
      if (!roleLearner) {
        roleLearner = await this.roleRepository.save({
          uuidRole: roleLearnerUuid,
          name: 'Apprenant',
          memberCount: 20,
          rolePosition: 2,
          hoist: true,
          color: '#33FF57',
          uuidGuild: guildId
        });
      }
      
      const roleTrainerUuid = '333444555666777888';
      let roleTrainer = await this.roleRepository.findOne({
        where: { uuidRole: roleTrainerUuid }
      });
      
      if (!roleTrainer) {
        roleTrainer = await this.roleRepository.save({
          uuidRole: roleTrainerUuid,
          name: 'Formateur',
          memberCount: 3,
          rolePosition: 4,
          hoist: true,
          color: '#5733FF',
          uuidGuild: guildId
        });
      }
      
      const rolePMUuid = '444555666777888999';
      let rolePM = await this.roleRepository.findOne({
        where: { uuidRole: rolePMUuid }
      });
      
      if (!rolePM) {
        rolePM = await this.roleRepository.save({
          uuidRole: rolePMUuid,
          name: 'Chef de Projet',
          memberCount: 1,
          rolePosition: 5,
          hoist: true,
          color: '#33FFFF',
          uuidGuild: guildId
        });
      }
      
      // 3. Créer des channels (forums) s'ils n'existent pas déjà
      const forumChannelUuid = '555666777888999000';
      let forumChannel = await this.channelRepository.findOne({
        where: { uuid: forumChannelUuid }
      });
      
      if (!forumChannel) {
        forumChannel = await this.channelRepository.save({
          uuid: forumChannelUuid,
          name: 'forum-dev-web',
          type: 'GUILD_FORUM',
          channelPosition: 1,
          uuidCategory: category1.uuid,
          uuidGuild: guildId
        });
      }
      
      // 4a. Créer des utilisateurs Discord s'ils n'existent pas déjà
      // Project Manager Discord User
      const pmDiscordId = '900000000000000001';
      let pmDiscordUser = await this.discordUserRepository.findOne({
        where: { uuidDiscord: pmDiscordId }
      });
      
      if (!pmDiscordUser) {
        pmDiscordUser = await this.discordUserRepository.save({
          uuidDiscord: pmDiscordId,
          discordUsername: 'pm_user',
          discriminator: '0001'
        });
      }
      
      // Trainers Discord Users
      const trainerDiscordIds: string[] = [];
      for (let i = 1; i <= 3; i++) {
        const discordId = `91000000000000000${i}`;
        let trainerDiscordUser = await this.discordUserRepository.findOne({
          where: { uuidDiscord: discordId }
        });
        
        if (!trainerDiscordUser) {
          trainerDiscordUser = await this.discordUserRepository.save({
            uuidDiscord: discordId,
            discordUsername: `trainer${i}`,
            discriminator: `100${i}`
          });
        }
        trainerDiscordIds.push(discordId);
      }
      
      // Learners Discord Users
      const learnerDiscordIds: string[] = [];
      for (let i = 1; i <= 15; i++) {
        const discordId = `92000000000000000${i}`.substring(0, 19);
        let learnerDiscordUser = await this.discordUserRepository.findOne({
          where: { uuidDiscord: discordId }
        });
        
        if (!learnerDiscordUser) {
          learnerDiscordUser = await this.discordUserRepository.save({
            uuidDiscord: discordId,
            discordUsername: `learner${i}`,
            discriminator: `200${i < 10 ? '0' + i : i}`
          });
        }
        learnerDiscordIds.push(discordId);
      }
      
      // 4b. Créer des membres s'ils n'existent pas déjà
      // Project Manager
      let projectManager;
      const existingPMMember = await this.memberRepository.findOne({
        where: { uuidDiscord: pmDiscordId }
      });
      
      if (!existingPMMember) {
        projectManager = await this.memberRepository.save({
          uuidMember: uuidv4(),
          guildUsername: 'pm_user',
          xp: '2500',
          level: 5,
          communityRole: 'ProjectManager',
          status: 'Active',
          uuidGuild: guildId,
          uuidDiscord: pmDiscordId
        });
      } else {
        projectManager = existingPMMember;
      }
      
      // Trainers
      const trainers: any[] = [];
      for (let i = 1; i <= 3; i++) {
        const discordId = trainerDiscordIds[i-1];
        let trainer;
        
        const existingTrainer = await this.memberRepository.findOne({
          where: { uuidDiscord: discordId }
        });
        
        if (!existingTrainer) {
          trainer = await this.memberRepository.save({
            uuidMember: uuidv4(),
            guildUsername: `trainer${i}`,
            xp: `${1500 + (i * 100)}`,
            level: 4,
            communityRole: 'Trainer',
            status: 'Active',
            uuidGuild: guildId,
            uuidDiscord: discordId
          });
        } else {
          trainer = existingTrainer;
        }
        
        trainers.push(trainer);
      }
      
      // Learners
      const learners: any[] = [];
      for (let i = 1; i <= 15; i++) {
        const discordId = learnerDiscordIds[i-1];
        let learner;
        
        const existingLearner = await this.memberRepository.findOne({
          where: { uuidDiscord: discordId }
        });
        
        if (!existingLearner) {
          learner = await this.memberRepository.save({
            uuidMember: uuidv4(),
            guildUsername: `learner${i}`,
            xp: `${500 + (i * 50)}`,
            level: 2,
            communityRole: 'Learner',
            status: 'Active',
            uuidGuild: guildId,
            uuidDiscord: discordId
          });
        } else {
          learner = existingLearner;
        }
        
        learners.push(learner);
      }
      
      // Créer un cours s'il n'existe pas déjà
      this.logger.log('Creating course for promotion...');
      let course;
      
      // Vérifier si un cours existe déjà
      const existingCourse = await this.courseRepository.findOne({
        where: { name: 'Développeur Web' }
      });
      
      if (!existingCourse) {
        course = await this.courseRepository.save({
          name: 'Développeur Web',
          isCertified: true,
          uuidGuild: guildId,
          uuidCategory: category1.uuid
        });
      } else {
        course = existingCourse;
      }
      
      // 5. Créer la promotion si elle n'existe pas déjà
      let promotion;
      const promotionName = 'Développeur Web 2024';
      
      // Vérifier si la promotion existe déjà
      const existingPromotion = await this.promotionRepository.findOne({
        where: { name: promotionName }
      });
      
      if (!existingPromotion) {
        promotion = new Promotion();
        promotion.uuid = uuidv4();
        promotion.name = promotionName;
        promotion.startDate = new Date('2024-01-15');
        promotion.endDate = new Date('2024-12-15');
        promotion.status = 'active';
        promotion.uuidCourse = course.uuid;
        promotion.uuidGuild = guildId;
        promotion.uuidRole = rolePromotion.uuidRole;
        promotion.uuidCategory = category1.uuid;
        
        // Sauvegarder la promotion
        promotion = await this.promotionRepository.save(promotion);
      } else {
        promotion = existingPromotion;
      }
      
      // 6. Établir les relations entre promotion et membres
      // Ajouter les followers (learners)
      const promotionWithFollowers = await this.promotionRepository.findOne({
        where: { uuid: promotion.uuid },
        relations: ['followers'],
      });
      
      if (promotionWithFollowers && promotionWithFollowers.followers) {
        // Vérifier s'il y a déjà des followers
        if (promotionWithFollowers.followers.length === 0) {
          promotionWithFollowers.followers = [...learners];
          await this.promotionRepository.save(promotionWithFollowers);
        }
      }
      
      // Ajouter les managers (PM et trainers)
      const promotionWithManagers = await this.promotionRepository.findOne({
        where: { uuid: promotion.uuid },
        relations: ['managers'],
      });
      
      if (promotionWithManagers && promotionWithManagers.managers) {
        // Vérifier s'il y a déjà des managers
        if (promotionWithManagers.managers.length === 0) {
          promotionWithManagers.managers = [projectManager, ...trainers] as any[];
          await this.promotionRepository.save(promotionWithManagers);
        }
      }
      
      this.logger.log('Test data successfully created and saved!');
      
      // Récupérer la promotion complète avec toutes les relations
      const result = await this.promotionRepository.findOne({
        where: { uuid: promotion.uuid },
        relations: ['category', 'followers', 'managers', 'role'],
      });
      
      return {
        promotions: result ? [this.mapPromotionToDto(result)] : [],
      };
    } catch (error) {
      this.logger.error(`Failed to create test data: ${error.message}`, error.stack);
      throw new Error(`Failed to create test data: ${error.message}`);
    }
  }

  /**
   * Ajoute les données spécifiques de promotion fournies dans la base de données
   * Gère le cas spécial de Yohan qui a des rôles multiples
   */
  async addSpecificPromotionData(): Promise<PromotionsSignatureResponseDto> {
    this.logger.log('Ajout des données spécifiques de promotion...');
    
    try {
      // 0. Créer/récupérer une guild (serveur Discord)
      const guildId = '987654321098765432';
      let existingGuild: any = null;
      
      try {
        existingGuild = await this.guildsService.findOne(guildId);
      } catch (error) {
        if (error.name !== 'NotFoundException') {
          throw error;
        }
      }
      
      if (!existingGuild) {
        this.logger.log('Creating guild for specific promotion...');
        await this.guildsService.create({
          uuid: guildId,
          name: 'Test Discord Server',
          memberCount: '50',
          configuration: {
            welcomeChannel: '111111111111111111',
            prefix: '!'
          }
        });
      }
      
      // 1. Créer/récupérer la catégorie
      const categoryUuid = '1344640530763485265';
      let category = await this.categoryRepository.findOne({
        where: { uuid: categoryUuid }
      });
      
      if (!category) {
        category = await this.categoryRepository.save({
          uuid: categoryUuid,
          name: 'Forum de la Cda P4 Vals',
          position: 1,
          uuidGuild: guildId
        });
      }
      
      // 2. Créer/récupérer les rôles
      // Rôle CDP
      const roleCdpUuid = '1344616774402052127';
      let roleCdp = await this.roleRepository.findOne({
        where: { uuidRole: roleCdpUuid }
      });
      
      if (!roleCdp) {
        roleCdp = await this.roleRepository.save({
          uuidRole: roleCdpUuid,
          name: 'cdp',
          memberCount: 1,
          rolePosition: 5,
          hoist: true,
          color: '#33FFFF',
          uuidGuild: guildId
        });
      }
      
      // Rôle promotion
      const rolePromoUuid = '1344616774402052128';
      let rolePromo = await this.roleRepository.findOne({
        where: { uuidRole: rolePromoUuid }
      });
      
      if (!rolePromo) {
        rolePromo = await this.roleRepository.save({
          uuidRole: rolePromoUuid,
          name: 'cda-p4-vals',
          memberCount: 10,
          rolePosition: 3,
          hoist: true,
          color: '#FF5733',
          uuidGuild: guildId
        });
      }
      
      // Rôle formateur
      const roleFormateurUuid = '1344616774402052129';
      let roleFormateur = await this.roleRepository.findOne({
        where: { uuidRole: roleFormateurUuid }
      });
      
      if (!roleFormateur) {
        roleFormateur = await this.roleRepository.save({
          uuidRole: roleFormateurUuid,
          name: 'formateur',
          memberCount: 2,
          rolePosition: 4,
          hoist: true,
          color: '#5733FF',
          uuidGuild: guildId
        });
      }
      
      // Rôle apprenant
      const roleApprenantUuid = '1344616774402052126';
      let roleApprenant = await this.roleRepository.findOne({
        where: { uuidRole: roleApprenantUuid }
      });
      
      if (!roleApprenant) {
        roleApprenant = await this.roleRepository.save({
          uuidRole: roleApprenantUuid,
          name: 'apprenant',
          memberCount: 5,
          rolePosition: 2,
          hoist: true,
          color: '#33FF57',
          uuidGuild: guildId
        });
      }
      
      // 3. Créer/récupérer le forum
      const forumChannelUuid = '1344640530763485265';
      let forumChannel = await this.channelRepository.findOne({
        where: { uuid: forumChannelUuid }
      });
      
      if (!forumChannel) {
        forumChannel = await this.channelRepository.save({
          uuid: forumChannelUuid,
          name: 'Forum de la Cda P4 Vals',
          type: 'GUILD_FORUM',
          channelPosition: 1,
          uuidCategory: category.uuid,
          uuidGuild: guildId
        });
      }
      
      // 4. Créer/récupérer les utilisateurs Discord
      // Chargé de projet
      const cdpDiscordId = '987654321098765432';
      let cdpDiscordUser = await this.discordUserRepository.findOne({
        where: { uuidDiscord: cdpDiscordId }
      });
      
      if (!cdpDiscordUser) {
        cdpDiscordUser = await this.discordUserRepository.save({
          uuidDiscord: cdpDiscordId,
          discordUsername: 'Jean Dupont',
          discriminator: '0001'
        });
      }
      
      // Formateurs Discord Users
      const trainerDiscordIds = ['223812446312202251', '222222222222222222'];
      const trainerNames = ['Yohan', 'Bob Durand'];
      
      for (let i = 0; i < trainerDiscordIds.length; i++) {
        const discordId = trainerDiscordIds[i];
        const name = trainerNames[i];
        
        let trainerDiscordUser = await this.discordUserRepository.findOne({
          where: { uuidDiscord: discordId }
        });
        
        if (!trainerDiscordUser) {
          trainerDiscordUser = await this.discordUserRepository.save({
            uuidDiscord: discordId,
            discordUsername: name,
            discriminator: `100${i+1}`
          });
        }
      }
      
      // Apprenants Discord Users  
      const learnerDiscordIds = [
        '843642001592811540', 
        '871401908055711784', 
        '1151408937900453888', 
        '223812446312202251',
        '1152153253782491196'
      ];
      
      const learnerNames = [
        'Abel-Karine', 
        'Audrey', 
        'Bobo la bête', 
        'Yohan',
        'Engurrang'
      ];
      
      for (let i = 0; i < learnerDiscordIds.length; i++) {
        const discordId = learnerDiscordIds[i];
        const name = learnerNames[i];
        
        // Vérifie si l'utilisateur existe déjà (pour Yohan notamment)
        let learnerDiscordUser = await this.discordUserRepository.findOne({
          where: { uuidDiscord: discordId }
        });
        
        if (!learnerDiscordUser) {
          learnerDiscordUser = await this.discordUserRepository.save({
            uuidDiscord: discordId,
            discordUsername: name,
            discriminator: `200${i+1}`
          });
        }
      }
      
      // 5. Créer/récupérer les membres
      // Chargé de projet
      let projectManager;
      const existingPMMember = await this.memberRepository.findOne({
        where: { uuidDiscord: cdpDiscordId }
      });
      
      if (!existingPMMember) {
        projectManager = await this.memberRepository.save({
          uuidMember: uuidv4(),
          guildUsername: 'Jean Dupont',
          xp: '2500',
          level: 5,
          communityRole: 'ProjectManager',
          status: 'Active',
          uuidGuild: guildId,
          uuidDiscord: cdpDiscordId
        });
      } else {
        projectManager = existingPMMember;
      }
      
      // Formateurs
      const trainers: any[] = [];
      for (let i = 0; i < trainerDiscordIds.length; i++) {
        const discordId = trainerDiscordIds[i];
        const name = trainerNames[i];
        
        // Pour Yohan qui a un double rôle (formateur et apprenant)
        if (discordId === '223812446312202251') {
          let yohanMember = await this.memberRepository.findOne({
            where: { uuidDiscord: discordId }
          });
          
          if (yohanMember) {
            // S'il existe déjà, garder son rôle avec une préférence pour Formateur
            if (yohanMember.communityRole !== 'Trainer') {
              yohanMember.communityRole = 'Trainer';
              yohanMember = await this.memberRepository.save(yohanMember);
            }
            trainers.push(yohanMember);
          } else {
            // S'il n'existe pas, le créer comme formateur
            const trainer = await this.memberRepository.save({
              uuidMember: uuidv4(),
              guildUsername: name,
              xp: '2000',
              level: 4,
              communityRole: 'Trainer', // On le crée d'abord comme formateur
              status: 'Active',
              uuidGuild: guildId,
              uuidDiscord: discordId
            });
            trainers.push(trainer);
          }
        } else {
          // Autres formateurs (pas Yohan)
          let trainer;
          const existingTrainer = await this.memberRepository.findOne({
            where: { uuidDiscord: discordId }
          });
          
          if (!existingTrainer) {
            trainer = await this.memberRepository.save({
              uuidMember: uuidv4(),
              guildUsername: name,
              xp: `${1500 + (i * 100)}`,
              level: 4,
              communityRole: 'Trainer',
              status: 'Active',
              uuidGuild: guildId,
              uuidDiscord: discordId
            });
          } else {
            trainer = existingTrainer;
          }
          
          trainers.push(trainer);
        }
      }
      
      // Apprenants
      const learners: any[] = [];
      for (let i = 0; i < learnerDiscordIds.length; i++) {
        const discordId = learnerDiscordIds[i];
        const name = learnerNames[i];
        
        // Traitement spécial pour Yohan (qui est aussi formateur)
        if (discordId === '223812446312202251') {
          let yohanMember = await this.memberRepository.findOne({
            where: { uuidDiscord: discordId }
          });
          
          if (yohanMember) {
            // On ajoute Yohan aussi comme apprenant (il est déjà dans trainers)
            learners.push(yohanMember);
          }
          // On ne crée pas de nouveau membre pour Yohan ici car c'est déjà fait côté formateur
        } else {
          // Autres apprenants
          let learner;
          const existingLearner = await this.memberRepository.findOne({
            where: { uuidDiscord: discordId }
          });
          
          if (!existingLearner) {
            learner = await this.memberRepository.save({
              uuidMember: uuidv4(),
              guildUsername: name,
              xp: `${500 + (i * 50)}`,
              level: 2,
              communityRole: 'Learner',
              status: 'Active',
              uuidGuild: guildId,
              uuidDiscord: discordId
            });
          } else {
            learner = existingLearner;
          }
          
          learners.push(learner);
        }
      }
      
      // 6. Créer/récupérer le cours
      this.logger.log('Creating course for promotion...');
      let course;
      
      const existingCourse = await this.courseRepository.findOne({
        where: { name: 'Cda P4 Vals' }
      });
      
      if (!existingCourse) {
        course = await this.courseRepository.save({
          name: 'Cda P4 Vals',
          isCertified: true,
          uuidGuild: guildId,
          uuidCategory: category.uuid
        });
      } else {
        course = existingCourse;
      }
      
      // 7. Créer/récupérer la promotion
      let promotion;
      const promotionUuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
      
      // Vérifier si la promotion existe déjà
      const existingPromotion = await this.promotionRepository.findOne({
        where: { uuid: promotionUuid }
      });
      
      if (!existingPromotion) {
        promotion = new Promotion();
        promotion.uuid = promotionUuid;
        promotion.name = 'Cda P4 Vals';
        promotion.startDate = new Date('2024-01-15');
        promotion.endDate = new Date('2024-12-15');
        promotion.status = 'active';
        promotion.uuidCourse = course.uuid;
        promotion.uuidGuild = guildId;
        promotion.uuidRole = rolePromo.uuidRole;
        promotion.uuidCategory = category.uuid;
        
        // Sauvegarder la promotion
        promotion = await this.promotionRepository.save(promotion);
      } else {
        promotion = existingPromotion;
      }
      
      // 8. Établir les relations entre promotion et membres
      // Ajouter les followers (learners)
      const promotionWithFollowers = await this.promotionRepository.findOne({
        where: { uuid: promotion.uuid },
        relations: ['followers'],
      });
      
      if (promotionWithFollowers) {
        // Recréer complètement la liste des apprenants
        promotionWithFollowers.followers = learners;
        await this.promotionRepository.save(promotionWithFollowers);
      }
      
      // Ajouter les managers (PM et trainers)
      const promotionWithManagers = await this.promotionRepository.findOne({
        where: { uuid: promotion.uuid },
        relations: ['managers'],
      });
      
      if (promotionWithManagers) {
        // Recréer complètement la liste des managers
        promotionWithManagers.managers = [projectManager, ...trainers];
        await this.promotionRepository.save(promotionWithManagers);
      }
      
      this.logger.log('Données spécifiques de promotion ajoutées avec succès!');
      
      // Récupérer la promotion complète avec toutes les relations
      const result = await this.promotionRepository.findOne({
        where: { uuid: promotion.uuid },
        relations: ['category', 'followers', 'managers', 'role'],
      });
      
      return {
        promotions: result ? [this.mapPromotionToDto(result)] : [],
      };
    } catch (error) {
      this.logger.error(`Échec de l'ajout des données de promotion: ${error.message}`, error.stack);
      throw new Error(`Échec de l'ajout des données de promotion: ${error.message}`);
    }
  }
} 