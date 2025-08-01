import testData from "../testData/cosmocode.json";
import common from "../pageobjects/common";

describe('Test the CosmoCode application', () => {
    it(`Launch the landing page and verify the title to be '${testData.titles.cosmocodeTitle}'`, async () => {
        await common.launchUrl(testData.url);
        await expect(browser).toHaveTitle(testData.titles.cosmocodeTitle);
    });
});