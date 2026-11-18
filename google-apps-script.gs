/**
 * AWTD Website -> Google Sheets Integration
 * Target Spreadsheet ID: 1dqh6_nAvz0KphMWpfqKSeEB5MegwJ74fBHv-7KchAPk
 *
 * Setup:
 * 1. Open https://docs.google.com/spreadsheets/d/1dqh6_nAvz0KphMWpfqKSeEB5MegwJ74fBHv-7KchAPk/edit
 * 2. Go to Extensions -> Apps Script, replace Code.gs with this file, and Save.
 * 3. Click Deploy -> New deployment -> Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the Web App URL (https://script.google.com/macros/s/.../exec)
 *    and set AWTD_CONFIG.googleSheetsEndpoint in js/main.js.
 */
function doPost(e) {
  try {
    var sheetId = '1dqh6_nAvz0KphMWpfqKSeEB5MegwJ74fBHv-7KchAPk';
    var ss = SpreadsheetApp.openById(sheetId);
    var sheet = ss.getSheets()[0];

    var data = JSON.parse(e.postData.contents || '{}');

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Form Type',
        'Name / Contact',
        'Organisation / Company',
        'Email',
        'Phone',
        'Role / Pathway',
        'Sector / Track / Field',
        'Location',
        'Title',
        'Message / Details',
        'Page URL'
      ]);
    }

    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.formType || data.type || 'Submission',
      data.name || data.contactName || data.fullName || data.authorName || '',
      data.organisation || data.company || data.institution || '',
      data.email || '',
      data.phone || '',
      data.role || data.publicationState || '',
      data.sector || data.tradeTrack || data.field || '',
      data.location || '',
      data.title || '',
      data.message || data.needs || data.ventureConcept || data.abstract || '',
      data.pageUrl || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
