import testData from "../testData/testData.json";
import common from "../pageobjects/common";
import webtablesPage from "../pageobjects/webtablesPage";
import fs from 'fs';

describe('Test the CosmoCode application', () => {
    it('Launch the landing page', async () => {
        await common.launchUrl(testData.url);
        await expect(browser).toHaveTitle(testData.titles.cosmocodeTitle);
    });

    it('Write the data to an excel file', async () => {
        await webtablesPage.createExcelFile(testData.worksheet.title, testData.worksheet.filepath);
        await expect(fs.existsSync(testData.worksheet.filepath)).toBe(true);
    });
});