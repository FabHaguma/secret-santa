// src/components/NameInput.jsx
import { h } from 'preact';
import styles from './NameInput.module.css';

function NameInput({ value, onInput }) { // Accept props
  return (
    <div class={styles.nameInputContainer}>
      <label htmlFor="participantNames" class={styles.label}>Participant Names:</label>
      <textarea
        id="participantNames"
        class={styles.textarea}
        rows="8"
        placeholder="Enter one name per line...
Alice
Bob
Charlie"
        value={value} // Bind value
        onInput={onInput} // Bind event handler
      ></textarea>
      <p class={styles.hint}>One name per line. Duplicate names will be flagged.</p>
    </div>
  );
}
export default NameInput;