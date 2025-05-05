import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Dialog, Portal, TextInput, Button } from 'react-native-paper';
import SvgText from './SvgText';

const ChangePasswordDialog = ({ visible, onDismiss, onConfirm }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError('Please enter both passwords');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    onConfirm(newPassword);
    setNewPassword('');
    setConfirmPassword('');
    setError('');
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title style={styles.title}>
          <SvgText 
            text="Change Password"
            fontSize={24}
            strokeWidth={2}
            strokeColor="#000000"
            outerStrokeWidth={1.5}
            outerStrokeColor="#ffffff"
            fillColor="#b50448"
          />
        </Dialog.Title>
        <Dialog.Content>
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            style={styles.input}
            mode="outlined"
            secureTextEntry={!showPassword}
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
            contentStyle={styles.inputContent}
            placeholderTextColor="#ffffff"
            placeholder="New Password"
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
                color="#ffffff"
              />
            }
          />
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={[styles.input, styles.confirmInput]}
            mode="outlined"
            secureTextEntry={!showPassword}
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
            contentStyle={styles.inputContent}
            placeholderTextColor="#ffffff"
            placeholder="Confirm Password"
          />
          {error ? (
            <SvgText 
              text={error}
              fontSize={16}
              strokeWidth={0}
              strokeColor="#000000"
              outerStrokeWidth={0}
              outerStrokeColor="#ffffff"
              fillColor="#b50448"
              style={styles.errorText}
            />
          ) : null}
        </Dialog.Content>
        <Dialog.Actions style={styles.actions}>
          <Button 
            mode="contained" 
            onPress={onDismiss}
            style={[styles.button, styles.cancelButton]}
            theme={{
              colors: {
                primary: '#210554',
              },
            }}
          >
            <SvgText 
              text="Cancel"
              fontSize={20}
              strokeWidth={0}
              strokeColor="#000000"
              outerStrokeWidth={0}
              outerStrokeColor="#ffffff"
              fillColor="#b50448"
            />
          </Button>
          <Button 
            mode="contained" 
            onPress={handleConfirm}
            style={[styles.button, styles.confirmButton]}
            theme={{
              colors: {
                primary: '#b50448',
              },
            }}
          >
            <SvgText 
              text="Confirm"
              fontSize={20}
              strokeWidth={0}
              strokeColor="#000000"
              outerStrokeWidth={0}
              outerStrokeColor="#ffffff"
              fillColor="#210554"
            />
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: '#22272e',
    borderWidth: 2,
    borderColor: '#b50448',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#210554',
    borderColor: '#b50448',
    borderWidth: 2,
    fontSize: 16,
    color: '#ffffff',
  },
  confirmInput: {
    marginTop: 15,
  },
  inputContent: {
    color: '#ffffff',
    fontSize: 16,
  },
  errorText: {
    marginTop: 10,
    textAlign: 'center',
  },
  actions: {
    justifyContent: 'space-between',
    padding: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    borderWidth: 2,
    borderColor: '#b50448',
  },
  cancelButton: {
    marginRight: 5,
  },
  confirmButton: {
    marginLeft: 5,
  },
});

export default ChangePasswordDialog; 