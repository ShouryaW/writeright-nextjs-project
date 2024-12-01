// src/app/grammar-check/page.tsx

'use client';

import { useState } from 'react';
import styles from '../styles/home.module.css';
import { ClipLoader } from 'react-spinners';
import { diffWords } from 'diff';

export default function GrammarCheckPage() {
  const [inputText, setInputText] = useState('');
  const [correctedText, setCorrectedText] = useState('');
  const [diffResult, setDiffResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGrammarCheck = async () => {
    if (!inputText) {
      setError('Please enter text to check.');
      return;
    }

    setLoading(true);
    setError('');
    setCorrectedText('');
    setDiffResult([]);

    try {
      const response = await fetch('/api/grammar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      setCorrectedText(data.correctedText);

      // Generate differences using diffWords
      const diff = diffWords(data.originalText, data.correctedText);
      setDiffResult(diff);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Fetch error:', err.message);
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setCorrectedText('');
    setDiffResult([]);
    setError('');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Grammar Checker ✍️</h1>
      </header>

      <textarea
        className={styles.textarea}
        placeholder="Enter text to check grammar..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      <div className={styles.controls}>
        <button
          className={styles.button}
          onClick={handleGrammarCheck}
          disabled={loading}
        >
          {loading ? <ClipLoader size={20} color="#FFFFFF" /> : 'Check Grammar'}
        </button>
        <button className={styles.clearButton} onClick={handleClear}>
          Clear
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.output}>
        <h2 className={styles.subtitle}>Corrected Text</h2>
        <p>{correctedText || 'Your corrected text will appear here.'}</p>

        <h2 className={styles.subtitle}>Changes</h2>
        <div className={styles.diffOutput}>
          {diffResult.map((part, index) => (
            <span
              key={index}
              className={
                part.added
                  ? styles.added
                  : part.removed
                  ? styles.removed
                  : ''
              }
              style={{
                backgroundColor: part.added ? '#66BB6A' : part.removed ? '#FF6F61' : 'transparent',
                color: part.added || part.removed ? '#1A1A1A' : '#FFFFFF',
              }}
            >
              {part.value}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
