import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

const palette = {
  teal: '#36b6ac',
  darkText: '#4d4d4d',
  muted: '#8c8f94',
  lightBg: '#f5f6f8',
  card: '#ffffff',
  border: '#e5e7eb',
};

// Rutas de imagenes locales (guarda los assets en assets/devices con estos nombres).
const heroImage = require('@/assets/devices/hero-brazalete.png');
const steps = [
  {
    id: '1',
    title: 'Enciende tu brazalete',
    image: require('@/assets/devices/step-encender-brazalete.png'),
  },
  {
    id: '2',
    title: 'Habilita Bluetooth en tu telefono',
    image: require('@/assets/devices/step-encender-bluetooth.png'),
  },
  {
    id: '3',
    title: 'Selecciona el brazalete',
    image: require('@/assets/devices/step-seleccionar-dispositivo.png'),
  },
];

export default function DevicesScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Dispositivos</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Empareja tu brazalete</Text>

          <Image source={heroImage} style={styles.hero} contentFit="contain" />

          <View style={styles.steps}>
            {steps.map((step, index) => (
              <View key={step.id} style={styles.stepWrapper}>
                <View style={styles.stepRow}>
                  <Image source={step.image} style={styles.stepImage} contentFit="contain" />
                  <Text style={styles.stepText}>{step.title}</Text>
                </View>
                {index < steps.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>

          <Pressable style={styles.connectButton}>
            <Text style={styles.connectText}>Conectar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.lightBg,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: palette.darkText,
  },
  card: {
    backgroundColor: palette.card,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: palette.darkText,
  },
  hero: {
    width: '100%',
    height: 180,
    alignSelf: 'center',
    borderRadius: 12,
  },
  steps: {
    gap: 12,
  },
  stepWrapper: {
    gap: 8,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 4,
  },
  stepImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  stepText: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.darkText,
    flex: 1,
    flexWrap: 'wrap',
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: palette.border,
    marginTop: 6,
  },
  connectButton: {
    marginTop: 4,
    backgroundColor: palette.teal,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  connectText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
