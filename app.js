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
