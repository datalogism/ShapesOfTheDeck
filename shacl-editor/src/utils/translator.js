const BASE = '/api/translate';

export async function shacl2shex(turtle) {
  const resp = await fetch(`${BASE}/shacl2shex`, {
    method: 'POST',
    headers: { 'Content-Type': 'text/turtle' },
    body: turtle,
  });
  if (!resp.ok) {
    const msg = await resp.text();
    throw new Error(msg || `HTTP ${resp.status}`);
  }
  return resp.text();
}

export async function shex2shacl(shex) {
  const resp = await fetch(`${BASE}/shex2shacl`, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: shex,
  });
  if (!resp.ok) {
    const msg = await resp.text();
    throw new Error(msg || `HTTP ${resp.status}`);
  }
  return resp.text();
}

export async function checkTranslatorHealth() {
  try {
    const resp = await fetch('/api/health', { signal: AbortSignal.timeout(2000) });
    return resp.ok;
  } catch {
    return false;
  }
}
