import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: vi.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true when no roles are required', () => {
      // Arrange
      const context = {
        getHandler: vi.fn(),
        getClass: vi.fn(),
        switchToHttp: vi.fn().mockReturnValue({
          getRequest: vi.fn().mockReturnValue({
            user: {
              roles: ['user'],
            },
          }),
        }),
      } as unknown as ExecutionContext;

      vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(null);

      // Act
      const result = guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true when user has required role', () => {
      // Arrange
      const context = {
        getHandler: vi.fn(),
        getClass: vi.fn(),
        switchToHttp: vi.fn().mockReturnValue({
          getRequest: vi.fn().mockReturnValue({
            user: {
              roles: ['user', 'admin'],
            },
          }),
        }),
      } as unknown as ExecutionContext;

      vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);

      // Act
      const result = guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when user does not have required role', () => {
      // Arrange
      const context = {
        getHandler: vi.fn(),
        getClass: vi.fn(),
        switchToHttp: vi.fn().mockReturnValue({
          getRequest: vi.fn().mockReturnValue({
            user: {
              roles: ['user'],
            },
          }),
        }),
      } as unknown as ExecutionContext;

      vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);

      // Act
      const result = guard.canActivate(context);

      // Assert
      expect(result).toBe(false);
    });
  });
}); 