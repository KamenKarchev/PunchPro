import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { FAB, Snackbar, Button, Portal, Dialog } from 'react-native-paper';
import Svg, { Circle } from 'react-native-svg';
import DataService from '../services/DataService';
import { useUser } from '../contexts/UserContext';
import SquarePattern from '../components/SquarePattern';
import SvgText from '../components/SvgText';

const ClockScreen = ({ navigation }) => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [lastClockIn, setLastClockIn] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSwitchDialog, setShowSwitchDialog] = useState(false);
  const { currentUser, setCurrentUser } = useUser();

  useEffect(() => {
    if (currentUser) {
      loadClockState();
    }
  }, [currentUser]);

  const loadClockState = async () => {
    try {
      const state = await DataService.getCurrentClockState(currentUser.id);
      setIsClockedIn(state.isClockedIn);
      setLastClockIn(state.lastClockIn);
    } catch (error) {
      console.error(error);
      setError('Failed to load clock state');
    }
  };

  const handleClockAction = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!currentUser) {
        setError('No user logged in');
        return;
      }
      
      if (!isClockedIn) {
        await DataService.clockIn(currentUser.id);
        setIsClockedIn(true);
        setLastClockIn(new Date().toISOString());
      } else {
        await DataService.clockOut(currentUser.id);
        setIsClockedIn(false);
        setLastClockIn(null);
      }
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString();
  };

  const handleSwitchAccount = () => {
    setShowSwitchDialog(true);
  };

  const confirmSwitchAccount = () => {
    setShowSwitchDialog(false);
    setCurrentUser(null);
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <SquarePattern />
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.userButton}
          onPress={handleSwitchAccount}
          activeOpacity={0.7}
        >
          <Text style={styles.userIcon}>👤</Text>
          <Text style={styles.username} numberOfLines={1}>{currentUser?.username}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.clockContainer}>
        <TouchableOpacity onPress={handleClockAction} disabled={loading}>
          <View style={styles.clockButtonContainer}>
            <Svg height="200" width="200">
              <Circle
                cx="100"
                cy="100"
                r="90"
                fill={isClockedIn ? '#b50448' : '#210554'}
                stroke="#b50448"
                strokeWidth="4"
              />
            </Svg>
            <View style={styles.clockTextContainer}>
              <SvgText
                text={isClockedIn ? 'CLOCK OUT' : 'CLOCK IN'}
                fontSize={28}
                strokeWidth={2}
                strokeColor="#000000"
                fillColor="#ffffff"
                style={styles.clockText}
              />
            </View>
          </View>
        </TouchableOpacity>
        {lastClockIn && (
          <View style={styles.lastClockContainer}>
            <Text style={styles.lastClockTime}>
              Last clock in: {formatTime(lastClockIn)}
            </Text>
          </View>
        )}
      </View>

      <FAB
        style={styles.analyticsFab}
        label="📊Analytics"
        onPress={() => navigation.navigate('Analytics')}
        color="#ffffff"
      />

      <Portal>
        <Dialog visible={showSwitchDialog} onDismiss={() => setShowSwitchDialog(false)}>
          <Dialog.Title>Switch Account</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to switch accounts?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowSwitchDialog(false)}>Cancel</Button>
            <Button onPress={confirmSwitchAccount}>Switch</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar
        visible={!!error}
        onDismiss={() => setError('')}
        duration={3000}
      >
        {error}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#22272e',
    paddingTop: 40,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  userButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#210554',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    maxWidth: '80%',
    borderWidth: 2,
    borderColor: '#b50448',
  },
  userIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#ffffff',
  },
  username: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  clockContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockButtonContainer: {
    position: 'relative',
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockText: {
    textAlign: 'center',
  },
  lastClockContainer: {
    backgroundColor: '#210554',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#b50448',
  },
  lastClockTime: {
    fontSize: 16,
    color: '#ffffff',
    textShadowColor: '#000000',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  analyticsFab: {
    position: 'absolute',
    margin: 0,
    right: 20,
    bottom: 20,
    backgroundColor: '#210554',
    borderWidth: 2,
    borderColor: '#b50448',
  },
});

export default ClockScreen; 