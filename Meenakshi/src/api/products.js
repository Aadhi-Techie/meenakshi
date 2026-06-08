// src/api/products.js

import { API_BASE } from "../constants/config"; // Import path fixed

const TIMEOUT_MS = 8000; // 8 seconds timeout
const MAX_RETRIES = 2;   // Retry 2 times on failure

/**
 * Fetch with timeout wrapper
 */
async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

/**
 * Thin wrapper around fetch with retry & timeout logic
 */
async function apiFetch(endpoint, retries = MAX_RETRIES) {
  const url = `${API_BASE}${endpoint}`;
  
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetchWithTimeout(url);

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText} — ${endpoint}`);
      }
      return await response.json();
    } catch (error) {
      if (i === retries) throw error; // If last retry fails, throw error
      console.warn(`Retrying fetch for ${endpoint}... (${i + 1}/${retries})`);
      // Exponential backoff wait (1s, then 2s...)
      await new Promise(res => setTimeout(res, 1000 * (i + 1))); 
    }
  }
}

// ── Public API functions ──────────────────────────────────────

export async function fetchAllProducts() {
  const data = await apiFetch("/products/");
  return Array.isArray(data) ? data : (data.results ?? []);
}

export async function fetchByCategory(categoryName) {
  const all = await fetchAllProducts();
  return all.filter(
    (p) => p?.category?.toLowerCase() === categoryName.toLowerCase()
  );
}

export async function fetchCategoryHeroImages() {
  const all = await fetchAllProducts();
  const map = {};

  for (const product of all) {
    const cat = product?.category?.trim().toLowerCase();
    if (cat && !map[cat] && product.image) {
      map[cat] = product.image;
    }
  }

  return map;
}
