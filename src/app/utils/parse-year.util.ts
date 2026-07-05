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
  let start = 0;
  let end: number | null = null;

  // Split by range separators (–, -, /)
  const parts = year.split(/[–\-\/]/).map(p => p.trim());
  
  if (parts.length === 1) {
    const isBC = /a\.C\./i.test(parts[0]);
    const numMatch = parts[0].match(/(\d+)/);
    if (numMatch) {
      start = parseInt(numMatch[1], 10);
      if (isBC) start = -start;
    }
  } else if (parts.length === 2) {
    // If the first part doesn't specify an era, it inherits 'a.C.' from the second part if the second part is 'a.C.'
    const isStartBC = /a\.C\./i.test(parts[0]) || (!/d\.C\./i.test(parts[0]) && /a\.C\./i.test(parts[1])); 
    const isEndBC = /a\.C\./i.test(parts[1]);
    
    const startMatch = parts[0].match(/(\d+)/);
    if (startMatch) {
      start = parseInt(startMatch[1], 10);
      if (isStartBC) start = -start;
    }
    
    const endMatch = parts[1].match(/(\d+)/);
    if (endMatch) {
      end = parseInt(endMatch[1], 10);
      if (isEndBC) end = -end;
    }
  }

  return { start, end };
}
