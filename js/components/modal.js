/* LUXE — Modal Component */

export function openModal(title, contentHTML) {
  const root = document.getElementById('modal-root');
  root.innerHTML = `
    <div class="modal-backdrop" id="modal-backdrop">
      <div class="modal-content">
        <div class="modal-header">
          <h3>${title}</h3>
          <span class="modal-close" id="modal-close-btn">✕</span>
        </div>
        <div class="modal-body">${contentHTML}</div>
      </div>
    </div>`;
  const backdrop = document.getElementById('modal-backdrop');
  requestAnimationFrame(() => backdrop.classList.add('open'));
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeModal(); });
  document.getElementById('modal-close-btn').addEventListener('click', closeModal);
  document.addEventListener('keydown', _escClose);
}

function _escClose(e) { if (e.key === 'Escape') closeModal(); }

export function closeModal() {
  const backdrop = document.getElementById('modal-backdrop');
  if (backdrop) { backdrop.classList.remove('open'); setTimeout(() => { document.getElementById('modal-root').innerHTML = ''; }, 300); }
  document.removeEventListener('keydown', _escClose);
}
