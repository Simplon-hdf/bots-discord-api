import { IsString, IsUUID, MaxLength, IsInt, Min, Matches, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMemberDto {
  @ApiProperty({
    description: 'UUID unique du membre',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  uuid: string;

  @ApiProperty({
    description: 'Nom d\'utilisateur du membre dans la guilde',
    example: 'JohnDoe',
    maxLength: 50
  })
  @IsString()
  @MaxLength(50)
  guildUsername: string;

  @ApiProperty({
    description: 'Points d\'expérience du membre (format: nombre décimal avec 2 décimales)',
    example: '100.00'
  })
  @IsString()
  @Matches(/^\d+\.\d{2}$/, { message: 'xp doit être un nombre décimal avec 2 décimales (ex: 100.00)' })
  xp: string;

  @ApiProperty({
    description: 'Niveau du membre',
    example: 1,
    minimum: 0
  })
  @IsInt()
  @Min(0)
  level: number;

  @ApiProperty({
    description: 'Rôle communautaire du membre',
    example: 'Member',
    maxLength: 50
  })
  @IsString()
  @MaxLength(50)
  communityRole: string;

  @ApiProperty({
    description: 'Statut du membre',
    example: 'Active',
    enum: ['Active', 'Inactive', 'Banned']
  })
  @IsString()
  @MaxLength(50)
  @IsIn(['Active', 'Inactive', 'Banned'], { message: 'status doit être Active, Inactive ou Banned' })
  status: string;

  @ApiProperty({
    description: 'UUID de la guilde à laquelle appartient le membre',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @IsUUID()
  uuidGuild: string;

  @ApiProperty({
    description: 'UUID Discord du membre',
    example: '123e4567-e89b-12d3-a456-426614174002'
  })
  @IsUUID()
  uuidDiscord: string;
}
