/**
 * Utility: parseYearString
 *
 * Parses human-readable year strings into structured numeric data.
 *
 * Supported formats:
 *   "~250 a.C."        → { start: -250,  end: null }
 *   "~100 – 380 d.C."  → { start: 100,   end: 380  }
 *   "382 – 405 d.C."   → { start: 382,   end: 405  }
 *   "1454 / 1455"      → { start: 1454,  end: 1455 }
 *   "1517"             → { start: 1517,  end: null }
 *   "2001 – 2008"      → { start: 2001,  end: 2008 }
 *   "2020+"            → { start: 2020,  end: null }
 *   "1827"             → { start: 1827,  end: null }
 */
export function parseYearString(year: string): { start: number; end: number | null } {
  const isBC = /a\.C\./i.test(year);

  // Remove prefix tilde, spaces, plus signs, era suffixes for parsing
  const cleaned = year
    .replace(/~\s*/g, '')
    .replace(/\s*a\.C\./gi, '')
    .replace(/\s*d\.C\./gi, '')
    .replace(/\+/g, '')
    .trim();

  // Range: "382 – 405", "1454 / 1455", "100 – 380"
  const rangeMatch = cleaned.match(/^(\d+)\s*[–\/]\s*(\d+)$/);
  if (rangeMatch) {
    let start = parseInt(rangeMatch[1], 10);
    let end = parseInt(rangeMatch[2], 10);
    if (isBC) {
      start = -start;
      end = -end;
    }
    return { start, end };
  }

  // Single year: "1517", "250", "2020"
  const singleMatch = cleaned.match(/^(\d+)$/);
  if (singleMatch) {
    let start = parseInt(singleMatch[1], 10);
    if (isBC) start = -start;
    return { start, end: null };
  }

  // Fallback: try to extract first number
  const fallback = cleaned.match(/(\d+)/);
  if (fallback) {
    let start = parseInt(fallback[1], 10);
    if (isBC) start = -start;
    return { start, end: null };
  }

  return { start: 0, end: null };
}
