import { Controller, Get, Param, Post, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { SignatureService } from './signature.service';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { PromotionSignatureDto, PromotionsSignatureResponseDto } from './dto/promotion-signature.dto';

@ApiTags('signature')
@Controller('signature')
export class SignatureController {
  constructor(private readonly signatureService: SignatureService) {}

  @Get('promotion/:uuid')
  @ApiOperation({ 
    summary: 'Récupérer la signature d\'une promotion par son UUID',
    description: 'Retourne les informations complètes de signature pour une promotion, incluant les membres et le channel associé.'
  })
  @ApiParam({ 
    name: 'uuid', 
    description: 'Identifiant unique (UUID) de la promotion',
    type: 'string',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Signature de la promotion récupérée avec succès',
    type: PromotionSignatureDto,
    content: {
      'application/json': {
        example: {
          promotion: {
            uuid: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            nom: 'Cda P4 Vals',
            channel: {
              snowflake: '1344611809826439258',
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
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Promotion non trouvée',
    content: {
      'application/json': {
        example: {
          statusCode: 404,
          message: 'Promotion avec l\'UUID f47ac10b-58cc-4372-a567-0e02b2c3d479 non trouvée',
          error: 'Not Found'
        }
      }
    }
  })
  async getPromotionSignature(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.signatureService.getPromotionSignature(uuid);
  }

  @Post('promotion/test')
  @ApiOperation({ 
    summary: 'Créer des données de test pour les promotions',
    description: 'Génère un jeu de données de test pour les signatures des promotions'
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Données de test générées avec succès',
    type: PromotionsSignatureResponseDto,
    content: {
      'application/json': {
        example: {
          promotions: [
            {
              uuid: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
              nom: 'Cda P4 Vals',
              channel: {
                snowflake: '1344611809826439258',
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
                }
              ]
            }
          ]
        }
      }
    }
  })
  async createTestPromotionData() {
    return this.signatureService.generateTestPromotionSignature();
  }
} 