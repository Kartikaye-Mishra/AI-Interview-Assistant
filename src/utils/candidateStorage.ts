import { useEffect, useState } from "react";
import type{ CandidateEntry } from "../types/interview"; // we'll create a types file too

const STORAGE_KEY = "interviewerCandidates";

/** Get all stored candidates */
export const getCandidates = (): CandidateEntry[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored) as CandidateEntry[];
  } catch {
    return [];
  }
};

/** Save a new candidate or update existing by email */
export const saveCandidate = (candidate: CandidateEntry) => {
  const existing = getCandidates();
  const idx = existing.findIndex((c) => c.email === candidate.email);
  if (idx >= 0) {
    existing[idx] = candidate; // overwrite if same email
  } else {
    existing.push(candidate);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
};



// Get all saved candidates
export const getSavedCandidates = (): CandidateEntry[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CandidateEntry[];
  } catch {
    return [];
  }
};

// Save a new candidate entry
export const saveCandidateEntry = (entry: CandidateEntry) => {
  const candidates = getSavedCandidates();
  candidates.push(entry); // append new candidate
  localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
};

// Optionally: overwrite all candidates
export const setCandidates = (entries: CandidateEntry[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};



export function useLocalCandidates() {
  const [candidates, setCandidates] = useState<CandidateEntry[]>([]);

  // Load candidates from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setCandidates(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse localStorage candidates:", e);
        setCandidates([]);
      }
    }
  }, []);

  // Save candidates to localStorage whenever it changes
  const saveCandidates = (newCandidates: CandidateEntry[]) => {
    setCandidates(newCandidates);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCandidates));
  };

  return { candidates, setCandidates: saveCandidates };
}
