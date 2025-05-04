import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Dialog, Portal, Button } from 'react-native-paper';
import SvgText from './SvgText';

const SwitchAccountDialog = ({ visible, onDismiss, onConfirm }) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title style={styles.title}>
          <SvgText 
            text="Switch Account"
            fontSize={24}
            strokeWidth={2}
            strokeColor="#000000"
            outerStrokeWidth={1.5}
            outerStrokeColor="#ffffff"
            fillColor="#b50448"
          />
        </Dialog.Title>
        <Dialog.Content>
          <SvgText 
            text="Are you sure you want to switch accounts?"
            fontSize={18}
            strokeWidth={1.5}
            strokeColor="#000000"
            outerStrokeWidth={1}
            outerStrokeColor="#ffffff"
            fillColor="#b50448"
            style={styles.message}
          />
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
              strokeWidth={1.5}
              strokeColor="#000000"
              outerStrokeWidth={1}
              outerStrokeColor="#ffffff"
              fillColor="#b50448"
            />
          </Button>
          <Button 
            mode="contained" 
            onPress={onConfirm}
            style={[styles.button, styles.confirmButton]}
            theme={{
              colors: {
                primary: '#b50448',
              },
            }}
          >
            <SvgText 
              text="Switch"
              fontSize={20}
              strokeWidth={1.5}
              strokeColor="#000000"
              outerStrokeWidth={1}
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
  message: {
    textAlign: 'center',
    marginTop: 10,
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

export default SwitchAccountDialog; 