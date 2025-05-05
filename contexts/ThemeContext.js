import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const themes = {
  dark: {
    primary: '#b50448',
    secondary: '#210554',
    background: '#22272e',
    text: '#ffffff',
    border: '#b50448',
  },
  light: {
    primary: '#b50448',
    secondary: '#ffffff',
    background: '#f5f5f5',
    text: '#210554',
    border: '#b50448',
  }
};

export const ThemeProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const theme = isDarkTheme ? themes.dark : themes.light;

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 