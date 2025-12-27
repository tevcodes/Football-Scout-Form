import { describe, it, expect } from 'vitest';
import { getMaxDateForAge, isValidPhoneNumber } from './validators';

describe('Scout Validators', () => {

    it('calculates the correct max date for a 16 year old', () => {
        const result = getMaxDateForAge(16);
        const today = new Date();
        const year = today.getFullYear() - 16;

        expect(result).toContain(year.toString());
    });

    it('accepts a valid SA phone number', () => {
        expect(isValidPhoneNumber('0721234567')).toBe(true);
    });

    it('rejects a number that is too short', () => {
        expect(isValidPhoneNumber('072123')).toBe(false);
    });

    it('rejects a number with letters', () => {
        expect(isValidPhoneNumber('0721234abc')).toBe(false);
    });
});