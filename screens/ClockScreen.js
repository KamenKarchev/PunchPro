import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { FAB, Snackbar, Button, Portal, Dialog, Menu } from 'react-native-paper';
import Svg, { Circle } from 'react-native-svg';
import DataService from '../services/DataService';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import SquarePattern from '../components/SquarePattern';
import SvgText from '../components/SvgText';
import ChangePasswordDialog from '../components/ChangePasswordDialog';
import SwitchAccountDialog from '../components/SwitchAccountDialog';

const ClockScreen = ({ navigation }) => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [lastClockIn, setLastClockIn] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSwitchDialog, setShowSwitchDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const { currentUser, setCurrentUser } = useUser();
  const { theme, isDarkTheme, toggleTheme } = useTheme();

  useEffect(() => {
    if (currentUser) {
      loadClockState();
    }
    // Check if user needs to change password
    if (currentUser && !currentUser.hasChangedPassword) {
      setShowPasswordDialog(true);
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

  const confirmSwitchAccount = async () => {
    try {
      await DataService.logout();
      setShowSwitchDialog(false);
      setCurrentUser(null);
      navigation.replace('Login');
    } catch (error) {
      console.error('Error switching accounts:', error);
      setError('Failed to switch accounts');
    }
  };

  const handlePasswordChange = async (newPassword) => {
    try {
      const updatedUser = await DataService.updateUserPassword(currentUser.id, newPassword);
      setCurrentUser(updatedUser);
      setShowPasswordDialog(false);
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  const handleMenuOpen = () => {
    setMenuVisible(true);
  };

  const handleMenuClose = () => {
    setMenuVisible(false);
  };

  const handleChangePassword = () => {
    setMenuVisible(false);
    setShowPasswordDialog(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SquarePattern />
      <View style={styles.header}>
        <Menu
          visible={menuVisible}
          onDismiss={handleMenuClose}
          anchor={
            <TouchableOpacity 
              style={[styles.userButton, { 
                backgroundColor: theme.secondary,
                borderColor: theme.border 
              }]}
              onPress={handleMenuOpen}
              activeOpacity={0.7}
            >
              <Text style={[styles.userIcon, { color: theme.text }]}>👤</Text>
              <Text style={[styles.username, { color: theme.text }]} numberOfLines={1}>
                {currentUser?.username}
              </Text>
            </TouchableOpacity>
          }
          contentStyle={[styles.menuContent, { 
            backgroundColor: theme.secondary,
            borderColor: theme.border 
          }]}
        >
          <Menu.Item 
            onPress={handleChangePassword} 
            title="Change Password"
            titleStyle={[styles.menuItemText, { color: theme.text }]}
            style={[styles.menuItem, { backgroundColor: theme.secondary }]}
          />
          <Menu.Item 
            onPress={handleSwitchAccount} 
            title="Switch Account"
            titleStyle={[styles.menuItemText, { color: theme.text }]}
            style={[styles.menuItem, { backgroundColor: theme.secondary }]}
          />
        </Menu>
        <TouchableOpacity 
          style={[styles.themeButton, { 
            backgroundColor: theme.secondary,
            borderColor: theme.border 
          }]}
          onPress={toggleTheme}
        >
          <Text style={[styles.themeIcon, { color: theme.text }]}>
            {isDarkTheme ? '☀️' : '🌙'}
          </Text>
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
                fill={isClockedIn ? theme.primary : theme.secondary}
                stroke={theme.border}
                strokeWidth="4"
              />
            </Svg>
            <View style={styles.clockTextContainer}>
              <SvgText
                text={isClockedIn ? 'CLOCK OUT' : 'CLOCK IN'}
                fontSize={28}
                strokeWidth={2}
                strokeColor="#000000"
                fillColor={theme.text}
                style={styles.clockText}
              />
            </View>
          </View>
        </TouchableOpacity>
        {lastClockIn && (
          <View style={[styles.lastClockContainer, { 
            backgroundColor: theme.secondary,
            borderColor: theme.border 
          }]}>
            <Text style={[styles.lastClockTime, { color: theme.text }]}>
              Last clock in: {formatTime(lastClockIn)}
            </Text>
          </View>
        )}
      </View>

      <FAB
        style={[styles.analyticsFab, { 
          backgroundColor: theme.secondary,
          borderColor: theme.border 
        }]}
        label="📊Analytics"
        onPress={() => navigation.navigate('Analytics')}
        color={theme.text}
      />

      <ChangePasswordDialog
        visible={showPasswordDialog}
        onDismiss={() => setShowPasswordDialog(false)}
        onConfirm={handlePasswordChange}
      />

      <SwitchAccountDialog
        visible={showSwitchDialog}
        onDismiss={() => setShowSwitchDialog(false)}
        onConfirm={confirmSwitchAccount}
      />

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
    paddingTop: 40,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
  },
  userButton: {
    flexDirection: 'row',
    alignItems: 'center',
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
    minWidth: 120,
    maxWidth: '90%',
    borderWidth: 2,
  },
  themeButton: {
    position: 'absolute',
    right: 20,
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  themeIcon: {
    fontSize: 20,
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
    textAlign: 'center',
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
  menuContent: {
    backgroundColor: '#210554',
    borderWidth: 2,
    borderColor: '#b50448',
  },
  menuItem: {
    backgroundColor: '#210554',
  },
  menuItemText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default ClockScreen; 