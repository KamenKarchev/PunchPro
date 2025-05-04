import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, useWindowDimensions } from 'react-native';
import { Text, Card, Title, Paragraph, Snackbar, FAB, ActivityIndicator, Divider } from 'react-native-paper';
import DataService from '../services/DataService';
import { useUser } from '../contexts/UserContext';
import SquarePattern from '../components/SquarePattern';
import SvgText from '../components/SvgText';

const AnalyticsScreen = ({ navigation }) => {
  const [weeklySummary, setWeeklySummary] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { currentUser } = useUser();
  const { width } = useWindowDimensions();
  const isWideScreen = width > 768; // Desktop breakpoint

  // Calculate the grid width based on screen size
  const gridWidth = isWideScreen ? '60%' : '80%';
  const shiftsWidth = isWideScreen ? '60%' : '80%';

  useEffect(() => {
    if (currentUser) {
      loadAnalytics();
    }
  }, [currentUser]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!currentUser) {
        setError('No user logged in');
        return;
      }

      const summary = await DataService.getWeeklySummary(currentUser.id);
      setWeeklySummary(summary);
    } catch (error) {
      console.error(error);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAnalytics();
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const calculateDailyHours = (record) => {
    if (!record.clockIn || !record.clockOut) return 0;
    return ((new Date(record.clockOut) - new Date(record.clockIn)) / (1000 * 60 * 60)).toFixed(2);
  };

  const calculateEarnings = (hours) => {
    return (parseFloat(hours) * currentUser?.hourlyRate).toFixed(2);
  };

  const calculateAverages = (summary) => {
    if (!summary || !summary.records || summary.records.length === 0) {
      return { avgWeeklyHours: 0, avgDailyPay: 0 };
    }

    // Get unique weeks from the records
    const weeks = new Set(summary.records.map(record => {
      const date = new Date(record.date);
      return `${date.getFullYear()}-${date.getWeek()}`;
    }));

    const avgWeeklyHours = (summary.totalHours / weeks.size).toFixed(1);

    // Calculate average daily pay
    const totalDays = summary.records.length;
    const avgDailyPay = (summary.estimatedPay / totalDays).toFixed(2);

    return { avgWeeklyHours, avgDailyPay };
  };

  const renderBackgroundPattern = () => {
    const patternSize = 50;
    const rows = Math.ceil(width / patternSize);
    const cols = Math.ceil(width / patternSize);
    
    return (
      <View style={StyleSheet.absoluteFill}>
        <Svg height="100%" width="100%">
          {Array.from({ length: rows * cols }).map((_, index) => {
            const row = Math.floor(index / rows);
            const col = index % rows;
            return (
              <Rect
                key={index}
                x={col * patternSize}
                y={row * patternSize}
                width={patternSize}
                height={patternSize}
                fill="#22272e"
                stroke="#b50448"
                strokeWidth="1"
                opacity="0.1"
              />
            );
          })}
        </Svg>
      </View>
    );
  };

  const renderOutlinedText = (text, style) => {
    return (
      <View style={styles.outlinedTextContainer}>
        <Text style={[style, styles.outlinedText, styles.outlinedTextTopLeft]}>{text}</Text>
        <Text style={[style, styles.outlinedText, styles.outlinedTextTopRight]}>{text}</Text>
        <Text style={[style, styles.outlinedText, styles.outlinedTextBottomLeft]}>{text}</Text>
        <Text style={[style, styles.outlinedText, styles.outlinedTextBottomRight]}>{text}</Text>
        <Text style={[style, styles.outlinedTextMain]}>{text}</Text>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#b50448" />
      </View>
    );
  }

  const { avgWeeklyHours, avgDailyPay } = calculateAverages(weeklySummary);

  return (
    <View style={styles.container}>
      <SquarePattern />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Card style={[styles.summaryCard, { width: gridWidth, alignSelf: 'center' }]}>
          <Card.Content>
            <View style={styles.titleContainer}>
              <SvgText
                text="Weekly Summary"
                fontSize={45}
                strokeWidth={8}
                strokeColor="#ffffff"
                outerStrokeWidth={5}
                outerStrokeColor="#000000"
                fillColor="#b50448"
                fontFamily="Roboto"
                letterSpacing={4}
                style={[styles.cardTitle, { alignSelf: 'center' }]}
              />
            </View>
            <Divider style={styles.divider} />
            <View style={styles.summaryGrid}>
              <View style={[styles.summaryQuarter, styles.summaryQuarterBorderRight, styles.summaryQuarterBorderBottom]}>
                <Text style={styles.summaryLabel}>Total Hours</Text>
                <Text style={styles.summaryValue}>{weeklySummary?.totalHours.toFixed(2)}</Text>
              </View>
              <View style={[styles.summaryQuarter, styles.summaryQuarterBorderBottom]}>
                <Text style={styles.summaryLabel}>Hourly Rate</Text>
                <Text style={styles.summaryValue}>${currentUser?.hourlyRate.toFixed(2)}</Text>
              </View>
              <View style={[styles.summaryQuarter, styles.summaryQuarterBorderRight, styles.summaryQuarterBorderBottom]}>
                <Text style={styles.summaryLabel}>Estimated Pay</Text>
                <Text style={styles.summaryValue}>${weeklySummary?.estimatedPay.toFixed(2)}</Text>
              </View>
              <View style={[styles.summaryQuarter, styles.summaryQuarterBorderBottom]}>
                <Text style={styles.summaryLabel}>Shifts</Text>
                <Text style={styles.summaryValue}>{weeklySummary?.records.length}</Text>
              </View>
              <View style={[styles.summaryQuarter, styles.summaryQuarterBorderRight]}>
                <Text style={styles.summaryLabel}>Avg Weekly Hours</Text>
                <Text style={styles.summaryValue}>{avgWeeklyHours}</Text>
              </View>
              <View style={styles.summaryQuarter}>
                <Text style={styles.summaryLabel}>Avg Daily Pay</Text>
                <Text style={styles.summaryValue}>${avgDailyPay}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <View style={[styles.shiftsContainer, { width: shiftsWidth }]}>
          <View style={styles.titleContainer}>
            <SvgText
              text="Recent Shifts"
              fontSize={45}
              strokeWidth={8}
              strokeColor="#ffffff"
              outerStrokeWidth={5}
              outerStrokeColor="#000000"
              fillColor="#b50448"
              fontFamily="Roboto"
              letterSpacing={8}
              style={[styles.sectionTitle, { alignSelf: 'center' }]}
            />
          </View>
          {weeklySummary?.records.map((record, index) => {
            const hours = calculateDailyHours(record);
            const earnings = calculateEarnings(hours);
            return (
              <Card key={index} style={styles.recordCard}>
                <Card.Content>
                  <View style={styles.recordHeader}>
                    <Text style={styles.recordDate}>{formatDate(record.date)}</Text>
                    <View style={styles.recordStats}>
                      <Text style={styles.recordHours}>{hours} hrs</Text>
                      <Text style={styles.recordEarnings}>${earnings}</Text>
                    </View>
                  </View>
                  <Divider style={styles.divider} />
                  <View style={styles.recordDetails}>
                    <View style={styles.timeBlock}>
                      <Text style={styles.timeLabel}>Clock In</Text>
                      <Text style={styles.timeValue}>{formatTime(record.clockIn)}</Text>
                    </View>
                    <View style={styles.timeBlock}>
                      <Text style={styles.timeLabel}>Clock Out</Text>
                      <Text style={styles.timeValue}>{formatTime(record.clockOut) || 'N/A'}</Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            );
          })}
        </View>

        <Snackbar
          visible={!!error}
          onDismiss={() => setError('')}
          duration={3000}
        >
          {error}
        </Snackbar>
      </ScrollView>
      
      <FAB
        style={styles.backFab}
        label="Back"
        onPress={() => navigation.navigate('Clock')}
        color="#ffffff"
      />
    </View>
  );
};

