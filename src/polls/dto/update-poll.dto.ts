import { OmitType } from '@nestjs/swagger';
import { CreatePollDto } from './create-poll.dto';

export class UpdatePollDto extends OmitType(CreatePollDto, ['uuidMessage']) {}
