import React, { useState } from 'react';
import './App.css';

function App() {
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Questions and result templates
  const questions = [
    {
      id: 'like_food',
      question: 'あなたの好きな食べ物は何ですか？',
      makeResult: (ans) => `あなたは${ans}が好きな人です。`,
      placeholder: '例: 寿司、ラーメン、チョコレート'
    },
    {
      id: 'dislike_food',
      question: 'あなたの嫌いな食べ物は何ですか？',
      makeResult: (ans) => `あなたは${ans}が嫌いな人です。`,
      placeholder: '例: セロリ、納豆'
    },
    {
      id: 'holiday',
      question: 'あなたは休みの日に何をしますか？',
      makeResult: (ans) => `あなたは休みの日に${ans}をする人です。`,
      placeholder: '例: 映画鑑賞、テニス、散歩'
    },
    {
      id: 'tired',
      question: 'あなたは疲れているとき何をしますか？',
      makeResult: (ans) => `あなたは疲れているとき${ans}をする人です。`,
      placeholder: '例: 入浴、睡眠、音楽鑑賞'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(() => Math.floor(Math.random() * questions.length));

  const handleSubmit = (e) => {
    e.preventDefault();
    const ans = answer.trim();
    if (!ans) {
      setResult('診断結果\n質問に答えてください。');
      return;
    }

    // Show loading text, then display result after 2 seconds
    setIsLoading(true);
    setResult('診断中...');
    const q = questions[currentIndex];
    const sentence = q.makeResult(ans);
    setTimeout(() => {
      setResult(`診断結果\n${sentence}`);
      setIsLoading(false);
    }, 3000);
  };

  const handleReset = () => {
    setAnswer('');
    setResult('');
  };

  const randomizeQuestion = () => {
    if (questions.length <= 1) return;
    let next = Math.floor(Math.random() * questions.length);
    // avoid same question twice if possible
    if (next === currentIndex) {
      next = (next + 1) % questions.length;
    }
    setCurrentIndex(next);
    setAnswer('');
    setResult('');
  };

  // Share helpers
  const shareText = () => {
    const siteUrl = typeof window !== 'undefined' ? window.location.href : '';
    const base = result ? result.trim().replace(/\n/g, ' ') : '';
    return base ? `${base} ${siteUrl}` : siteUrl;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText());
      alert('診断結果をクリップボードにコピーしました。');
    } catch (err) {
      alert('コピーに失敗しました。手動でコピーしてください。');
    }
  };
  const twitterShareUrl = () => {
    const tag = '#PersonalityType80億';
    const base = shareText().trim();
    const sep = base ? ' ' : '';
    const text = encodeURIComponent(base + sep + tag);
    return `https://twitter.com/intent/tweet?text=${text}`;
  };


  return (
    <div className="App">
      <header className="App-header">
      <h1>Personality Type 80億</h1>
      <p className="subtitle">超当たる性格診断です。質問に対する回答からあなたのパーソナリティを診断します。</p>

        <form className="quiz-form" onSubmit={handleSubmit}>
          <label>
            {questions[currentIndex].question}
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={questions[currentIndex].placeholder}
              disabled={isLoading}
            />
          </label>

          <div className="buttons">
            <button type="submit" disabled={isLoading}>{isLoading ? '診断中...' : '診断する'}</button>
            <button type="button" onClick={handleReset} className="secondary" disabled={isLoading}>リセット</button>
            <button type="button" onClick={randomizeQuestion} className="secondary" disabled={isLoading}>別の質問</button>
          </div>
        </form>

        {result && (
          <div className="result" aria-live="polite">
            {result.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        )}
        {result && (
          <div className="share-area">
            <p className="share-label">結果をシェアする</p>
            <div className="share-buttons">
              <button onClick={handleCopy} className="share-btn">コピー</button>
              <a className="twitter share-btn" href={twitterShareUrl()} target="_blank" rel="noopener noreferrer">Twitterでシェア</a>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;

