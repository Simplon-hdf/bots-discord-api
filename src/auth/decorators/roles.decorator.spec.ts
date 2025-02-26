import { Roles } from './roles.decorator';
import { SetMetadata } from '@nestjs/common';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@nestjs/common', () => ({
  SetMetadata: vi.fn().mockReturnValue('metadata'),
}));

describe('Roles Decorator', () => {
  it('should call SetMetadata with correct parameters', () => {
    // Arrange
    const roles = ['admin', 'moderator'];

    // Act
    const result = Roles(...roles);

    // Assert
    expect(SetMetadata).toHaveBeenCalledWith('roles', roles);
    expect(result).toBe('metadata');
  });
}); 