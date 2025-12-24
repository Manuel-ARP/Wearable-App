import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Pressable, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const palette = {
  teal: '#36b6ac',
  darkText: '#333333',
  muted: '#8c8f94',
  bg: '#ffffff',
  card: '#ffffff',
  border: '#e5e7eb',
  blue: '#70c3e8',
};

const dayLabels = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
const daySpo2 = dayLabels.map((_, i) => {
  if (i >= 12 && i <= 14) return 95;
  if (i === 15) return 96;
  return 98;
});

const dataSets = {
  dia: {
    label: 'Oxigeno (SpO2)',
    values: daySpo2,
    labels: dayLabels,
    spo2: '95%',
    bpm: '76 BPM',
    date: 'Viernes, 17 oct.',
  },
  semana: {
    label: 'Oxigeno (SpO2)',
    values: [98, 98, 97, 97, 96, 98, 97],
    labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
    spo2: '97%',
    bpm: '75 BPM',
    date: 'Semana actual',
  },
  mes: {
    label: 'Oxigeno (SpO2)',
    values: [98, 97, 96, 97, 98, 97, 96, 98, 97, 98],
    labels: ['1', '4', '7', '10', '13', '16', '19', '22', '25', '28'],
    spo2: '97%',
    bpm: '74 BPM',
    date: 'Octubre',
  },
} as const;

type RangeKey = keyof typeof dataSets;

export default function OxigenoScreen() {
  const [range, setRange] = useState<RangeKey>('dia');
  const { width } = useWindowDimensions();

  const current = dataSets[range];

  const chartData = useMemo(
    () => ({
      labels: [...current.labels],
      datasets: [
        {
          data: [...current.values],
          color: () => palette.blue,
          strokeWidth: 3,
        },
      ],
      legend: [current.label],
    }),
    [current],
  );

  const chartWidth = Math.max(width - 40, current.labels.length * 70);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Pressable hitSlop={10} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color={palette.darkText} />
          </Pressable>
          <Text style={styles.header}>Oxigeno en sangre</Text>
          <View style={{ width: 22 }} />
        </View>

        <View style={styles.centerBlock}>
          <View style={styles.tabRow}>
            {(['dia', 'semana', 'mes'] as RangeKey[]).map((key) => (
              <Pressable key={key} onPress={() => setRange(key)}>
                <Text style={[styles.tabText, range === key && styles.tabTextActive]}>
                  {key === 'dia' ? 'Dia' : key === 'semana' ? 'Semana' : 'Mes'}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.dateRow}>
            <Text style={styles.dateText}>{current.date}</Text>
            <Ionicons name="chevron-down" size={16} color={palette.darkText} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tendencia de datos - Oxigeno en sangre</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <LineChart
              data={chartData}
              width={chartWidth}
              height={220}
              withDots
              withShadow={false}
              withInnerLines
              withOuterLines={false}
              fromZero
              yAxisSuffix="%"
              chartConfig={{
                backgroundColor: palette.card,
                backgroundGradientFrom: palette.card,
                backgroundGradientTo: palette.card,
                decimalPlaces: 0,
                color: () => '#9da0a3',
                labelColor: () => '#9da0a3',
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: palette.card,
                },
                propsForBackgroundLines: {
                  stroke: '#e8eaed',
                },
              }}
              style={styles.chart}
              bezier
            />
          </ScrollView>
        </View>

        <View style={styles.cardsRow}>
          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons name="heart-outline" size={18} color={palette.teal} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>SpO2</Text>
              <Text style={styles.infoValue}>{current.spo2}</Text>
            </View>
          </View>
          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons name="pulse-outline" size={18} color={palette.teal} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Frecuencia cardiaca</Text>
              <Text style={styles.infoValue}>{current.bpm}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 32,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  centerBlock: {
    alignItems: 'center',
    gap: 6,
  },
  header: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.darkText,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 4,
  },
  tabText: {
    fontSize: 14,
    color: palette.muted,
    fontWeight: '700',
  },
  tabTextActive: {
    color: palette.teal,
    borderBottomWidth: 2,
    borderBottomColor: palette.teal,
    paddingBottom: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.darkText,
  },
  card: {
    marginTop: 4,
    backgroundColor: palette.card,
    borderRadius: 14,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.darkText,
    marginBottom: 8,
  },
  chart: {
    borderRadius: 12,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  infoCard: {
    flex: 1,
    backgroundColor: palette.card,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#e8f6f3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: palette.muted,
    fontWeight: '700',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '800',
    color: palette.darkText,
  },
});
