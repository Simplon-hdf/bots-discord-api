import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtAuthGuard],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should call super.canActivate', () => {
      // Arrange
      const context = {} as ExecutionContext;
      const superCanActivate = vi.spyOn(JwtAuthGuard.prototype, 'canActivate');
      superCanActivate.mockImplementation(() => true as any);

      // Act
      const result = guard.canActivate(context);

      // Assert
      expect(superCanActivate).toHaveBeenCalledWith(context);
      expect(result).toBe(true);
    });
  });

  describe('handleRequest', () => {
    it('should return user when no error and user exists', () => {
      // Arrange
      const err = null;
      const user = { id: 'user_id', username: 'test_user' };
      const info = null;

      // Act
      const result = guard.handleRequest(err, user, info);

      // Assert
      expect(result).toEqual(user);
    });

    it('should throw UnauthorizedException when error exists', () => {
      // Arrange
      const err = new Error('Test error');
      const user = { id: 'user_id', username: 'test_user' };
      const info = null;

      // Act & Assert
      expect(() => guard.handleRequest(err, user, info)).toThrow(err);
    });

    it('should throw UnauthorizedException when user does not exist', () => {
      // Arrange
      const err = null;
      const user = null;
      const info = null;

      // Act & Assert
      expect(() => guard.handleRequest(err, user, info)).toThrow(UnauthorizedException);
      expect(() => guard.handleRequest(err, user, info)).toThrow('Authentication required');
    });
  });
}); 