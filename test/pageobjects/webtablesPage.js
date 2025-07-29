import ExcelJS from "exceljs";

class WebtablesPage {
    constructor() {
        this.$$tableHeadings = () => $$(`//table[@id="countries"]//tr[1]/td[position()>1]`);
        this.$$rows = () => $$(`//table[@id="countries"]//tr[position()>1]`);
        this.$cell = (rowIndex, colIndex) => $(`//table[@id="countries"]//tr[${rowIndex + 1}]/td[${colIndex + 2}]`);
        this.tableHeadings = [];
        this.tableData = [];
    }

    async getTableHeadings() {
        this.tableHeadings = [];
        const headerCells = await this.$$tableHeadings();
        for (let cell of headerCells) {
            const title = await cell.getText();
            this.tableHeadings.push({ title });
        }
    }

    async getData() {
        const rows = await this.$$rows();
        this.tableData = [];

        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            let rowData = {};
            for (let columnIndex = 0; columnIndex < this.tableHeadings.length; columnIndex++) {
                const heading = this.tableHeadings[columnIndex].title;
                const cellData = await this.$cell(rowIndex + 1, columnIndex).getText();
                rowData[heading] = cellData;
            }
            this.tableData.push(rowData);
        }
        console.log(this.tableData);
    }

    async createExcelFile(worksheetTitle, filepath) {
        await this.getTableHeadings();
        await this.getData();
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(worksheetTitle);

        const dir = 'test/.artifacts';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const headerRow = worksheet.addRow(this.tableHeadings.map(h => h.title));
        headerRow.eachCell((cell) => {
            cell.font = { bold: true };
        });
        this.tableData.forEach(row => {
            worksheet.addRow(Object.values(row));
        });
        await workbook.xlsx.writeFile(filepath);
    }
}

export default new WebtablesPage();