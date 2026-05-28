# ØNation Form — Guest List

Form di registrazione per eventi ØNation. Gli ospiti si registrano online, i dati vengono salvati in un Google Sheet e viene inviata un'email di conferma automatica.

---

## Link del form

```
https://danielesandre.github.io/ONationForm/
```

Questo è il link da mandare agli invitati. Funziona da telefono, tablet e PC senza nessun server acceso.

---

## Come funziona

```
Ospite compila il form
        ↓
Google Apps Script (sempre online, gratuito)
        ↓
Google Sheet  →  lista registrazioni in tempo reale
        +
Email di conferma automatica all'ospite
```

---

## Dove vedere le registrazioni

1. Vai su [drive.google.com](https://drive.google.com)
2. Apri il file **"Lista ØNation"** (Google Sheet)
3. Le registrazioni appaiono in tempo reale con Nome, Cognome, Email

Per esportare come Excel: **File → Scarica → Microsoft Excel (.xlsx)**

---

## Configurazione Google Apps Script

Lo script è collegato al Google Sheet "Lista ØNation" e si occupa di:
- Salvare i dati nel foglio
- Inviare l'email di conferma all'ospite

### Codice dello script

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    sheet.appendRow([data.nome, data.cognome, data.email]);
    inviaEmailConferma(data.email, data.nome);
    return ContentService.createTextOutput(JSON.stringify({"result":"success"})).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({"result":"error", "error": error.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}

function inviaEmailConferma(emailUtente, nomeUtente) {
  var oggetto = "ØNATION - Conferma Registrazione Guest List";
  var corpo = "Ciao " + nomeUtente + ",\n\n" +
              "La tua registrazione per l'evento ØNation è stata confermata correttamente.\n" +
              "Ti aspettiamo!\n\n" +
              "ØNation Crew";
  MailApp.sendEmail(emailUtente, oggetto, corpo);
}
```

### Come ricreare lo script (se necessario)

1. Vai su [sheets.google.com](https://sheets.google.com) con l'account Google che vuoi usare come mittente delle email
2. Crea un nuovo foglio chiamato **"Lista ØNation"**
3. Prima riga: `Nome` | `Cognome` | `Email` nelle colonne A, B, C
4. Vai su **Estensioni → Apps Script**
5. Incolla il codice qui sopra
6. Salva, poi clicca **Distribuisci → Nuovo deployment**
   - Tipo: **App web**
   - Esegui come: **Me**
   - Accesso: **Chiunque**
7. Copia l'URL generato
8. Aggiornalo in `index.html` alla riga con `const scriptURL = '...'`
9. Committa e pusha (vedi sezione sotto)

### Importante — autorizzazione email

La prima volta che usi un nuovo script, devi autorizzare l'invio email:
1. Nello script editor, seleziona `inviaEmailConferma` dal menu a tendina
2. Clicca **Esegui**
3. Segui il flusso di autorizzazione Google
4. Da quel momento le email partono automaticamente

---

## Come aggiornare il form

Il form è deployato su GitHub Pages dal branch `main`.

### Modificare e pubblicare

```bash
# Modifica i file localmente, poi:
git add .
git commit -m "descrizione modifica"
git push origin main
```

GitHub Pages si aggiorna automaticamente entro 1-2 minuti.

### File principali

| File | Descrizione |
|------|-------------|
| `index.html` | Il form (struttura HTML + logica invio) |
| `form.css` | Stile grafico del form |
| `logobianco_verticale.png` | Logo ØNation |
| `server.js` | Server Node.js locale (solo per uso interno, non usato online) |

---

## Server locale (opzionale)

Esiste anche un server Node.js per uso interno (es. tablet all'ingresso della festa sulla rete locale). Scrive direttamente su `Lista ØNation.xlsx`.

```bash
npm install
npm start
# Apri http://localhost:3000
```

**Nota:** il server locale non è quello usato online. Il form pubblico usa Google Apps Script.

---

## Note

- Le email di conferma partono dall'account Google che ha creato lo script
- Gmail ha un limite di 500 email/giorno con Google Apps Script (più che sufficiente per una festa privata)
- Le email potrebbero finire nello spam dei destinatari — consigliare agli ospiti di controllare
