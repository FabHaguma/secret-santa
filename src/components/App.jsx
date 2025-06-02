// src/components/App.jsx
import { h } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';
import styles from './App.module.css';
import GroupTitleInput from './GroupTitleInput';
import NameInput from './NameInput';
import ExclusionInput from './ExclusionInput';
import Controls from './Controls';
import ResultsDisplay from './ResultsDisplay';
import { parseNames, parseExclusions } from '../utils/parsers';
import { generateSantaAssignments } from '../utils/santaGenerator';
import { downloadTextFile } from '../utils/downloadHelper';
import jsPDF from 'jspdf';

function App() {
  // State for user inputs
  const [groupTitle, setGroupTitle] = useState('');
  const [namesInput, setNamesInput] = useState(''); // Raw text from names textarea
  const [exclusionsInput, setExclusionsInput] = useState(''); // Raw text from exclusions textarea

  // State for processed data
  const [participants, setParticipants] = useState([]); // Array of unique names
  const [exclusions, setExclusions] = useState([]); // Array of { giver: string, cantGiftTo: string }

  // State for results and feedback
  const [pairings, setPairings] = useState([]); // Array of { giver: string, receiver: string }
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);

  // Inside App() component in src/components/App.jsx

  // Load from localStorage on initial render
  useEffect(() => {
    const savedGroupTitle = localStorage.getItem('secretSanta_groupTitle');
    const savedNamesInput = localStorage.getItem('secretSanta_namesInput');
    const savedExclusionsInput = localStorage.getItem('secretSanta_exclusionsInput');

    if (savedGroupTitle) setGroupTitle(savedGroupTitle);
    if (savedNamesInput) setNamesInput(savedNamesInput);
    if (savedExclusionsInput) setExclusionsInput(savedExclusionsInput);
  }, []); // Empty dependency array means this runs once on mount

  // Save to localStorage whenever inputs change
  useEffect(() => {
    localStorage.setItem('secretSanta_groupTitle', groupTitle);
  }, [groupTitle]);

  // useEffect for namesInput
  useEffect(() => {
    localStorage.setItem('secretSanta_namesInput', namesInput);
    const { names, error } = parseNames(namesInput);
    if (error) {
      setFeedbackMessage(error);
      setParticipants([]);
      setPairings([]); // Clear pairings if names are invalid
      setIsGenerated(false);
    } else {
      setParticipants(names);
      // Clear ONLY if the current feedback was related to names
      if (feedbackMessage && (feedbackMessage === error || feedbackMessage.startsWith("Duplicate names") || feedbackMessage.startsWith("At least two"))) {
          setFeedbackMessage('');
      }
    }
  }, [namesInput, feedbackMessage]); // Add feedbackMessage to deps if you clear it based on its previous value

  // useEffect for exclusionsInput
  useEffect(() => {
    localStorage.setItem('secretSanta_exclusionsInput', exclusionsInput);
    const { exclusions: parsedExcs, error: exclusionError } = parseExclusions(exclusionsInput, participants);
    if (exclusionError) {
        setFeedbackMessage(prev => { // Be careful not to overwrite a more critical name error
            if (prev && (prev.startsWith("Duplicate names") || prev.startsWith("At least two"))) return prev;
            return exclusionError;
        });
        setExclusions([]);
        setPairings([]); // Clear pairings if exclusions are invalid
        setIsGenerated(false);
    } else {
        setExclusions(parsedExcs);
        if (feedbackMessage && (feedbackMessage === exclusionError || feedbackMessage.startsWith("Exclusion error"))) {
            setFeedbackMessage('');
        }
    }
  }, [exclusionsInput, participants, feedbackMessage]);

  // Inside App() component in src/components/App.jsx

  const handleGenerate = useCallback(() => {
    setFeedbackMessage(''); // Clear previous messages
    setPairings([]);
    setIsGenerated(false);

    // 1. Final validation of parsed names and exclusions (already done by useEffects, but good to re-check)
    const { names: currentParticipants, error: namesError } = parseNames(namesInput);
    if (namesError) {
      setFeedbackMessage(namesError);
      setParticipants([]); // Ensure participants state is also cleared
      return;
    }
    if (currentParticipants.length < 2) {
        setFeedbackMessage("At least two participants are required to generate pairs.");
        setParticipants(currentParticipants);
        return;
    }
    setParticipants(currentParticipants); // Update participants state just in case

    const { exclusions: currentExclusions, error: exclusionsError } = parseExclusions(exclusionsInput, currentParticipants);
    if (exclusionsError) {
      setFeedbackMessage(exclusionsError);
      setExclusions([]); // Ensure exclusions state is also cleared
      return;
    }
    setExclusions(currentExclusions); // Update exclusions state

    // 2. Call the generation algorithm
    const result = generateSantaAssignments(currentParticipants, currentExclusions);

    if (result.error) {
      setFeedbackMessage(result.error);
      setPairings([]);
      setIsGenerated(false); // Explicitly set to false on error
    } else {
      setPairings(result.pairings);
      setIsGenerated(true);
      // Optionally clear feedback if successful
      // setFeedbackMessage("Pairings generated successfully!"); // Or just let the results show
    }
  }, [namesInput, exclusionsInput]); // Dependencies for useCallback

  const handleDownloadTxt = useCallback(() => {
  if (!isGenerated || pairings.length === 0) {
    setFeedbackMessage("No pairings to download.");
    return;
  }

  let content = "Secret Santa Pairings\n";
  content += "======================\n\n";

  if (groupTitle) {
    content += `Event: ${groupTitle}\n\n`;
  }

  pairings.forEach(pair => {
    content += `${pair.giver} gifts to ${pair.receiver}\n`;
  });

  content += "\nGenerated by Secret Santa Web App";

  const filename = groupTitle ? `Secret_Santa_${groupTitle.replace(/\s+/g, '_')}.txt` : "Secret_Santa_Pairings.txt";
  downloadTextFile(filename, content);

}, [pairings, groupTitle, isGenerated]);

