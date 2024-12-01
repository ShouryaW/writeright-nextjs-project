'use client';

import { useState } from 'react';
import styles from './styles/home.module.css'; 
import { ClipLoader } from 'react-spinners';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [rephrasedText, setRephrasedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('normal'); 

  const handleRephrase = async () => {
    if (!inputText) {
      setError('Please enter text to rewrite.');
      return;
    }

    setLoading(true);
    setError('');
    setRephrasedText('');

    try {
      const response = await fetch('/api/rephrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, mode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      setRephrasedText(data.rephrasedText);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setRephrasedText('');
    setError('');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>WriteRight Bot ✍️</h1>
      </header>

      <div className={styles.selector}>
        <label htmlFor="mode">Select Rewrite Mode:</label>
        <select
          id="mode"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="normal">Normal</option>
          <option value="creative">Creative</option>
          <option value="formal">Formal</option>
          <option value="concise">Concise</option>
        </select>
      </div>

      <textarea
        className={styles.textarea}
        placeholder="Enter text to rewrite..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      <div className={styles.controls}>
        <button
          className={styles.button}
          onClick={handleRephrase}
          disabled={loading}
        >
          {loading ? <ClipLoader size={20} color="#FFFFFF" /> : 'Rewrite'}
        </button>
        <button className={styles.clearButton} onClick={handleClear}>
          Clear
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.output}>
        <h2 className={styles.subtitle}>Rewritten Text</h2>
        <p>{rephrasedText || 'Your rewritten text will appear here.'}</p>
      </div>
    </div>
  );
}
