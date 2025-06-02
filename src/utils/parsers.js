// src/utils/parsers.js

export function parseNames(namesInput) {
  if (!namesInput.trim()) {
    return { names: [], error: null }; // No error if empty, just no names
  }
  const namesArray = namesInput
    .split('\n')
    .map(name => name.trim())
    .filter(name => name.length > 0);

  const uniqueNames = [...new Set(namesArray)];

  if (uniqueNames.length !== namesArray.length) {
    // Find duplicates for a more specific message (optional enhancement)
    const counts = {};
    namesArray.forEach(name => { counts[name] = (counts[name] || 0) + 1; });
    const duplicates = Object.entries(counts).filter(([_, count]) => count > 1).map(([name, _]) => name);
    return {
      names: [], // Or return uniqueNames and let generation fail later?
                 // For now, block generation by returning empty names on error.
      error: `Duplicate names found: ${duplicates.join(', ')}. Please ensure all names are unique.`
    };
  }
  return { names: uniqueNames, error: null };
}

export function parseExclusions(exclusionsInput, participantNames) {
  if (!exclusionsInput.trim()) {
    return { exclusions: [], error: null };
  }
  const rules = exclusionsInput
    .split('\n')
    .map(rule => rule.trim())
    .filter(rule => rule.length > 0);

  const parsedExclusions = [];
  for (const rule of rules) {
    const parts = rule.split('->').map(part => part.trim());
    if (parts.length === 2 && parts[0] && parts[1]) {
      const giver = parts[0];
      const cantGiftTo = parts[1];

      // Validate if names exist in participant list (if participantNames is populated)
      if (participantNames.length > 0) {
        if (!participantNames.includes(giver)) {
          return { exclusions: [], error: `Exclusion error: Name "${giver}" not found in participant list.` };
        }
        if (!participantNames.includes(cantGiftTo)) {
          return { exclusions: [], error: `Exclusion error: Name "${cantGiftTo}" not found in participant list.` };
        }
      }
      if (giver === cantGiftTo) {
          return { exclusions: [], error: `Exclusion error: "${giver}" cannot be excluded from gifting to themselves.` };
      }

      parsedExclusions.push({ giver, cantGiftTo });
    } else {
      return { exclusions: [], error: `Malformed exclusion rule: "${rule}". Use format "Name1 -> Name2".` };
    }
  }
  return { exclusions: parsedExclusions, error: null };
}