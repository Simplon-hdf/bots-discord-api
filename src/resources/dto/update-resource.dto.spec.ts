import { validate } from 'class-validator';
import { UpdateResourceDto } from './update-resource.dto';
import { describe, it, expect } from 'vitest';

describe('UpdateResourceDto', () => {
  it('should validate a valid DTO with all fields', async () => {
    // Arrange
    const dto = new UpdateResourceDto();
    dto.title = 'Test Resource';
    dto.description = 'Test Description';
    dto.content = 'Test Content';
    dto.status = 'active';

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBe(0);
  });

  it('should validate a valid DTO with partial fields', async () => {
    // Arrange
    const dto = new UpdateResourceDto();
    dto.title = 'Test Resource';
    dto.description = 'Test Description';

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBe(0);
  });

  describe('title validation', () => {
    it('should fail when title is empty string', async () => {
      // Arrange
      const dto = new UpdateResourceDto();
      dto.title = '';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('title');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail when title is too long', async () => {
      // Arrange
      const dto = new UpdateResourceDto();
      dto.title = 'a'.repeat(51);  // More than 50 characters

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('title');
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });
  });

  describe('description validation', () => {
    it('should fail when description is empty string', async () => {
      // Arrange
      const dto = new UpdateResourceDto();
      dto.description = '';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('description');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });
  });

  describe('content validation', () => {
    it('should fail when content is empty string', async () => {
      // Arrange
      const dto = new UpdateResourceDto();
      dto.content = '';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('content');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });
  });

  describe('status validation', () => {
    it('should fail when status is invalid', async () => {
      // Arrange
      const dto = new UpdateResourceDto();
      dto.status = 'invalid_status';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('status');
      expect(errors[0].constraints).toHaveProperty('isEnum');
    });

    it('should accept all valid status values', async () => {
      // Arrange
      const validStatuses = ['active', 'inactive'];
      const results = await Promise.all(
        validStatuses.map(async (status) => {
          const dto = new UpdateResourceDto();
          dto.status = status;

          // Act
          return validate(dto);
        })
      );

      // Assert
      results.forEach((errors) => {
        expect(errors.length).toBe(0);
      });
    });
  });
}); 