// Add helper method to get week number
Date.prototype.getWeek = function() {
  const d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#22272e',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#22272e',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
    paddingTop: 40,
  },
  summaryCard: {
    marginBottom: 16,
    elevation: 4,
    backgroundColor: '#210554',
    borderWidth: 2,
    borderColor: '#b50448',
  },
  recordCard: {
    marginBottom: 8,
    elevation: 2,
    backgroundColor: '#210554',
    borderWidth: 2,
    borderColor: '#b50448',
  },
  titleContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  outlinedTextContainer: {
    position: 'relative',
  },
  outlinedText: {
    position: 'absolute',
    color: '#000000',
  },
  outlinedTextMain: {
    color: '#ffffff',
    position: 'relative',
  },
  outlinedTextTopLeft: {
    top: -3,
    left: -3,
  },
  outlinedTextTopRight: {
    top: -3,
    left: 3,
  },
  outlinedTextBottomLeft: {
    top: 3,
    left: -3,
  },
  outlinedTextBottomRight: {
    top: 3,
    left: 3,
  },
  cardTitle: {
    marginBottom: 8,
  },
  sectionTitle: {
    marginVertical: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  summaryQuarter: {
    width: '50%',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryQuarterBorderRight: {
    borderRightWidth: 2,
    borderRightColor: '#b50448',
  },
  summaryQuarterBorderBottom: {
    borderBottomWidth: 2,
    borderBottomColor: '#b50448',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#b50448',
    textShadowColor: '#000000',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  divider: {
    marginVertical: 8,
    backgroundColor: '#ffffff',
    opacity: 0.2,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  recordStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  recordHours: {
    fontSize: 16,
    color: '#b50448',
    fontWeight: 'bold',
    textShadowColor: '#000000',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  recordEarnings: {
    fontSize: 16,
    color: '#b50448',
    fontWeight: 'bold',
    textShadowColor: '#000000',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  recordDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeBlock: {
    flex: 1,
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.8,
  },
  timeValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: '#000000',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  backFab: {
    position: 'absolute',
    margin: 0,
    right: 20,
    bottom: 20,
    backgroundColor: '#210554',
    borderWidth: 2,
    borderColor: '#b50448',
  },
  shiftsContainer: {
    alignSelf: 'center',
  },
});

export default AnalyticsScreen; 