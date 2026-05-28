const express = require('express');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const EXCEL_FILE = path.join(__dirname, 'Lista ØNation.xlsx');
const SHEET_NAME = 'Registrazioni';

app.use(express.json());
app.use(express.static(__dirname));

async function getOrCreateWorkbook() {
    const workbook = new ExcelJS.Workbook();

    if (fs.existsSync(EXCEL_FILE)) {
        await workbook.xlsx.readFile(EXCEL_FILE);
        if (!workbook.getWorksheet(SHEET_NAME)) {
            const sheet = workbook.addWorksheet(SHEET_NAME);
            sheet.addRow(['Nome', 'Cognome', 'Email', 'Data Registrazione']);
        }
    } else {
        const sheet = workbook.addWorksheet(SHEET_NAME);
        sheet.addRow(['Nome', 'Cognome', 'Email', 'Data Registrazione']);
    }

    return workbook;
}

app.post('/submit', async (req, res) => {
    const { nome, cognome, email } = req.body;

    if (!nome || !cognome || !email) {
        return res.status(400).json({ result: 'error', message: 'Campi mancanti' });
    }

    try {
        const workbook = await getOrCreateWorkbook();
        const sheet = workbook.getWorksheet(SHEET_NAME);

        const dataOra = new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' });
        sheet.addRow([nome, cognome, email, dataOra]);

        await workbook.xlsx.writeFile(EXCEL_FILE);

        console.log(`[${dataOra}] Registrato: ${nome} ${cognome} <${email}>`);
        res.json({ result: 'success' });
    } catch (err) {
        console.error('Errore scrittura Excel:', err.message);
        res.status(500).json({ result: 'error', message: 'Errore interno' });
    }
});

app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
    console.log(`Apri il form su http://localhost:${PORT}/form.html`);
});
