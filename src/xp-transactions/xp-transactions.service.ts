import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateXpTransactionDto } from './dto/create-xp-transaction.dto';
import { UpdateXpTransactionDto } from './dto/update-xp-transaction.dto';
import { XpTransaction } from './entities/xp-transaction.entity';
import { Member } from '../members/entities/member.entity';
import { plainToInstance } from 'class-transformer';
import { XpTransactionResponseDto } from './dto/responses/xp-transaction.response.dto';

@Injectable()
export class XpTransactionsService {
  constructor(
    @InjectRepository(XpTransaction)
    private xpTransactionRepository: Repository<XpTransaction>,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>
  ) {}

  async create(createXpTransactionDto: CreateXpTransactionDto): Promise<XpTransaction> {
    const xpTransaction = this.xpTransactionRepository.create({
      transaction_type: createXpTransactionDto.amount >= 0 ? 'GAIN' : 'LOSS',
      transaction_value: Math.abs(createXpTransactionDto.amount),
      uuidMember: createXpTransactionDto.userId,
      reason: createXpTransactionDto.reason,
      notes: createXpTransactionDto.notes
    });

    if (!member) {
      throw new NotFoundException(`Member with UUID ${createXpTransactionDto.uuid_member} not found`);
    }

    // Vérifier que la valeur est un nombre valide
    const transactionValue = parseFloat(createXpTransactionDto.transaction_value);
    if (isNaN(transactionValue)) {
      throw new BadRequestException('La valeur de la transaction doit être un nombre valide');
    }

    // Créer la transaction
    const transaction = this.xpTransactionRepository.create({
      ...createXpTransactionDto,
      member,
    });

    const savedTransaction = await this.xpTransactionRepository.save(transaction);
    
    // Retourner la transaction avec ses relations
    const transactionWithRelations = await this.xpTransactionRepository.findOne({
      where: { uuid_xp_transaction: savedTransaction.uuid_xp_transaction },
      relations: ['member'],
    });

    return plainToInstance(XpTransactionResponseDto, transactionWithRelations, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(): Promise<XpTransactionResponseDto[]> {
    const transactions = await this.xpTransactionRepository.find({
      relations: ['member'],
      order: {
        created_at: 'DESC'
      }
    });

    return transactions.map(transaction => 
      plainToInstance(XpTransactionResponseDto, transaction, { excludeExtraneousValues: true })
    );
  }

  async findByMember(uuid_member: string): Promise<XpTransactionResponseDto[]> {
    // Vérifier que le membre existe
    const member = await this.memberRepository.findOne({
      where: { uuid_member }
    });

    if (!member) {
      throw new NotFoundException(`Member with UUID ${uuid_member} not found`);
    }

    // Récupérer toutes les transactions du membre
    const transactions = await this.xpTransactionRepository.find({
      where: { member: { uuid_member } },
      relations: ['member'],
      order: {
        created_at: 'DESC'
      }
    });

    return transactions.map(transaction => 
      plainToInstance(XpTransactionResponseDto, transaction, { excludeExtraneousValues: true })
    );
  }

  async update(id: string, updateXpTransactionDto: UpdateXpTransactionDto): Promise<XpTransaction> {
    const xpTransaction = await this.findOne(id);
    
    if (updateXpTransactionDto.userId) {
      xpTransaction.uuidMember = updateXpTransactionDto.userId;
    }
    
    if (updateXpTransactionDto.amount !== undefined) {
      xpTransaction.transaction_type = updateXpTransactionDto.amount >= 0 ? 'GAIN' : 'LOSS';
      xpTransaction.transaction_value = Math.abs(updateXpTransactionDto.amount);
    }
    
    if (updateXpTransactionDto.reason) {
      xpTransaction.reason = updateXpTransactionDto.reason;
    }
    
    if (updateXpTransactionDto.notes !== undefined) {
      xpTransaction.notes = updateXpTransactionDto.notes;

  async findOne(uuid: string): Promise<XpTransactionResponseDto> {
    const transaction = await this.xpTransactionRepository.findOne({
      where: { uuid_xp_transaction: uuid },
      relations: ['member']
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction XP avec l'UUID ${uuid} non trouvée`);
    }

    return plainToInstance(XpTransactionResponseDto, transaction, { excludeExtraneousValues: true });
  }

  async update(uuid: string, updateXpTransactionDto: UpdateXpTransactionDto): Promise<XpTransactionResponseDto> {
    throw new BadRequestException('Les transactions XP ne peuvent pas être modifiées une fois créées');
  }

  async remove(uuid: string): Promise<void> {
    throw new BadRequestException('Les transactions XP ne peuvent pas être supprimées');
  }
}
