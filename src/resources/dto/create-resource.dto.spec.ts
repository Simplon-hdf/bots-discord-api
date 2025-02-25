import { validate } from 'class-validator';
import { CreateResourceDto } from './create-resource.dto';
import { describe, it, expect } from 'vitest';

describe('CreateResourceDto', () => {
  it('should validate a valid DTO', async () => {
    // Arrange
    const dto = new CreateResourceDto();
    dto.title = 'Test Resource';
    dto.description = 'Test Description';
    dto.content = 'Test Content';
    dto.status = 'active';
    dto.uuidMember = '123e4567-e89b-12d3-a456-426614174000';

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBe(0);
  });

  describe('title validation', () => {
    it('should fail when title is empty', async () => {
      // Arrange
      const dto = new CreateResourceDto();
      dto.title = '';
      dto.description = 'Test Description';
      dto.content = 'Test Content';
      dto.status = 'active';
      dto.uuidMember = '123e4567-e89b-12d3-a456-426614174000';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('title');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail when title is too long', async () => {
      // Arrange
      const dto = new CreateResourceDto();
      dto.title = 'a'.repeat(51);  // More than 50 characters
      dto.description = 'Test Description';
      dto.content = 'Test Content';
      dto.status = 'active';
      dto.uuidMember = '123e4567-e89b-12d3-a456-426614174000';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('title');
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });
  });

  describe('description validation', () => {
    it('should fail when description is empty', async () => {
      // Arrange
      const dto = new CreateResourceDto();
      dto.title = 'Test Resource';
      dto.description = '';
      dto.content = 'Test Content';
      dto.status = 'active';
      dto.uuidMember = '123e4567-e89b-12d3-a456-426614174000';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('description');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });
  });

  describe('content validation', () => {
    it('should fail when content is empty', async () => {
      // Arrange
      const dto = new CreateResourceDto();
      dto.title = 'Test Resource';
      dto.description = 'Test Description';
      dto.content = '';
      dto.status = 'active';
      dto.uuidMember = '123e4567-e89b-12d3-a456-426614174000';

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
      const dto = new CreateResourceDto();
      dto.title = 'Test Resource';
      dto.description = 'Test Description';
      dto.content = 'Test Content';
      dto.status = 'invalid_status';
      dto.uuidMember = '123e4567-e89b-12d3-a456-426614174000';

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
          const dto = new CreateResourceDto();
          dto.title = 'Test Resource';
          dto.description = 'Test Description';
          dto.content = 'Test Content';
          dto.status = status;
          dto.uuidMember = '123e4567-e89b-12d3-a456-426614174000';

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

  describe('uuidMember validation', () => {
    it('should fail when uuidMember is not a valid UUID', async () => {
      // Arrange
      const dto = new CreateResourceDto();
      dto.title = 'Test Resource';
      dto.description = 'Test Description';
      dto.content = 'Test Content';
      dto.status = 'active';
      dto.uuidMember = 'not-a-uuid';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('uuidMember');
      expect(errors[0].constraints).toHaveProperty('isUuid');
    });
  });
}); 