const handleDownloadPdf = useCallback(() => {
  if (!isGenerated || pairings.length === 0) {
    setFeedbackMessage("No pairings to download.");
    return;
  }

  const doc = new jsPDF();
  let yPos = 20; // Starting Y position for text

  doc.setFontSize(18);
  doc.text("Secret Santa Pairings", 105, yPos, { align: "center" });
  yPos += 10;

  if (groupTitle) {
    doc.setFontSize(14);
    doc.text(`Event: ${groupTitle}`, 105, yPos, { align: "center" });
    yPos += 10;
  }

  yPos += 5; // Add a little space
  doc.setFontSize(12);

  pairings.forEach(pair => {
    if (yPos > 270) { // Check if we need a new page (approx. A4 height)
      doc.addPage();
      yPos = 20;
    }
    doc.text(`${pair.giver} gifts to ${pair.receiver}`, 20, yPos);
    yPos += 7; // Line height
  });

  yPos += 10;
  doc.setFontSize(10);
  doc.setTextColor(150); // Grey text
  doc.text("Generated by Secret Santa Web App", 105, yPos, { align: "center" });

  const filename = groupTitle ? `Secret_Santa_${groupTitle.replace(/\s+/g, '_')}.pdf` : "Secret_Santa_Pairings.pdf";
  doc.save(filename);

}, [pairings, groupTitle, isGenerated]);

  const hasEnoughParticipants = participants.length >= 2;
  const canGenerateNow = hasEnoughParticipants && !isGenerated;
  const canRegenerateNow = hasEnoughParticipants && isGenerated;
  const canDownloadNow = isGenerated && pairings.length > 0;

  return (
    <div class={styles.appContainer}>
      {/* ... header ... */}
      <main class={styles.mainContent}>
        <GroupTitleInput
          value={groupTitle}
          onInput={(e) => setGroupTitle(e.target.value)}
        />
        <div class={styles.inputsGrid}>
          <NameInput
            value={namesInput}
            onInput={(e) => setNamesInput(e.target.value)}
          />
          <ExclusionInput
            value={exclusionsInput}
            onInput={(e) => setExclusionsInput(e.target.value)}
          />
        </div>
        <Controls
        onGenerate={handleGenerate}
        onRegenerate={handleGenerate} // Regenerate uses the same handler
        onDownloadTxt={handleDownloadTxt}
        onDownloadPdf={handleDownloadPdf}
        canGenerate={canGenerateNow}
        canRegenerate={canRegenerateNow}
        canDownload={canDownloadNow}
      />
        <ResultsDisplay
          groupTitle={groupTitle}
          pairings={pairings}
          feedbackMessage={feedbackMessage}
          hasResults={isGenerated && pairings.length > 0}
        />
      </main>
      {/* ... footer ... */}
    </div>
  );
}

export default App;