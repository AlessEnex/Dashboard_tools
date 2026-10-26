const statusEl = document.getElementById('status');

function toast(msg){
  if(!statusEl) return;
  statusEl.textContent = msg;
  clearTimeout(toast._t);
  toast._t = setTimeout(()=> statusEl.textContent = "", 4200);
}

/**
 * Genera un file Excel vuoto conforme al tracciato ERP.
 *
 * @param {string} filename Nome del file da scaricare.
 */
function exportExcelVuotoERP(filename = 'distinta_base.xlsx') {
  if (typeof XLSX === 'undefined') {
    alert('Impossibile esportare Excel: libreria XLSX non caricata.');
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

  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(distinteData), 'Distinte');
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(articoliData), 'Articoli');
  XLSX.writeFile(workbook, filename);
  toast(`Modello ERP "${filename}" scaricato.`);
}

document.addEventListener('click', (e) => {
  const link = e.target.closest('a.card');
  if(!link) return;

  const title = link.querySelector('.card__title')?.textContent?.trim() || 'Link';
  toast(`Apro “${title}” in una nuova scheda…`);
});

async function checkQrToolServer() {
  const card = document.getElementById('qr-tool-card');
  const status = document.getElementById('qr-server-status');
  if (!card || !status) return;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    await fetch(card.dataset.serverUrl, { method: 'GET', mode: 'no-cors', cache: 'no-store', signal: controller.signal });
    status.textContent = 'Server raggiungibile';
    status.className = 'server-status server-status--online';
  } catch {
    card.removeAttribute('href');
    card.removeAttribute('target');
    card.setAttribute('aria-disabled', 'true');
    card.tabIndex = -1;
    card.classList.add('card--disabled');
    status.textContent = 'Server offline';
    status.className = 'server-status server-status--offline';
  } finally {
    clearTimeout(timeout);
  }
}

checkQrToolServer();
