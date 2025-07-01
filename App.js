import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  StatusBar,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DailyCalendar from './components/DailyCalendar';
import MonthlyView from './components/MonthlyView';
import Header from './components/Header';

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('daily'); // 'daily' or 'monthly'
  const [tornDates, setTornDates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 저장된 데이터 불러오기
  useEffect(() => {
    loadTornDates();
  }, []);

  // 찢어진 날짜 데이터 저장/불러오기
  const loadTornDates = async () => {
    try {
      const saved = await AsyncStorage.getItem('tornDates');
      if (saved) {
        setTornDates(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load torn dates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTornDates = async (dates) => {
    try {
      await AsyncStorage.setItem('tornDates', JSON.stringify(dates));
    } catch (error) {
      console.error('Failed to save torn dates:', error);
    }
  };

  const handleTearPage = () => {
    const dateStr = currentDate.toDateString();
    if (!tornDates.includes(dateStr)) {
      const newTornDates = [...tornDates, dateStr];
      setTornDates(newTornDates);
      saveTornDates(newTornDates);
      
      // 다음 날로 이동
      const nextDay = new Date(currentDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setCurrentDate(nextDay);
    }
  };

  const isDateTorn = (date) => {
    return tornDates.includes(date.toDateString());
  };

  const handleViewToggle = () => {
    setView(view === 'daily' ? 'monthly' : 'daily');
  };

  const handleDateSelect = (date) => {
    setCurrentDate(date);
    setView('daily');
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>📅 일력 준비 중...</Text>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#667eea" />
        
        <Header 
          view={view}
          onViewToggle={handleViewToggle}
        />

        {view === 'daily' ? (
          <DailyCalendar 
            currentDate={currentDate}
            onTearPage={handleTearPage}
            isTorn={isDateTorn(currentDate)}
          />
        ) : (
          <MonthlyView 
            currentDate={currentDate}
            onDateSelect={handleDateSelect}
            tornDates={tornDates}
            onBackToDaily={() => setView('daily')}
          />
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#667eea',
  },
  loadingText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});