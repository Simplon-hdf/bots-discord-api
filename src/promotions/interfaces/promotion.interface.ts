import { CreatePromotionDto } from '../dto/create-promotion.dto';
import { UpdatePromotionDto } from '../dto/update-promotion.dto';
import { Promotion } from '../entities/promotion.entity';

export interface IPromotionsService {
  create(createPromotionDto: CreatePromotionDto);
  findAll();
  findOne(uuid: string);
  update(uuid: string, updatePromotionDto: UpdatePromotionDto);
  remove(uuid: string);
  addFollower(uuidPromotion: string, uuidMember: string);
  addManager(uuidPromotion: string, uuidMember: string);
}

export const IPromotionsServiceToken = Symbol('IPromotionsService');
