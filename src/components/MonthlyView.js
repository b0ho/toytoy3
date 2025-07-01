import React, { useState } from 'react';

const MonthlyView = ({ currentDate, onDateSelect, tornDates, onBackToDaily }) => {
  const [viewDate, setViewDate] = useState(new Date(currentDate));

  const getMonthDates = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // 첫 번째 날과 마지막 날
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // 첫 주의 시작 (일요일부터)
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());
    
    // 마지막 주의 끝 (토요일까지)
    const endDate = new Date(lastDay);
    endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
    
    const dates = [];
    const currentDatePointer = new Date(startDate);
    
    while (currentDatePointer <= endDate) {
      dates.push(new Date(currentDatePointer));
      currentDatePointer.setDate(currentDatePointer.getDate() + 1);
    }
    
    return dates;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setViewDate(newDate);
  };

  const handleDateClick = (date) => {
    onDateSelect(date);
    onBackToDaily();
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isTorn = (date) => {
    return tornDates.includes(date.toDateString());
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === viewDate.getMonth();
  };

  const formatMonthYear = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}년 ${month}월`;
  };

  const monthDates = getMonthDates(viewDate);
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="monthly-view">
      <div className="monthly-header">
        <button className="back-button" onClick={onBackToDaily}>
          ← 돌아가기
        </button>
        
        <div className="monthly-title">📅 전체 달력</div>
        
        <div className="month-navigation">
          <button 
            className="nav-button"
            onClick={() => navigateMonth(-1)}
          >
            ‹
          </button>
          
          <div className="current-month">
            {formatMonthYear(viewDate)}
          </div>
          
          <button 
            className="nav-button"
            onClick={() => navigateMonth(1)}
          >
            ›
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        <div className="weekdays">
          {weekdays.map((day, index) => (
            <div key={index} className="weekday">
              {day}
            </div>
          ))}
        </div>

        <div className="dates-grid">
          {monthDates.map((date, index) => (
            <div
              key={index}
              className={`date-cell ${
                !isCurrentMonth(date) ? 'other-month' : ''
              } ${
                isToday(date) ? 'today' : ''
              } ${
                isTorn(date) ? 'torn' : ''
              }`}
              onClick={() => handleDateClick(date)}
            >
              {date.getDate()}
            </div>
          ))}
        </div>

        <div style={{ 
          marginTop: '2rem', 
          textAlign: 'center',
          fontSize: '0.9rem',
          color: '#666'
        }}>
          <div>💡 날짜를 클릭하면 해당 날로 이동합니다</div>
          <div>✂️ 빨간색 날짜는 이미 찢어진 날짜입니다</div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyView;