import React, { useState } from 'react';

const DailyCalendar = ({ currentDate, onTearPage, isTorn }) => {
  const [isTearing, setIsTearing] = useState(false);

  const handleTearClick = () => {
    if (isTorn || isTearing) return;
    
    setIsTearing(true);
    
    // 애니메이션 완료 후 콜백 실행
    setTimeout(() => {
      onTearPage();
      setIsTearing(false);
    }, 1500);
  };

  const formatDate = (date) => {
    return date.getDate();
  };

  const getDateInfo = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
  };

  const getDayOfWeek = (date) => {
    const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    return days[date.getDay()];
  };

  const getSeasonEmoji = (date) => {
    const month = date.getMonth() + 1;
    if (month >= 3 && month <= 5) return '🌸'; // 봄
    if (month >= 6 && month <= 8) return '☀️'; // 여름
    if (month >= 9 && month <= 11) return '🍂'; // 가을
    return '❄️'; // 겨울
  };

  return (
    <div className="daily-calendar">
      <div className={`calendar-page ${isTearing ? 'tearing' : ''} ${isTorn ? 'torn' : ''}`}>
        {/* 달력 구멍들 */}
        <div className="calendar-holes">
          <div className="hole"></div>
          <div className="hole"></div>
          <div className="hole"></div>
        </div>

        <div className="calendar-content">
          <div className="date-display">
            <div className="main-date">
              {getSeasonEmoji(currentDate)} {formatDate(currentDate)}
            </div>
            <div className="date-info">
              {getDateInfo(currentDate)}
            </div>
            <div className="day-info">
              {getDayOfWeek(currentDate)}
            </div>
          </div>

          {isTorn ? (
            <div className="torn-message">
              이미 찢어진 날짜입니다 ✂️
            </div>
          ) : (
            <button 
              className="tear-button"
              onClick={handleTearClick}
              disabled={isTearing}
            >
              {isTearing ? '찢는 중... ✂️' : '📄 오늘을 찢어내기'}
            </button>
          )}

          {!isTorn && !isTearing && (
            <div style={{ 
              marginTop: '2rem', 
              fontSize: '0.9rem', 
              color: '#666',
              fontStyle: 'italic'
            }}>
              💡 오늘을 찢어내면 다음 날로 넘어갑니다
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyCalendar;