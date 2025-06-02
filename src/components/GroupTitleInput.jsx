// src/components/GroupTitleInput.jsx
import { h } from 'preact';
import styles from './GroupTitleInput.module.css'; // Create GroupTitleInput.module.css

function GroupTitleInput({ value, onInput }) { // Accept props
  return (
    <div class={styles.groupTitleContainer}>
      <label htmlFor="groupTitle" class={styles.label}>Group/Event Name (Optional):</label>
      <input
        type="text"
        id="groupTitle"
        class={styles.input}
        placeholder="e.g., Office Party 2025"
        value={value} // Bind value
        onInput={onInput} // Bind event handler
      />
    </div>
  );
}

export default GroupTitleInput;