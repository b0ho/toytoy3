import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

const DailyCalendar = ({ currentDate, onTearPage, isTorn }) => {
  const [isTearing, setIsTearing] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const rotateX = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const handleTearGesture = (event) => {
    if (isTorn || isTearing) return;

    const { translationY, velocityY } = event.nativeEvent;
    
    // 아래로 당기는 제스처 감지
    if (translationY > 50 && velocityY > 500) {
      startTearAnimation();
    }
  };

  const handleTearPress = () => {
    if (isTorn || isTearing) return;
    startTearAnimation();
  };

  const startTearAnimation = () => {
    setIsTearing(true);
    
    // 햅틱 피드백
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // 찢기 애니메이션
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -height,
        duration: 1500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(rotateX, {
        toValue: 1,
        duration: 1500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.8,
        duration: 1500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 애니메이션 완료 후 리셋하고 다음 날로 이동
      setTimeout(() => {
        translateY.setValue(0);
        rotateX.setValue(0);
        scale.setValue(1);
        animatedValue.setValue(0);
        setIsTearing(false);
        onTearPage();
      }, 300);
    });
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

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

  const rotateXInterpolate = rotateX.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-90deg'],
  });

  return (
    <View style={styles.container}>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={handleTearGesture}
        enabled={!isTorn && !isTearing}
      >
        <Animated.View
          style={[
            styles.calendarPage,
            {
              transform: [
                { translateY },
                { rotateX: rotateXInterpolate },
                { scale },
              ],
              opacity: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
            },
          ]}
        >
          {/* 달력 구멍들 */}
          <View style={styles.holes}>
            <View style={styles.hole} />
            <View style={styles.hole} />
            <View style={styles.hole} />
          </View>

          {/* 달력 내용 */}
          <View style={styles.content}>
            <View style={styles.dateDisplay}>
              <Text style={styles.mainDate}>
                {getSeasonEmoji(currentDate)} {formatDate(currentDate)}
              </Text>
              <Text style={styles.dateInfo}>
                {getDateInfo(currentDate)}
              </Text>
              <Text style={styles.dayInfo}>
                {getDayOfWeek(currentDate)}
              </Text>
            </View>

            {isTorn ? (
              <View style={styles.tornMessage}>
                <Text style={styles.tornText}>이미 찢어진 날짜입니다 ✂️</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={[
                  styles.tearButton,
                  isTearing && styles.tearButtonDisabled
                ]}
                onPress={handleTearPress}
                disabled={isTearing}
                activeOpacity={0.8}
              >
                <Text style={styles.tearButtonText}>
                  {isTearing ? '찢는 중... ✂️' : '📄 오늘을 찢어내기'}
                </Text>
              </TouchableOpacity>
            )}

            {!isTorn && !isTearing && (
              <Text style={styles.hintText}>
                💡 아래로 스와이프하거나 버튼을 터치하세요
              </Text>
            )}
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  calendarPage: {
    width: width - 40,
    height: height * 0.7,
    backgroundColor: 'white',
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
  holes: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 20,
    gap: 20,
  },
  hole: {
    width: 20,
    height: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  dateDisplay: {
    alignItems: 'center',
    marginBottom: 40,
  },
  mainDate: {
    fontSize: width > 375 ? 80 : 70,
    fontWeight: 'bold',
    color: '#333',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: 10,
  },
  dateInfo: {
    fontSize: width > 375 ? 20 : 18,
    color: '#666',
    marginBottom: 5,
  },
  dayInfo: {
    fontSize: 16,
    color: '#999',
  },
  tearButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
    shadowColor: '#ff6b6b',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  tearButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  tearButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tornMessage: {
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.5)',
  },
  tornText: {
    color: '#856404',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  hintText: {
    marginTop: 30,
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default DailyCalendar;