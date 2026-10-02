/**
 * Deterrents against casual inspection of the live site.
 *
 * This cannot truly hide the source — the browser must download the HTML/JS to
 * run it, so view-source:, the browser menu, the network tab or curl still work.
 * It only raises the bar. Keep real secrets on the server.
 */

// Docked DevTools shrink the viewport by at least this much; browser chrome
// (toolbars, scrollbars, side panels) stays well under it.
const SIZE_THRESHOLD = 160;
const CHECK_INTERVAL_MS = 1000;
const OVERLAY_ID = 'devtools-guard-overlay';

function isEditable(target) {
  return target instanceof Element && !!target.closest('input, textarea, [contenteditable="true"]');
}

function isBlockedShortcut(e) {
  const key = e.key?.toLowerCase();
  const mod = e.ctrlKey || e.metaKey;

  if (e.key === 'F12') return true;
  // Ctrl+Shift+I/J/C (Windows/Linux) and Cmd+Option+I/J/C (Mac)
  if (mod && (e.shiftKey || e.altKey) && ['i', 'j', 'c'].includes(key)) return true;
  // View source and save page
  if (mod && (key === 'u' || key === 's')) return true;
  return false;
}

function devtoolsLikelyOpen() {
  return (
    window.outerWidth - window.innerWidth > SIZE_THRESHOLD ||
    window.outerHeight - window.innerHeight > SIZE_THRESHOLD
  );
}

function showOverlay() {
  if (document.getElementById(OVERLAY_ID)) return;
  const root = document.getElementById('root');
  if (root) root.style.visibility = 'hidden';

  const overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  overlay.setAttribute('role', 'alert');
  overlay.style.cssText = [
    'position:fixed', 'inset:0', 'z-index:2147483647', 'display:flex',
    'align-items:center', 'justify-content:center', 'padding:24px',
    'background:#050b16', 'color:#e6edf7', 'text-align:center',
    'font:500 16px/1.5 Inter,system-ui,sans-serif',
  ].join(';');
  overlay.textContent = 'Developer tools are not allowed on this site. Close them to continue.';
  document.body.appendChild(overlay);
}

function hideOverlay() {
  document.getElementById(OVERLAY_ID)?.remove();
  const root = document.getElementById('root');
  if (root) root.style.visibility = '';
}

export function initDevtoolsGuard() {
  document.addEventListener('contextmenu', (e) => {
    // Keep the menu on form fields so people can still paste.
    if (!isEditable(e.target)) e.preventDefault();
  });

  document.addEventListener(
    'keydown',
    (e) => {
      if (isBlockedShortcut(e)) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true,
  );

  // Phones/tablets have no docked DevTools, and their on-screen keyboard shrinks
  // the viewport enough to look like it — only size-check mouse/trackpad devices.
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const check = () => (devtoolsLikelyOpen() ? showOverlay() : hideOverlay());
  window.addEventListener('resize', check);
  setInterval(check, CHECK_INTERVAL_MS);
  check();
}
