// src/components/Controls.jsx
import { h } from 'preact';
import styles from './Controls.module.css';

function Controls({
  onGenerate,
  onRegenerate,
  onDownloadTxt,
  onDownloadPdf,
  canGenerate,
  canRegenerate,
  canDownload
}) {
  return (
    <div class={styles.controlsContainer}>
      <button
        class={`${styles.button} ${styles.generateButton}`}
        onClick={onGenerate} // Use onGenerate for the initial generation
        disabled={!canGenerate}
      >
        🎁 Generate Secret Santa
      </button>
      <button
        class={`${styles.button} ${styles.secondaryButton}`}
        onClick={onRegenerate} // Use onRegenerate for subsequent generations
        disabled={!canRegenerate}
      >
        🔁 Regenerate
      </button>
      <button
        class={`${styles.button} ${styles.secondaryButton}`}
        onClick={onDownloadTxt}
        disabled={!canDownload}
      >
        📂 Download .txt
      </button>
      <button
        class={`${styles.button} ${styles.secondaryButton}`}
        onClick={onDownloadPdf}
        disabled={!canDownload}
      >
        📄 Download .pdf
      </button>
    </div>
  );
}

export default Controls;