// src/utils/santaGenerator.js

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function generateSantaAssignments(participants, exclusions) {
  if (!participants || participants.length < 2) {
    return { pairings: [], error: "At least two participants are required." };
  }

  let attempts = 0;
  const MAX_ATTEMPTS = 100; // To prevent infinite loops with impossible exclusions

  while (attempts < MAX_ATTEMPTS) {
    attempts++;
    let availableReceivers = shuffleArray([...participants]);
    const assignments = [];
    let possible = true;

    // Create a map for quick exclusion lookup
    const exclusionMap = new Map();
    exclusions.forEach(ex => {
      if (!exclusionMap.has(ex.giver)) {
        exclusionMap.set(ex.giver, new Set());
      }
      exclusionMap.get(ex.giver).add(ex.cantGiftTo);
    });

    for (const giver of participants) {
      let assigned = false;
      // Try to find a receiver for the current giver
      for (let i = 0; i < availableReceivers.length; i++) {
        const potentialReceiver = availableReceivers[i];

        // Conditions for a valid assignment:
        // 1. Giver is not gifting to themselves
        // 2. The assignment does not violate an exclusion rule
        const isSelf = giver === potentialReceiver;
        const isExcluded = exclusionMap.has(giver) && exclusionMap.get(giver).has(potentialReceiver);

        if (!isSelf && !isExcluded) {
          assignments.push({ giver, receiver: potentialReceiver });
          availableReceivers.splice(i, 1); // Remove assigned receiver
          assigned = true;
          break; // Move to the next giver
        }
      }

      if (!assigned) {
        possible = false; // Could not find a valid receiver for this giver
        break; // This attempt failed, try to reshuffle and reassign
      }
    }

    if (possible && assignments.length === participants.length) {
      return { pairings: assignments, error: null }; // Success!
    }
  }

  // If loop finishes, it means max attempts were reached
  return { pairings: [], error: "Could not generate pairings. Exclusions might be too restrictive or it's a rare unlucky shuffle. Try regenerating or adjusting exclusions." };
}