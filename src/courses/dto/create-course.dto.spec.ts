import { describe, it, expect } from "vitest";
import { validate } from 'class-validator';
import { CreateCourseDto } from "./create-course.dto";

describe('CreateCourseDto', () => {
    it('should validate a valid DTO', async () => {
        const dto = new CreateCourseDto();
        dto.name = 'Développeur web';
        dto.isCertified = true;
        dto.uuidGuild = '123456789012345678';
        dto.uuidCategory = '123456789012345678';

        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
    });

    it('should fail validation for missing required fields', async () => {
        const dto = new CreateCourseDto();

        const errors = await validate(dto);
        
        expect(errors).toHaveLength(4);
        
        const errorProperties = errors.map(error => error.property);
        expect(errorProperties).toContain('name');
        expect(errorProperties).toContain('isCertified');
        expect(errorProperties).toContain('uuidGuild');
        expect(errorProperties).toContain('uuidCategory');
    });

    it('should fail validation for short name', async () => {
        const dto = new CreateCourseDto();
        dto.name = 'cd';
        dto.isCertified = true;
        dto.uuidGuild = '123456789012345678';
        dto.uuidCategory = '123456789012345678';

        const errors = await validate(dto);
        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('name');
    });
});