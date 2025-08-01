import testData from "../testData/cosmocode.json";
import common from "../pageobjects/common";
import webtablesPage from "../pageobjects/webtablesPage";
import fs from 'fs';

describe('Test the CosmoCode application', () => {
    it(`Launch the landing page and verify the title to be '${testData.titles.cosmocodeTitle}'`, async () => {
        await common.launchUrl(testData.url);
        await expect(browser).toHaveTitle(testData.titles.cosmocodeTitle);
    });

    it('Write the data to an excel file and verify that excel file is generated', async () => {
        await webtablesPage.createExcelFile(testData.worksheet.title, testData.worksheet.filepath);
        await expect(fs.existsSync(testData.worksheet.filepath)).toBe(true);
    });

    it('Verify that the data to in the excel file matches the data in the website', async () => {
        const result = await webtablesPage.verifyExcelData();
        await expect(result).toBeTrue();
    });
});