import axios from 'axios';
import { getListOfPublicHolidays, checkIfTodayIsPublicHoliday, getNextPublicHolidays } from '../services/public-holidays.service';
import { PUBLIC_HOLIDAYS_API_URL} from "../config";

jest.mock('axios'); // Mock the axios module

const PUBLIC_HOLIDAYS = [
    {
        date: '2024-01-01',
        localName: 'New Year',
        name: 'New Year',
        countryCode: 'GB',
        fixed: true,
        global: true,
        counties: null,
        launchYear: null,
        types: ['Public'],
    },
];

describe('getListOfPublicHolidays', () => {
    it('should fetch and return a list of public holidays for the specified year and country', async () => {
        const year = 2024;
        const country = 'GB';
        jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({data: PUBLIC_HOLIDAYS}));
        const result = await getListOfPublicHolidays(year, country);
        expect(result).toEqual([
            {
                date: '2024-01-01',
                localName: 'New Year',
                name: 'New Year',
            },
        ]);
    });

    it('should call API  with proper arguments', async () => {
        const year = 2024;
        const country = 'GB';
        const axiosGetSpy = jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({data: PUBLIC_HOLIDAYS}));
        await getListOfPublicHolidays(year, country);
        expect(axiosGetSpy).toHaveBeenCalledWith(`${PUBLIC_HOLIDAYS_API_URL}/PublicHolidays/${year}/${country}`);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});

describe('checkIfTodayIsPublicHoliday', () => {
    it('should return true if today is a public holiday in the specified country', async () => {
        const country = 'GB';
        jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({status: 200}));
        const result = await checkIfTodayIsPublicHoliday(country);
        expect(result).toBe(true);
    });

    it('should call API  with proper arguments', async () => {
        const country = 'GB';
        const axiosGetSpy = jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({data: PUBLIC_HOLIDAYS}));
        await checkIfTodayIsPublicHoliday(country);
        expect(axiosGetSpy).toHaveBeenCalledWith(`${PUBLIC_HOLIDAYS_API_URL}/IsTodayPublicHoliday/${country}`);
    })

    it('should return false if today is not a public holiday in the specified country', async () => {
        const country = 'GB';
        jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({status: 404}));
        const result = await checkIfTodayIsPublicHoliday(country);
        expect(result).toBe(false);

    });
    afterEach(() => {
        jest.clearAllMocks();
    });
});

describe('getNextPublicHolidays', () => {
    it('should fetch and return the next public holidays for the specified country', async () => {
        const country = 'GB';
        const publicHolidays = [
            {
                date: '2024-01-01',
                localName: 'New Year',
                name: 'New Year',
                countryCode: 'GB',
                fixed: true,
                global: true,
                counties: null,
                launchYear: null,
                types: ['Public'],
            },
        ];
        jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({data: PUBLIC_HOLIDAYS}));
        const result = await getNextPublicHolidays(country);
        expect(result).toEqual([
            {
                date: '2024-01-01',
                localName: 'New Year',
                name: 'New Year',
            },
        ]);
    });

    it('should call API  with proper arguments', async () => {
        const country = 'GB';
        const axiosGetSpy = jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({data: PUBLIC_HOLIDAYS}));
        await getNextPublicHolidays(country);
        expect(axiosGetSpy).toHaveBeenCalledWith(`${PUBLIC_HOLIDAYS_API_URL}/NextPublicHolidays/${country}`);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});
