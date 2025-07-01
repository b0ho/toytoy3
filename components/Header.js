import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const Header = ({ view, onViewToggle }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>📅 찢어 쓰는 일력</Text>
      
      <TouchableOpacity 
        style={styles.toggleButton}
        onPress={onViewToggle}
        activeOpacity={0.8}
      >
        <Text style={styles.toggleText}>
          {view === 'daily' ? '📅 전체 달력' : '📄 오늘 일력'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: width > 375 ? 24 : 20,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  toggleButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  toggleText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Header;