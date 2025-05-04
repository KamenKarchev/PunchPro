import AsyncStorage from '@react-native-async-storage/async-storage';

class DataService {
  // User Management
  static async createUser(username, password) {
    try {
      const users = await this.getUsers();
      if (users.some(user => user.username === username)) {
        throw new Error('User already exists');
      }
      
      const newUser = {
        id: Date.now().toString(),
        username,
        password,
        hasChangedPassword: false,
        hourlyRate: 15, // Default hourly rate
        timeRecords: [],
        clockIns: [],
        clockOuts: [],
      };
      
      users.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(users));
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async getUsers() {
    try {
      const users = await AsyncStorage.getItem('users');
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  static async getCurrentUser() {
    try {
      const currentUser = await AsyncStorage.getItem('currentUser');
      return currentUser ? JSON.parse(currentUser) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  static async setCurrentUser(user) {
    try {
      await AsyncStorage.setItem('currentUser', JSON.stringify(user));
    } catch (error) {
      console.error('Error setting current user:', error);
      throw error;
    }
  }

  static async updateUserPassword(userId, newPassword) {
    try {
      const users = await this.getUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) return null;
      
      users[userIndex].password = newPassword;
      users[userIndex].hasChangedPassword = true;
      
      await AsyncStorage.setItem('users', JSON.stringify(users));
      await this.setCurrentUser(users[userIndex]);
      
      return users[userIndex];
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }

  static async logout() {
    try {
      await AsyncStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  // Time Records Management
  static async clockIn(userId) {
    try {
      const now = new Date();
      const users = await this.getUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) throw new Error('User not found');
      
      // Check if user is already clocked in
      const lastRecord = users[userIndex].timeRecords[users[userIndex].timeRecords.length - 1];
      if (lastRecord && !lastRecord.clockOut) {
        throw new Error('User is already clocked in');
      }

      const newRecord = {
        id: Date.now().toString(),
        date: now.toISOString().split('T')[0],
        clockIn: now.toISOString(),
        clockOut: null
      };

      users[userIndex].timeRecords.push(newRecord);
      await AsyncStorage.setItem('users', JSON.stringify(users));
      return newRecord;
    } catch (error) {
      console.error('Error clocking in:', error);
      throw error;
    }
  }

  static async clockOut(userId) {
    try {
      const now = new Date();
      const users = await this.getUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) throw new Error('User not found');
      
      const lastRecord = users[userIndex].timeRecords[users[userIndex].timeRecords.length - 1];
      if (!lastRecord || lastRecord.clockOut) {
        throw new Error('No active clock in record found');
      }

      lastRecord.clockOut = now.toISOString();
      await AsyncStorage.setItem('users', JSON.stringify(users));
      return lastRecord;
    } catch (error) {
      console.error('Error clocking out:', error);
      throw error;
    }
  }

  static async getTimeRecords(userId) {
    try {
      const users = await this.getUsers();
      const user = users.find(u => u.id === userId);
      if (!user) throw new Error('User not found');
      return user.timeRecords;
    } catch (error) {
      console.error('Error getting time records:', error);
      throw error;
    }
  }

  static async getCurrentClockState(userId) {
    try {
      const records = await this.getTimeRecords(userId);
      const lastRecord = records[records.length - 1];
      return {
        isClockedIn: lastRecord && !lastRecord.clockOut,
        lastClockIn: lastRecord?.clockIn
      };
    } catch (error) {
      console.error('Error getting clock state:', error);
      throw error;
    }
  }

  // Analytics
  static async getWeeklySummary(userId) {
    try {
      const records = await this.getTimeRecords(userId);
      const user = (await this.getUsers()).find(u => u.id === userId);
      
      const weeklyRecords = records.filter(record => {
        const recordDate = new Date(record.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return recordDate >= weekAgo;
      });

      const totalHours = weeklyRecords.reduce((total, record) => {
        if (record.clockIn && record.clockOut) {
          const hours = (new Date(record.clockOut) - new Date(record.clockIn)) / (1000 * 60 * 60);
          return total + hours;
        }
        return total;
      }, 0);

      return {
        totalHours,
        estimatedPay: totalHours * user.hourlyRate,
        records: weeklyRecords
      };
    } catch (error) {
      console.error('Error getting weekly summary:', error);
      throw error;
    }
  }
}

export default DataService; 