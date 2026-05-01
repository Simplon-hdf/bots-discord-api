import { CreateIdentificationRequestDto } from '../dto/create-identification-request.dto';
import { UpdateIdentificationRequestDto } from '../dto/update-identification-request.dto';

export interface IIdentificationRequestsService {
  create(createIdentificationRequestDto: CreateIdentificationRequestDto);
  findAll();
  findOne(uuid: string);
  update(
    uuid: string,
    updateIdentificationRequestDto: UpdateIdentificationRequestDto,
  );
  remove(uuid: string);
}

export const IIdentificationRequestsServiceToken = Symbol(
  'IIdentificationRequestsService',
);
