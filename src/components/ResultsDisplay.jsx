// src/components/ResultsDisplay.jsx
import { h } from 'preact';
import styles from './ResultsDisplay.module.css';

function ResultsDisplay({ groupTitle, pairings, feedbackMessage, hasResults }) { // Accept props
  return (
    <div class={styles.resultsContainer}>
      {feedbackMessage && <p class={styles.feedbackError}>{feedbackMessage}</p>}

      {hasResults ? (
        <div>
          {groupTitle && <h2 class={styles.groupTitleDisplay}>{groupTitle} Pairings:</h2>}
          {!groupTitle && <h2 class={styles.resultsTitle}>Secret Santa Pairings:</h2>}
          {pairings.length > 0 ? (
            <ul class={styles.pairingsList}>
              {pairings.map(pair => (
                <li key={pair.giver} class={styles.pairingItem}>
                  <strong>{pair.giver}</strong> gifts to <strong>{pair.receiver}</strong>
                </li>
              ))}
            </ul>
          ) : (
            !feedbackMessage && <p>No pairings generated. This might be due to strict exclusions.</p>
          )}
          <p class={styles.copyHint}>You can copy the list above or use the download buttons.</p>
        </div>
      ) : (
        !feedbackMessage && <p class={styles.noResults}>
          Enter names and exclusions, then click "Generate Secret Santa" to see the magic!
        </p>
      )}
    </div>
  );
}
export default ResultsDisplay;