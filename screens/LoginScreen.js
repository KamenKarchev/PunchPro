import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import DataService from '../services/DataService';
import { useUser } from '../contexts/UserContext';
import SvgText from '../components/SvgText';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useUser();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!username.trim()) {
        setError('Please enter a username');
        return;
      }

      // Check if user exists, if not create new user
      const users = await DataService.getUsers();
      let user = users.find(u => u.username === username);
      
      if (!user) {
        // Create new user if doesn't exist
        user = await DataService.createUser(username);
      }
      
      // Set current user in context
      setCurrentUser(user);
      
      // Navigate to Clock screen
      navigation.replace('Clock');
    } catch (error) {
      console.error(error);
      setError('Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <SvgText 
          text="Punch I/O"
          x={100}
          fontSize={80}
          strokeWidth={0}
          strokeColor="#000000"
          outerStrokeWidth={20}
          fillColor="#b50448"
          style={styles.title}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          mode="outlined"
          autoCapitalize="none"
          outlineColor="#b50448"
          activeOutlineColor="#b50448"
          theme={{
            colors: {
              primary: '#b50448',
              background: '#210554',
              text: '#ffffff',
              placeholder: '#ffffff',
            },
          }}
        />
        <Button 
          mode="contained" 
          onPress={handleLogin} 
          style={styles.button}
          loading={loading}
          disabled={loading}
          theme={{
            colors: {
              primary: '#b50448',
            },
          }}
        >
          <View>
            <SvgText 
              text="Login"
              fontSize={33}
              strokeWidth={4}
              strokeColor="#000000"
              innerStrokeWidth={2}
              innerStrokeColor="#ffffff"
              fillColor="#210554"
              style={styles.buttonText}
            />
          </View>
        </Button>
      </View>
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
    padding: 20,
    justifyContent: 'flex-start',
    backgroundColor: '#22272e',
    paddingTop: 100,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    textAlign: 'center',
  },
  inputContainer: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#210554',
    borderColor: '#b50448',
    borderWidth: 2,
  },
  button: {
    marginTop: 20,
    padding: 0,
    borderWidth: 10,
    borderColor: '#b50448',
  },
  buttonTextContainer: {
    position: 'relative',
  },
});

export default LoginScreen; 