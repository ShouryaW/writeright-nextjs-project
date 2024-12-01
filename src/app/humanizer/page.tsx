// src/app/humanizer/page.tsx

'use client';

import { useState } from 'react';
import styles from '../styles/home.module.css';
import { ClipLoader } from 'react-spinners';

export default function HumanizerPage() {
  const [inputText, setInputText] = useState('');
  const [humanizedText, setHumanizedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tone, setTone] = useState('casual'); // Default tone

  const handleHumanize = async () => {
    if (!inputText) {
      setError('Please enter text to humanize.');
      return;
    }

    setLoading(true);
    setError('');
    setHumanizedText('');

    try {
      const response = await fetch('/api/humanizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, tone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      setHumanizedText(data.humanizedText);
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
    setHumanizedText('');
    setError('');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>AI Humanizer 🤖 → 👨‍💻</h1>
      </header>

      <div className={styles.selector}>
        <label htmlFor="tone">Select Tone:</label>
        <select
          id="tone"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
        >
          <option value="casual">Casual</option>
          <option value="professional">Professional</option>
          <option value="conversational">Conversational</option>
          <option value="formal">Formal</option>
        </select>
      </div>

      <textarea
        className={styles.textarea}
        placeholder="Enter text to humanize..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      <div className={styles.controls}>
        <button
          className={styles.button}
          onClick={handleHumanize}
          disabled={loading}
        >
          {loading ? <ClipLoader size={20} color="#FFFFFF" /> : 'Humanize'}
        </button>
        <button className={styles.clearButton} onClick={handleClear}>
          Clear
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.output}>
        <h2 className={styles.subtitle}>Humanized Text</h2>
        <p>{humanizedText || 'Your humanized text will appear here.'}</p>
      </div>
    </div>
  );
}
