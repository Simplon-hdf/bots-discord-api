import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Guild } from '../../guilds/entities/guild.entity';
import { Category } from '../../categories/entities/category.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Guild)
    private readonly guildRepository: Repository<Guild>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    if (this.configService.get<string>('NODE_ENV') !== 'production') {
      this.logger.log('🌱 Initialisation du seeding...');
      await this.seedData();
    }
  }

  /**
   * Méthode principale de seeding
   */
  async seedData(): Promise<void> {
    try {
      await this.seedDefaultGuild();
      await this.seedDefaultCategory();
      this.logger.log('✅ Seeding terminé avec succès');
    } catch (error) {
      this.logger.error('❌ Erreur lors du seeding', error);
    }
  }

  /**
   * Crée une guild par défaut si elle n'existe pas
   */
  private async seedDefaultGuild(): Promise<void> {
    const defaultGuildId = this.configService.get<string>('ALLOWED_GUILD_ID');
    
    if (!defaultGuildId) {
      this.logger.warn('⚠️ ALLOWED_GUILD_ID non défini, impossible de créer la guild par défaut');
      return;
    }

    const existingGuild = await this.guildRepository.findOne({
      where: { uuid: defaultGuildId }
    });

    if (existingGuild) {
      this.logger.log(`✅ Guild par défaut existe déjà: ${existingGuild.name} (${existingGuild.uuid})`);
      return;
    }

    const defaultGuild = this.guildRepository.create({
      uuid: defaultGuildId,
      name: 'Guild par défaut',
      memberCount: '0',
      configuration: {
        autoRole: true,
        welcomeChannel: null,
        logChannel: null,
        prefix: '!',
        rateLimiting: {
          enabled: true,
          maxRequests: 10,
          windowMs: 60000
        }
      }
    });

    await this.guildRepository.save(defaultGuild);
    this.logger.log(`🏰 Guild par défaut créée: ${defaultGuild.name} (${defaultGuild.uuid})`);
  }

  /**
   * Crée une catégorie de stock par défaut si elle n'existe pas
   */
  private async seedDefaultCategory(): Promise<void> {
    const stockCategoryId = this.configService.get<string>('STOCK_ID');
    const defaultGuildId = this.configService.get<string>('ALLOWED_GUILD_ID');
    
    if (!stockCategoryId || !defaultGuildId) {
      this.logger.warn('⚠️ STOCK_ID ou ALLOWED_GUILD_ID non défini, impossible de créer la catégorie de stock');
      return;
    }

    const existingCategory = await this.categoryRepository.findOne({
      where: { uuid: stockCategoryId }
    });

    if (existingCategory) {
      this.logger.log(`✅ Catégorie de stock existe déjà: ${existingCategory.name} (${existingCategory.uuid})`);
      return;
    }

    const stockCategory = this.categoryRepository.create({
      uuid: stockCategoryId,
      name: '📦 Stock Channels',
      position: 999, // Position très élevée pour être en bas
      uuidGuild: defaultGuildId
    });

    await this.categoryRepository.save(stockCategory);
    this.logger.log(`📦 Catégorie de stock créée: ${stockCategory.name} (${stockCategory.uuid})`);
  }

  /**
   * Force le re-seeding (utile pour les tests ou le développement)
   */
  async forceSeed(): Promise<void> {
    this.logger.log('🔄 Force seeding demandé...');
    await this.seedData();
  }

  /**
   * Nettoie les données de test (utile pour les tests)
   */
  async cleanTestData(): Promise<void> {
    if (this.configService.get<string>('NODE_ENV') === 'production') {
      throw new Error('❌ Nettoyage des données interdit en production');
    }

    this.logger.log('🧹 Nettoyage des données de test...');
    
    // Supprimer les catégories de test
    await this.categoryRepository.delete({});
    
    // Supprimer les guilds de test
    await this.guildRepository.delete({});
    
    this.logger.log('✅ Données de test nettoyées');
  }
} 