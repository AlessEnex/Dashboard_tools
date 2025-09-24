const statusEl = document.getElementById('status');

function toast(msg){
  if(!statusEl) return;
  statusEl.textContent = msg;
  clearTimeout(toast._t);
  toast._t = setTimeout(()=> statusEl.textContent = "", 4200);
}

document.addEventListener('click', (e) => {
  const link = e.target.closest('a.card');
  if(!link) return;

  const title = link.querySelector('.card__title')?.textContent?.trim() || 'Link';
  toast(`Apro “${title}” in una nuova scheda…`);
});
