import fs from 'fs';
import path from 'path';
import testData from "../testData/sharepoint.json";
import common from "../pageobjects/common";

describe('Download excel file', () => {
    it(`Launch the url`, async () => {
        await common.launchUrl(testData.url);
        await expect(browser).toHaveTitle(testData.titles.signIn);
    });

    it(`Sign in to microsoft account`, async () => {
        await common.signIn(testData.credentials.email, testData.credentials.password);
        await browser.waitUntil(
            async () => (await browser.getTitle()) === testData.titles.working,
            {
                timeout: 15000,
                timeoutMsg: `Expected title to be "${testData.titles.working}"`
            }
        );
        await expect(browser).toHaveTitle(testData.titles.working);
        await browser.pause(10000);
    });
});

describe('Read excel file', () => {
    it('Verify Excel file and display in summary', async () => {
        const filePath = await common.verifyFileExists(testData.excelFile.downloadDir, testData.excelFile.fileName);
        const markdownTable = await common.readExcelAsMarkdown(filePath);
        console.log('Excel Data:\n', markdownTable);
        if (process.env.GITHUB_STEP_SUMMARY) {
            fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `## Excel Report\n${markdownTable}\n`);
        }
    });
});