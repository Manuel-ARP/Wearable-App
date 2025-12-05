import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { setRegistroData } from './registroStore';

const palette = {
  teal: '#36b6ac',
  darkText: '#333333',
  muted: '#8c8f94',
  bg: '#ffffff',
  field: '#f1f2f4',
};

export default function RegistroPaso3Screen() {
  const [selected, setSelected] = useState<'f' | 'm'>('f');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="chevron-back" size={22} color={palette.darkText} />
        </Pressable>

        <Text style={styles.title}>Crea tu cuenta</Text>
        <Text style={styles.subtitle}>Paso 3: Genero</Text>

        <Pressable
          style={[styles.option, selected === 'f' ? styles.optionSelected : styles.optionIdle]}
          onPress={() => setSelected('f')}
        >
          <Text style={[styles.optionText, selected === 'f' ? styles.optionTextSelected : styles.optionTextIdle]}>
            Femenino
          </Text>
        </Pressable>

        <Pressable
          style={[styles.option, selected === 'm' ? styles.optionSelected : styles.optionIdle]}
          onPress={() => setSelected('m')}
        >
          <Text style={[styles.optionText, selected === 'm' ? styles.optionTextSelected : styles.optionTextIdle]}>
            Masculino
          </Text>
        </Pressable>

        <Pressable
          style={styles.primaryButton}
          onPress={() => {
            setRegistroData({ genero: selected });
            router.push('/registro_paso4');
          }}
        >
          <Text style={styles.primaryText}>Siguiente</Text>
        </Pressable>
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: palette.darkText,
  },
  subtitle: {
    fontSize: 13,
    color: palette.darkText,
    fontWeight: '700',
  },
  option: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionSelected: {
    backgroundColor: palette.teal,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  optionIdle: {
    backgroundColor: palette.field,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '700',
  },
  optionTextSelected: {
    color: '#fff',
  },
  optionTextIdle: {
    color: palette.darkText,
  },
  primaryButton: {
    marginTop: 32,
    backgroundColor: palette.teal,
    borderRadius: 22,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
