// src/utils/localStorage.js
// ─────────────────────────────────────────────────────────────
// Thin helpers for reading and writing step entries to
// localStorage. Wired up in Phase 2.
// ─────────────────────────────────────────────────────────────

const KEY = 'stepwise_entries'

/** Load entries array from localStorage. Returns [] if nothing stored. */
export function loadEntries() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    console.warn('StepWise: could not parse localStorage entries.')
    return []
  }
}

/** Persist the full entries array to localStorage. */
export function saveEntries(entries) {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries))
  } catch {
    console.warn('StepWise: could not write to localStorage.')
  }
}

/** Clear all stored entries. */
export function clearEntries() {
  localStorage.removeItem(KEY)
}
