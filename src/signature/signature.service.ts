import { Injectable } from '@nestjs/common';
import { PromotionsService } from '../promotions/promotions.service';
import { MembersService } from '../members/members.service';
import { RolesService } from '../roles/roles.service';
import { GuildsService } from '../guilds/guilds.service';
import { ChannelsService } from '../channels/channels.service';
import { PromotionSignatureDto, ChannelDto, MemberDto, RoleDto, PromotionsSignatureResponseDto } from './dto/promotion-signature.dto';

@Injectable()
export class SignatureService {
  constructor(
    private readonly promotionsService: PromotionsService,
    private readonly membersService: MembersService,
    private readonly rolesService: RolesService,
    private readonly guildsService: GuildsService,
    private readonly channelsService: ChannelsService,
  ) {}

  /**
   * Récupère toutes les promotions avec leurs signatures
   */
  async getAllPromotions(): Promise<{ promotions: PromotionSignatureDto[] }> {
    try {
      // Pour l'instant, on utilise les données de test
      return await this.generateTestPromotionSignature();
      
      // En production, le code serait plutôt:
      /*
      const promotions = await this.promotionsService.findAll();
      const result: PromotionSignatureDto[] = [];
      
      for (const promotion of promotions) {
        const guild = await this.guildsService.findOne(promotion.uuidGuild);
        const channel = await this.channelsService.findChannelByPromotion(promotion.uuid);
        const members = await this.membersService.findByPromotion(promotion.uuid);
        const roles = await this.rolesService.findByPromotion(promotion.uuid);
        
        // Assembler les données en suivant la structure du DTO
        // ...
        
        result.push(assembledData);
      }
      
      return { promotions: result };
      */
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des signatures des promotions: ${error.message}`);
    }
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
          snowflake: '1344593994616930337',
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
            snowflake: '1152153253782491196',
            nom: 'Enguerrand 1er',
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
          },
          {
            snowflake: '322706466966601738',
            nom: 'Gabriel',
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
            snowflake: '437564147257966592',
            nom: 'Ayoub',
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
            snowflake: '352516106164109333',
            nom: 'Justin',
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
            snowflake: '1111644332664045588',
            nom: 'Julien',
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
            snowflake: '329954554080788480',
            nom: 'Messahoud',
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
            snowflake: '1148230014492479518',
            nom: 'Marsial',
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
          },
          {
            snowflake: '777777777777777778',
            nom: 'Hugo Dubois',
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
            snowflake: '888888888888888889',
            nom: 'Chloé Martin',
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
      },
      {
        uuid: 'e7d3e8f3-9c3b-4f3b-8f3b-9c3b4f3b8f3b',
        nom: 'Dev IA P2',
        channel: {
          snowflake: '1344612021710229514',
          nom: 'Forum de la Dev IA P2'
        },
        chargeDeProjet: {
          snowflake: '765432109876543210',
          nom: 'Lucie Moreau',
          roles: [
            {
              id: '1344616774402052127',
              nom: 'cdp'
            },
            {
              id: '1344616774402052131',
              nom: 'dev-ia-p2'
            }
          ]
        },
        formateurs: [
          {
            snowflake: '555555555555555557',
            nom: 'Julien Petit',
            roles: [
              {
                id: '1344616774402052129',
                nom: 'formateur'
              },
              {
                id: '1344616774402052131',
                nom: 'dev-ia-p2'
              }
            ]
          },
          {
            snowflake: '666666666666666668',
            nom: 'Claire Richard',
            roles: [
              {
                id: '1344616774402052129',
                nom: 'formateur'
              },
              {
                id: '1344616774402052131',
                nom: 'dev-ia-p2'
              }
            ]
          }
        ],
        apprenants: [
          {
            snowflake: '777777777777777778',
            nom: 'Léa Girard',
            roles: [
              {
                id: '1344616774402052126',
                nom: 'apprenant'
              },
              {
                id: '1344616774402052131',
                nom: 'dev-ia-p2'
              }
            ]
          },
          {
            snowflake: '888888888888888889',
            nom: 'Noah Lefevre',
            roles: [
              {
                id: '1344616774402052126',
                nom: 'apprenant'
              },
              {
                id: '1344616774402052131',
                nom: 'dev-ia-p2'
              }
            ]
          },
          {
            snowflake: '999999999999999990',
            nom: 'Zoé Moreau',
            roles: [
              {
                id: '1344616774402052126',
                nom: 'apprenant'
              },
              {
                id: '1344616774402052131',
                nom: 'dev-ia-p2'
              }
            ]
          },
          {
            snowflake: '101010101010101011',
            nom: 'Tom Dubois',
            roles: [
              {
                id: '1344616774402052126',
                nom: 'apprenant'
              },
              {
                id: '1344616774402052131',
                nom: 'dev-ia-p2'
              }
            ]
          }
        ]
      },
      {
        uuid: 'd9b2d63d-a233-4123-847a-7f4a9a3b3f3b',
        nom: 'TSSR P6',
        channel: {
          snowflake: '1344612232129937469',
          nom: 'Forum de la TSSR P6'
        },
        chargeDeProjet: {
          snowflake: '654321098765432109',
          nom: 'Pierre Lambert',
          roles: [
            {
              id: '1344616774402052127',
              nom: 'cdp'
            },
            {
              id: '1344616774402052132',
              nom: 'tssr-p6'
            }
          ]
        },
        formateurs: [
          {
            snowflake: '777777777777777779',
            nom: 'Nathalie Dubois',
            roles: [
              {
                id: '1344616774402052129',
                nom: 'formateur'
              },
              {
                id: '1344616774402052132',
                nom: 'tssr-p6'
              }
            ]
          },
          {
            snowflake: '888888888888888880',
            nom: 'Antoine Girard',
            roles: [
              {
                id: '1344616774402052129',
                nom: 'formateur'
              },
              {
                id: '1344616774402052132',
                nom: 'tssr-p6'
              }
            ]
          }
        ],
        apprenants: [
          {
            snowflake: '999999999999999990',
            nom: 'Alice Martin',
            roles: [
              {
                id: '1344616774402052126',
                nom: 'apprenant'
              },
              {
                id: '1344616774402052132',
                nom: 'tssr-p6'
              }
            ]
          },
          {
            snowflake: '101010101010101011',
            nom: 'Maxime Petit',
            roles: [
              {
                id: '1344616774402052126',
                nom: 'apprenant'
              },
              {
                id: '1344616774402052132',
                nom: 'tssr-p6'
              }
            ]
          },
          {
            snowflake: '111111111111111113',
            nom: 'Sarah Richard',
            roles: [
              {
                id: '1344616774402052126',
                nom: 'apprenant'
              },
              {
                id: '1344616774402052132',
                nom: 'tssr-p6'
              }
            ]
          },
          {
            snowflake: '121212121212121213',
            nom: 'Lucas Lefevre',
            roles: [
              {
                id: '1344616774402052126',
                nom: 'apprenant'
              },
              {
                id: '1344616774402052132',
                nom: 'tssr-p6'
              }
            ]
          }
        ]
      }
    ];

    // En production, vous utiliseriez les services pour récupérer ces données
    // Par exemple:
    // const promotion = await this.promotionsService.findOne(uuid);
    // const members = await this.membersService.findByPromotion(uuid);
    // etc.

    return { promotions: testData };
  }

  /**
   * En conditions réelles, cette méthode assemblerait les données à partir
   * des différents services, en fonction d'un UUID de promotion donné
   */
  async getPromotionSignature(uuid: string): Promise<{ promotion: PromotionSignatureDto }> {
    try {
      // Pour l'instant, on retourne un élément des données de test
      const { promotions } = await this.generateTestPromotionSignature();
      const promotion = promotions.find(p => p.uuid === uuid);
      
      if (!promotion) {
        throw new Error(`Promotion avec l'UUID ${uuid} non trouvée`);
      }
      
      return { promotion };
      
      // En production, le code serait plutôt:
      /*
      const promotion = await this.promotionsService.findOne(uuid);
      const guild = await this.guildsService.findOne(promotion.uuidGuild);
      const channel = await this.channelsService.findChannelByPromotion(uuid);
      const members = await this.membersService.findByPromotion(uuid);
      const roles = await this.rolesService.findByPromotion(uuid);
      
      // Assembler les données en suivant la structure du DTO
      // ...

      return { promotion: assembledData };
      */
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des données de signature: ${error.message}`);
    }
  }
} 