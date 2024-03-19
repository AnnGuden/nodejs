import { validateInput, shortenPublicHoliday } from '../helpers';

const INPUT_1 = {
    year: 2024,
    country: 'GB',
};

const INPUT_2 = {
    year: 2024,
    country: 'US',
};

const INPUT_3 = {
    year: 2022,
    country: 'GB',
};

const HOLIDAY = {
    date: '2024-01-01',
    localName: 'New Year',
    name: 'New Year',
    countryCode: 'GB',
    fixed: true,
    global: true,
    counties: null,
    launchYear: null,
    types: ['Public'],
};

describe('validateInput', () => {
    it('should return true if the input is valid', () => {
        const result = validateInput(INPUT_1);
        expect(result).toBe(true);
    });

    it('should throw an error if the country is not supported', () => {
        expect(() => validateInput(INPUT_2)).toThrow('Country provided is not supported, received: US');
    });

    it('should throw an error if the year is not the current year', () => {
        expect(() => validateInput(INPUT_3)).toThrow('Year provided not the current, received: 2022');
    });
});

describe('shortenPublicHoliday', () => {
    it('should return a shortened public holiday object', () => {
        const result = shortenPublicHoliday(HOLIDAY);
        expect(result).toEqual({
            name: 'New Year',
            localName: 'New Year',
            date: '2024-01-01',
        });
    });
});