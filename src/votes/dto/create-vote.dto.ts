import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID, ValidateIf } from 'class-validator';
import { VoteType } from '../entities/vote.entity';
import { PickableInternUUIDFields } from '../../utils/pickable-intern-uuid-fields';

export class CreateVoteDto extends PickType(PickableInternUUIDFields, [
  'uuidMember' // Pour le membre qui vote
]) {
  @ApiProperty({
    description: 'Type de vote (upvote ou downvote)',
    enum: VoteType,
    example: VoteType.UPVOTE
  })
  @IsNotEmpty({ message: 'Le type de vote est requis' })
  @IsEnum(VoteType, { message: 'Le type de vote doit être upvote ou downvote' })
  voteType: VoteType;

  @ApiProperty({
    description: 'UUID de la ressource votée (requis si le vote est sur une ressource)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @ValidateIf(o => !o.uuidComment)
  @IsUUID('4', { message: 'L\'UUID de la ressource doit être un UUID valide' })
  @IsNotEmpty({ message: 'L\'UUID de la ressource est requis si aucun commentaire n\'est spécifié' })
  uuidResource?: string;

  @ApiProperty({
    description: 'UUID du commentaire voté (requis si le vote est sur un commentaire)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @ValidateIf(o => !o.uuidResource)
  @IsUUID('4', { message: 'L\'UUID du commentaire doit être un UUID valide' })
  @IsNotEmpty({ message: 'L\'UUID du commentaire est requis si aucune ressource n\'est spécifiée' })
  uuidComment?: string;
}
