import ExcelJS from "exceljs";
import fs from 'fs';
import path from 'path';

class Common {
    constructor() {
        this.$emailField = () => $(`//input[@type="email"]`);
        this.$passwordField = () => $(`//input[@type="password"]`);
        this.$button = () => $(`//input[@type="submit"]`);
        this.$label = () => $(`//div[@role="heading"]`);
        this.$yesButton = () => $(`//input[@value="Yes"]`);
        this.$signInRequest = () => $(`//div[contains(text(),"Approve sign in request")]`)
    }

    async launchUrl(url) {
        await browser.url(url);
        await browser.maximizeWindow();
    }

    async signIn(email, password) {
        await this.$emailField().setValue(email);
        await this.$button().click();
        await browser.waitUntil(
            async () => (await this.$label().getText()) === 'Enter password',
            {
                timeout: 5000,
                timeoutMsg: 'Expected text to be "Enter password" within 5s'
            }
        );
        await this.$passwordField().setValue(password);
        await this.$button().click();
        await browser.pause(15000);
        if (await this.$signInRequest().isDisplayed()) {
            await browser.waitUntil(
                async () => !(await this.$signInRequest().isDisplayed()),
                {
                    timeout: 20000,
                    timeoutMsg: "Expected 'Approve sign in request' to disappear"
                }
            );
        }
        if (await this.$yesButton().isDisplayed({ timeout: 10000 }).catch(() => false)) {
            await this.$yesButton().click();
        }
    }

    /**
     * Read Excel file and return markdown table string
     */
    async readExcelAsMarkdown(filePath) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const sheet = workbook.worksheets[0];

        const rows = [];
        sheet.eachRow({ includeEmpty: true }, (row) => {
            rows.push(row.values.slice(1)); // remove empty index 0
        });

        // Convert to markdown table
        let markdown = '';
        const headers = rows[0];
        markdown += `| ${headers.join(' | ')} |\n`;
        markdown += `| ${headers.map(() => '---').join(' | ')} |\n`;

        for (let i = 1; i < rows.length; i++) {
            markdown += `| ${rows[i].join(' | ')} |\n`;
        }

        return markdown;
    }

    /**
     * Verify if a file exists
     */
    async verifyFileExists(downloadDir, fileName) {
        const filePath = path.resolve(downloadDir, fileName);
        await browser.waitUntil(() => fs.existsSync(filePath), {
            timeout: 10000,
            timeoutMsg: `File "${fileName}" was not downloaded in time`
        });
        return filePath;
    }


}
export default new Common();