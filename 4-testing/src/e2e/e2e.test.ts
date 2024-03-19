const request = require('supertest');
//const app = require('your-express-app'); // Replace with your Express app instance

const API_URL = 'https://date.nager.at/api/v3';

describe('Nager.Date API E2E Tests', () => {
    describe('GET /PublicHolidays/year/countryCode', () => {
        it('should return a list of public holidays for a specific year and country', async () => {
            const year = 2024;
            const countryCode = 'US';

            const response = await request(API_URL)
                .get(`/PublicHolidays/${year}/${countryCode}`)
                .expect(200);

            expect(response.body).toBeDefined();
            expect(response.body.length).toBeGreaterThan(0);
        });
    });

    describe('GET /NextPublicHolidays/countryCode', () => {
        it('should return next public holidays for a given country', async () => {
            const countryCode = 'US';

            const response = await request(API_URL)
                .get(`/NextPublicHolidays/${countryCode}`)
                .expect(200);

            expect(response.body).toBeDefined();
            expect(response.body.length).toBeGreaterThan(0);
        });
    });
});