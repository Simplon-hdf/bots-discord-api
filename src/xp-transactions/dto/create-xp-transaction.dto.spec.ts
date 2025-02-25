import { validate } from 'class-validator';
import { CreateXpTransactionDto } from './create-xp-transaction.dto';
import { expect, describe, it, beforeEach } from 'vitest';
import { XpTransactionType, XpTransactionSource } from '../entities/xp-transaction.entity';

describe('CreateXpTransactionDto', () => {
  let dto: CreateXpTransactionDto;

  beforeEach(() => {
    dto = new CreateXpTransactionDto();
    dto.uuidMember = '123e4567-e89b-12d3-a456-426614174000';
    dto.transactionType = XpTransactionType.GAIN;
    dto.source = XpTransactionSource.VOTE;
    dto.transactionValue = '100.00';
    dto.reason = 'Participation active dans le salon d\'entraide';
  });

  it('devrait valider un DTO correct', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('uuidMember', () => {
    it('devrait échouer si uuidMember n\'est pas une chaîne', async () => {
      (dto as any).uuidMember = 123;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('uuidMember');
    });

    it('devrait échouer si uuidMember n\'est pas un UUID valide', async () => {
      dto.uuidMember = '123';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('uuidMember');
    });
  });

  describe('transactionValue', () => {
    it('devrait échouer si transactionValue n\'est pas une chaîne décimale', async () => {
      (dto as any).transactionValue = 100;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('transactionValue');
    });

    it('devrait échouer si transactionValue n\'a pas exactement 2 décimales', async () => {
      dto.transactionValue = '100.0';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('transactionValue');
    });
  });

  describe('reason', () => {
    it('devrait échouer si reason n\'est pas une chaîne', async () => {
      (dto as any).reason = 123;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('reason');
    });

    it('devrait échouer si reason dépasse 200 caractères', async () => {
      dto.reason = 'a'.repeat(201);
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('reason');
    });
  });

  describe('notes', () => {
    it('devrait valider si notes est absent', async () => {
      dto.notes = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('devrait échouer si notes n\'est pas une chaîne', async () => {
      (dto as any).notes = 123;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('notes');
    });

    it('devrait échouer si notes dépasse 500 caractères', async () => {
      dto.notes = 'a'.repeat(501);
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('notes');
    });
  });
}); 