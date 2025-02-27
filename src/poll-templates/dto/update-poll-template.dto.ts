import { OmitType } from '@nestjs/swagger';
import { CreatePollTemplateDto } from './create-poll-template.dto';

export class UpdatePollTemplateDto extends OmitType(CreatePollTemplateDto, ['questionTemplates']) {}
