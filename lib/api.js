const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function fetchAPI(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
}

export function getMediaAssets(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return fetchAPI(`/media-assets?${qs}`);
}

export function getMediaAsset(id) {
  return fetchAPI(`/media-assets/${id}`);
}

export function getTags() {
  return fetchAPI('/tags');
}
