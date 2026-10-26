const articlesBody = document.getElementById('articles-body');
const statusEl = document.getElementById('status');
const filenameEl = document.getElementById('filename');
const yearInput = document.getElementById('year-number');
yearInput.value = new Date().getFullYear();
let yearCode = String(yearInput.value).slice(-2);

document.getElementById('year-code').textContent = yearCode;

function toast(message) {
  statusEl.textContent = message;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { statusEl.textContent = ''; }, 4200);
}

function addRow(codice = '', descrizione = '') {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td><input class="code-input" aria-label="Codice" value="${escapeHtml(codice)}" placeholder="Es. ART-0001" /></td>
    <td><input class="description-input" aria-label="Descrizione" value="${escapeHtml(descrizione)}" placeholder="Inserisci una descrizione" /></td>
    <td class="remove-cell"><button class="remove-row" type="button" aria-label="Rimuovi riga">Rimuovi</button></td>
  `;
  row.querySelector('.remove-row').addEventListener('click', () => {
    if (articlesBody.rows.length === 1) {
      row.querySelectorAll('input').forEach(input => { input.value = ''; });
      return;
    }
    row.remove();
  });
  articlesBody.appendChild(row);
}

function escapeHtml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function exportExcelERP() {
  if (typeof XLSX === 'undefined') {
    alert('Impossibile esportare Excel: libreria XLSX non caricata.');
    return;
  }

  const articoli = [...articlesBody.rows]
    .map(row => ({
      codice: row.querySelector('.code-input').value.trim(),
      descrizione: row.querySelector('.description-input').value.trim()
    }))
    .filter(row => row.codice || row.descrizione);

  if (!articoli.length) {
    toast('Inserisci almeno un codice o una descrizione prima di esportare.');
    return;
  }

  const workbook = XLSX.utils.book_new();
  const distinteData = [[
    'codice padre', 'codice figlio', 'quantita', 'variantepadre', 'variantefiglio'
  ]];
  const articoliData = [[
    'codice', 'descr', 'Marca', 'allegato', 'edizione', 'data edizione', 'peso',
    'Art_Mod (con anche Ciclo)', 'Gruppo', 'UM', 'MAT', 'Sp', 'svx', 'svy', 'svz',
    'lung', 'area', 'Desc_Agg', 'Mag', 'Nomenclatura'
  ]];

  articoli.forEach(({ codice, descrizione }) => {
    articoliData.push([codice, descrizione, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
  });

  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(distinteData), 'Distinte');
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(articoliData), 'Articoli');
  let filename = filenameEl.value.trim() || 'distinta_base.xlsx';
  if (!filename.toLowerCase().endsWith('.xlsx')) filename += '.xlsx';
  XLSX.writeFile(workbook, filename);
  toast(`Esportato ${filename} con ${articoli.length} articol${articoli.length === 1 ? 'o' : 'i'}.`);
}

document.getElementById('add-row').addEventListener('click', () => addRow());
document.getElementById('export-excel').addEventListener('click', exportExcelERP);

const templateToggle = document.getElementById('template-toggle');
const templateContent = document.getElementById('template-content');

templateToggle.addEventListener('click', () => {
  const isOpen = !templateContent.hidden;
  templateContent.hidden = isOpen;
  templateToggle.setAttribute('aria-expanded', String(!isOpen));
  templateToggle.querySelector('.toggle-icon').textContent = isOpen ? '+' : '−';
});

document.getElementById('generate-template').addEventListener('click', () => {
  const year = yearInput.value.trim();
  const offer = document.getElementById('offer-number').value.trim();
  const revision = document.getElementById('revision-number').value.trim();
  const positions = Number(document.getElementById('positions-number').value);
  const generatedList = document.getElementById('generated-list');

  if (!/^\d{4}$/.test(year)) {
    generatedList.textContent = 'Inserisci un anno di quattro cifre, ad esempio 2026.';
    return;
  }
  if (!/^\d+$/.test(offer)) {
    generatedList.textContent = 'Inserisci un numero offerta composto da cifre; gli zeri iniziali verranno mantenuti.';
    return;
  }
  if (!/^\d+$/.test(revision)) {
    generatedList.textContent = 'Il numero di revisione deve essere un numero intero.';
    return;
  }
  if (!Number.isInteger(positions) || positions < 1) {
    generatedList.textContent = 'Inserisci almeno una posizione.';
    return;
  }

  yearCode = year.slice(-2);
  document.getElementById('year-code').textContent = yearCode;
  const codes = Array.from({ length: positions }, (_, index) =>
    `OF${yearCode}N${offer}R${revision}P${String(index).padStart(3, '0')}`
  );

  generatedList.innerHTML = `<strong>${codes.length} codici generati</strong><ol>${codes.map(code => `<li>${code}</li>`).join('')}</ol>`;
  const onlyEmptyRow = articlesBody.rows.length === 1 && !articlesBody.querySelector('.code-input').value && !articlesBody.querySelector('.description-input').value;
  if (onlyEmptyRow) articlesBody.replaceChildren();
  codes.forEach(code => addRow(code, code));
  toast(`${codes.length} codici aggiunti alla tabella articoli.`);
});

addRow();
