import { ApiProperty } from '@nestjs/swagger';

export class AuthValidationDto {
  @ApiProperty({
    description: 'Indique si l\'utilisateur est membre de la guilde autorisée',
    example: true
  })
  isValid: boolean;

  @ApiProperty({
    description: 'Rôles de l\'utilisateur dans la guilde',
    example: ['123456789012345678', '234567890123456789']
  })
  roles: string[];
} 