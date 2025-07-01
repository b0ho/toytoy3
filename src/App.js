import React, { useState, useEffect } from 'react';
import './App.css';
import DailyCalendar from './components/DailyCalendar';
import MonthlyView from './components/MonthlyView';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('daily'); // 'daily' or 'monthly'
  const [tornDates, setTornDates] = useState(() => {
    const saved = localStorage.getItem('tornDates');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('tornDates', JSON.stringify(tornDates));
  }, [tornDates]);

  const handleTearPage = () => {
    const dateStr = currentDate.toDateString();
    if (!tornDates.includes(dateStr)) {
      setTornDates([...tornDates, dateStr]);
      
      // 다음 날로 이동
      const nextDay = new Date(currentDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setCurrentDate(nextDay);
    }
  };

  const isDateTorn = (date) => {
    return tornDates.includes(date.toDateString());
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>📅 찢어 쓰는 일력</h1>
        <button 
          className="view-toggle"
          onClick={() => setView(view === 'daily' ? 'monthly' : 'daily')}
        >
          {view === 'daily' ? '📅 전체 달력' : '📄 오늘 일력'}
        </button>
      </header>

      <main className="app-main">
        {view === 'daily' ? (
          <DailyCalendar 
            currentDate={currentDate}
            onTearPage={handleTearPage}
            isTorn={isDateTorn(currentDate)}
          />
        ) : (
          <MonthlyView 
            currentDate={currentDate}
            onDateSelect={setCurrentDate}
            tornDates={tornDates}
            onBackToDaily={() => setView('daily')}
          />
        )}
      </main>
    </div>
  );
}

export default App;