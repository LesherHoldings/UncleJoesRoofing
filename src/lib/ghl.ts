import { site } from '../config/site';

let loaded = false;

/** Adds GoHighLevel's embed script (auto-resizes form/calendar iframes) once per page. */
export function loadGhlEmbedScript() {
  if (loaded) return;
  loaded = true;
  const s = document.createElement('script');
  s.src = site.ghl.embedScript;
  s.async = true;
  document.body.appendChild(s);
}
