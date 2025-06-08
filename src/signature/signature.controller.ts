import { Controller, Get, Param, Post, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { SignatureService } from './signature.service';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { PromotionSignatureDto, PromotionsSignatureResponseDto } from './dto/promotion-signature.dto';

@ApiTags('signature')
@Controller('signature')
export class SignatureController {
  constructor(private readonly signatureService: SignatureService) {}

  @Get('promotions')
  @ApiOperation({ 
    summary: 'Get all promotions',
    description: 'Returns the complete list of all promotions with their signatures'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'List of promotions successfully retrieved',
    type: PromotionsSignatureResponseDto
  })
  async getAllPromotions(): Promise<PromotionsSignatureResponseDto> {
    return this.signatureService.getAllPromotions();
  }

  @Get('promotions/:uuid')
  @ApiOperation({ 
    summary: 'Get a promotion signature by UUID',
    description: 'Returns complete signature information for a promotion, including members and associated forum'
  })
  @ApiParam({ 
    name: 'uuid', 
    description: 'Unique identifier (UUID) of the promotion',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Promotion signature successfully retrieved',
    type: PromotionSignatureDto
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Promotion not found'
  })
  async getPromotionSignature(@Param('uuid', ParseUUIDPipe) uuid: string): Promise<PromotionSignatureDto> {
    return this.signatureService.getPromotionSignature(uuid);
  }

  @Post('promotions/test-data')
  @ApiOperation({ 
    summary: 'Create test data for promotions',
    description: 'Generates a test dataset for promotion signatures and saves it to the database'
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Test data successfully created and saved to the database',
    type: PromotionsSignatureResponseDto
  })
  async createTestPromotionData(): Promise<PromotionsSignatureResponseDto> {
    return this.signatureService.createTestData();
  }

  @Post('promotions/specific-data')
  @ApiOperation({ 
    summary: 'Add specific promotion data',
    description: 'Adds specific promotion data to the database, including the special case for Yohan with multiple roles'
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Specific promotion data successfully added to the database',
    type: PromotionsSignatureResponseDto
  })
  async addSpecificPromotionData(): Promise<PromotionsSignatureResponseDto> {
    return this.signatureService.addSpecificPromotionData();
  }
} 