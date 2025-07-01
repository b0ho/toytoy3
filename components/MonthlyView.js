import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
} from 'react-native';

const { width } = Dimensions.get('window');

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

  const handleDatePress = (date) => {
    onDateSelect(date);
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

  const renderDateCell = ({ item: date, index }) => {
    const isCurrentMonthDate = isCurrentMonth(date);
    const isTodayDate = isToday(date);
    const isTornDate = isTorn(date);

    return (
      <TouchableOpacity
        style={[
          styles.dateCell,
          !isCurrentMonthDate && styles.otherMonthDate,
          isTodayDate && styles.todayDate,
          isTornDate && styles.tornDate,
        ]}
        onPress={() => handleDatePress(date)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.dateCellText,
            !isCurrentMonthDate && styles.otherMonthText,
            isTodayDate && styles.todayText,
            isTornDate && styles.tornText,
          ]}
        >
          {date.getDate()}
        </Text>
        {isTornDate && (
          <Text style={styles.scissorsIcon}>✂️</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBackToDaily}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>← 돌아가기</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>📅 전체 달력</Text>
        
        <View style={styles.navigation}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigateMonth(-1)}
            activeOpacity={0.7}
          >
            <Text style={styles.navButtonText}>‹</Text>
          </TouchableOpacity>
          
          <Text style={styles.currentMonth}>
            {formatMonthYear(viewDate)}
          </Text>
          
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigateMonth(1)}
            activeOpacity={0.7}
          >
            <Text style={styles.navButtonText}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.calendarContainer}>
          {/* 요일 헤더 */}
          <View style={styles.weekdaysContainer}>
            {weekdays.map((day, index) => (
              <View key={index} style={styles.weekdayCell}>
                <Text style={styles.weekdayText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* 날짜 그리드 */}
          <View style={styles.datesContainer}>
            {monthDates.map((date, index) => (
              <View key={index} style={styles.dateCellWrapper}>
                {renderDateCell({ item: date, index })}
              </View>
            ))}
          </View>

          {/* 안내 메시지 */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>💡 날짜를 터치하면 해당 날로 이동합니다</Text>
            <Text style={styles.infoText}>✂️ 빨간색 날짜는 이미 찢어진 날짜입니다</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    backgroundColor: '#667eea',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  backButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  navButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  currentMonth: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    minWidth: 150,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  calendarContainer: {
    padding: 20,
  },
  weekdaysContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  weekdayText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  datesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dateCellWrapper: {
    width: `${100/7}%`,
    aspectRatio: 1,
    padding: 2,
  },
  dateCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    position: 'relative',
  },
  dateCellText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  otherMonthDate: {
    opacity: 0.3,
  },
  otherMonthText: {
    color: '#ccc',
  },
  todayDate: {
    backgroundColor: '#667eea',
  },
  todayText: {
    color: 'white',
  },
  tornDate: {
    backgroundColor: '#ff6b6b',
  },
  tornText: {
    color: 'white',
  },
  scissorsIcon: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    fontSize: 10,
  },
  infoContainer: {
    marginTop: 30,
    alignItems: 'center',
    gap: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default MonthlyView;