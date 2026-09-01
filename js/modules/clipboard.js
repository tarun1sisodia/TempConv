// Clipboard with graceful degradation: async API -> execCommand -> manual-select fallback.
// Returns the path taken so callers can vary feedback ('async' | 'exec' | 'manual').

/**
 * @param {string} text @param {HTMLInputElement} [fallbackField]
 * @returns {Promise<'async'|'exec'|'manual'>}
 */
export async function copyText(text, fallbackField) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return 'async';
    } catch { /* permission or context failure — fall through */ }
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    if (ok) return 'exec';
  } catch { /* fall through */ }
  if (fallbackField && typeof fallbackField.select === 'function') {
    fallbackField.focus();
    fallbackField.select();
  }
  return 'manual';
}
