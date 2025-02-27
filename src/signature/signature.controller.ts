import { Controller, Get, Param, Post, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { SignatureService } from './signature.service';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { PromotionSignatureDto } from './dto/promotion-signature.dto';

@ApiTags('signature')
@Controller('signature')
export class SignatureController {
  constructor(private readonly signatureService: SignatureService) {}

  @Get('promotion/:uuid')
  @ApiOperation({ 
    summary: 'Récupérer la signature d\'une promotion par son UUID',
    description: 'Retourne les informations complètes de signature pour une promotion, incluant les membres et le forum associé.'
  })
  @ApiParam({ 
    name: 'uuid', 
    description: 'Identifiant unique (UUID) de la promotion',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Signature de la promotion récupérée avec succès',
    type: PromotionSignatureDto,
    content: {
      'application/json': {
        example: {
          promotion: {
            uuid: '123e4567-e89b-12d3-a456-426614174000',
            nom: 'Promotion 2023',
            forum: {
              snowflake: '123456789012345678',
              nom: 'Forum de la Promotion 2023'
            },
            chargeDeProjet: {
              snowflake: '987654321098765432',
              nom: 'Jean Dupont',
              roles: ['cdp', 'cda-p4-vals']
            },
            formateurs: [
              {
                snowflake: '111111111111111111',
                nom: 'Alice Martin',
                roles: ['formateur', 'cda-p4-vals']
              }
            ],
            apprenants: [
              {
                snowflake: '333333333333333333',
                nom: 'Élève 1',
                roles: ['apprenant', 'cda-p4-vals']
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
          message: 'Promotion avec l\'UUID 123e4567-e89b-12d3-a456-426614174000 non trouvée',
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
    summary: 'Créer des données de test pour une promotion',
    description: 'Génère un jeu de données de test pour la signature d\'une promotion'
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Données de test générées avec succès',
    type: PromotionSignatureDto,
    content: {
      'application/json': {
        example: {
          promotion: {
            uuid: '123e4567-e89b-12d3-a456-426614174000',
            nom: 'Promotion 2023',
            forum: {
              snowflake: '123456789012345678',
              nom: 'Forum de la Promotion 2023'
            },
            chargeDeProjet: {
              snowflake: '987654321098765432',
              nom: 'Jean Dupont',
              roles: ['cdp', 'cda-p4-vals']
            },
            formateurs: [
              {
                snowflake: '111111111111111111',
                nom: 'Alice Martin',
                roles: ['formateur', 'cda-p4-vals']
              }
            ],
            apprenants: [
              {
                snowflake: '333333333333333333',
                nom: 'Élève 1',
                roles: ['apprenant', 'cda-p4-vals']
              }
            ]
          }
        }
      }
    }
  })
  async createTestPromotionData() {
    return this.signatureService.generateTestPromotionSignature();
  }
} 