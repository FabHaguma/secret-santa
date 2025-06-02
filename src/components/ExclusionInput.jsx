// src/components/ExclusionInput.jsx
import { h } from 'preact';
import styles from './ExclusionInput.module.css'; // Create ExclusionInput.module.css

function ExclusionInput({ value, onInput }) { // Accept props
  return (
    <div class={styles.exclusionInputContainer}>
      <label htmlFor="exclusionRules" class={styles.label}>Exclusion Rules (Optional):</label>
      <textarea
        id="exclusionRules"
        class={styles.textarea}
        rows="8"
        placeholder="Prevent matches, one rule per line...\nAlice -> Bob (Alice won't gift Bob)\nCharlie -> Diana"
        value={value} // Bind value
        onInput={onInput} // Bind event handler
      ></textarea>
      <p class={styles.hint}>Format: GiverName - ReceiverName. These names must match participant names.</p>
    </div>
  );
}

export default ExclusionInput;