import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { router } from 'expo-router';

const palette = {
  mint: '#6bd1c6',
  teal: '#36b6ac',
  orange: '#f58d4c',
  blue: '#70c3e8',
  darkText: '#5b5b5b',
  lightBg: '#f5f6f8',
  card: '#ffffff',
};

const chartHeight = 200;
const timeLabels = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
const tempSeries = Array.from({ length: 24 }, (_, i) => 36.5 + Math.sin(i / 3) * 1.1);
const pulseSeries = Array.from({ length: 24 }, (_, i) => 70 + Math.sin(i / 2) * 6 + (i % 6 === 0 ? 4 : 0));
const pressureSeries = Array.from({ length: 24 }, (_, i) => 115 + Math.sin(i / 4) * 8 + (i % 8 === 0 ? 5 : 0));

const metrics = [
  {
    title: 'Temperatura',
    value: '36.8 C',
    color: palette.teal,
    icon: 'sunny',
  },
  {
    title: 'Pulso',
    value: '72 BPM',
    color: palette.orange,
    icon: 'heart',
  },
  {
    title: 'Presion arterial',
    value: '120/80\nmmHg',
    color: palette.blue,
    icon: 'thermometer',
  },
];

export default function HomeScreen() {
  const [chatOpen, setChatOpen] = useState(false);
  const [conversation, setConversation] = useState([
    { from: 'bot', text: 'Hola, en que puedo ayudarte?' },
  ]);
  const [userMessage, setUserMessage] = useState('');

  const quickReplies = [
    { id: 'reporte', label: 'Ver reporte de hoy', reply: 'Tu reporte estará disponible pronto.' },
    { id: 'alertas', label: '¿Tengo alertas?', reply: 'No se registran alertas en las últimas 24h.' },
    { id: 'ayuda', label: 'Ayuda con la app', reply: 'Usa las pestanas inferiores para navegar tus datos.' },
    { id: 'temp', label: 'Rango normal de temperatura', reply: 'Normal: 36.1°C a 37.2°C. Si sube de 38°C es fiebre.' },
    { id: 'pulso', label: 'Rango normal de pulso', reply: 'En reposo: 60-100 BPM adultos. Atletas pueden tener 50-60 BPM.' },
    { id: 'presion', label: 'Rango normal de presion', reply: 'Objetivo: ~120/80 mmHg. Alta si supera 140/90; baja si menor a 90/60.' },
    { id: 'spo2', label: 'Rango normal de oxigeno', reply: 'SpO2 sano: 95%-100%. Menos de 92% consultar con un medico.' },
  ];

  const { width } = useWindowDimensions();

  const handleReply = (r: typeof quickReplies[number]) => {
    setConversation((prev) => [...prev, { from: 'user', text: r.label }, { from: 'bot', text: r.reply }]);
  };

  const pickReply = (msg: string) => {
    const t = msg.toLowerCase();
    if (t.includes('pulso') || t.includes('bpm')) return 'En reposo: 60-100 BPM en adultos; atletas pueden tener 50-60 BPM.';
    if (t.includes('presion') || t.includes('mmhg')) return 'Presion saludable ~120/80 mmHg. Alta >140/90; baja <90/60.';
    if (t.includes('oxigen') || t.includes('spo2')) return 'SpO2 normal 95%-100%. Menos de 92% consulta a tu medico.';
    if (t.includes('temperatura') || t.includes('fiebre')) return 'Temperatura normal 36.1°C - 37.2°C. Fiebre si supera 38°C.';
    if (t.includes('alerta')) return 'No se registran alertas en las ultimas 24h.';
    if (t.includes('reporte')) return 'Tu reporte estara disponible pronto.';
    if (t.includes('ayuda')) return 'Usa las pestanas inferiores para navegar tus datos.';
    return 'Puedo ayudarte con rangos de pulso, presion, oxigeno y temperatura. Elige una opcion rapida o pregunta de nuevo.';
  };

  const handleSend = () => {
    const msg = userMessage.trim();
    if (!msg) return;
    const botReply = pickReply(msg);
    setConversation((prev) => [...prev, { from: 'user', text: msg }, { from: 'bot', text: botReply }]);
    setUserMessage('');
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.brand}>
            <Text style={styles.brandPrimary}>Wear</Text>
            <Text style={styles.brandAccent}>Able</Text>
          </Text>
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.sectionTitle}>Informacion principal</Text>
          <Text style={styles.sectionSubtitle}>Vista en tiempo real</Text>
        </View>

        <View style={styles.metricRow}>
          {metrics.map((item) => (
            <Pressable
              key={item.title}
              style={[styles.metricCard, { backgroundColor: item.color }]}
              onPress={() => {
                if (item.title === 'Temperatura') {
                  router.push('/temperatura');
                }
                if (item.title === 'Pulso') {
                  router.push('/pulso');
                }
                if (item.title === 'Presion arterial') {
                  router.push('/presion');
                }
                if (item.title === 'Nivel de oxigeno en sangre') {
                  router.push('/oxigeno');
                }
              }}
            >
              <Ionicons name={item.icon as any} size={20} color="#fff" />
              <Text style={styles.metricLabel}>{item.title}</Text>
              <Text style={styles.metricValue}>{item.value}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.chartBlock}>
          <Text style={styles.chartTitle}>Tendencia de datos</Text>
          <ChartCard />
        </View>

        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push('/sueno')}
        >
          <View style={styles.primaryIconCircle}>
            <Ionicons name="moon" size={18} color={palette.teal} />
          </View>
          <Text style={styles.primaryButtonText}>Calidad del Sueno</Text>
        </Pressable>

        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push('/oxigeno')}
        >
          <View style={styles.primaryIconCircle}>
            <Ionicons name="water" size={18} color={palette.teal} />
          </View>
          <Text style={styles.primaryButtonText}>Nivel de oxigeno en sangre</Text>
        </Pressable>

        <Pressable style={styles.primaryButton}>
          <View style={styles.primaryIconCircle}>
            <Ionicons name="warning" size={18} color={palette.teal} />
          </View>
          <Text style={styles.primaryButtonText}>Indice de caidas</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Ver mas metricas</Text>
          <Ionicons name="chevron-forward" size={18} color={palette.darkText} />
        </Pressable>
      </ScrollView>

      <Pressable style={styles.fab} onPress={() => setChatOpen((v) => !v)}>
        <Ionicons name="chatbubble-ellipses" size={22} color="#fff" />
      </Pressable>

      {chatOpen && (
        <KeyboardAvoidingView
          style={styles.chatWrapper}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
        >
          <View style={styles.chatCard}>
            <View style={styles.chatHeader}>
              <Text style={styles.chatTitle}>Asistente</Text>
              <Pressable hitSlop={10} onPress={() => setChatOpen(false)}>
                <Ionicons name="close" size={18} color={palette.darkText} />
              </Pressable>
            </View>
            <ScrollView style={styles.chatBody} contentContainerStyle={{ paddingBottom: 8 }}>
              {conversation.map((msg, idx) => (
                <View key={idx} style={[styles.chatBubble, msg.from === 'user' ? styles.chatUser : styles.chatBot]}>
                  <Text style={styles.chatText}>{msg.text}</Text>
                </View>
              ))}
            </ScrollView>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={userMessage}
                onChangeText={setUserMessage}
                placeholder="Escribe tu pregunta..."
                placeholderTextColor="#9da0a3"
                onSubmitEditing={handleSend}
                returnKeyType="send"
              />
              <Pressable style={styles.sendButton} onPress={handleSend}>
                <Ionicons name="send" size={18} color="#fff" />
              </Pressable>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRow}>
              {quickReplies.map((r) => (
                <Pressable key={r.id} style={styles.quickButton} onPress={() => handleReply(r)}>
                  <Text style={styles.quickText}>{r.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

function ChartCard() {
  const { width } = useWindowDimensions();
  const chartWidth = width - 40; // 20 padding each side
  const scrollableWidth = Math.max(chartWidth, timeLabels.length * 50);

  const data = {
    labels: timeLabels,
    datasets: [
      {
        data: tempSeries,
        color: () => palette.teal,
        strokeWidth: 3,
      },
      {
        data: pulseSeries,
        color: () => palette.orange,
        strokeWidth: 3,
      },
      {
        data: pressureSeries,
        color: () => palette.blue,
        strokeWidth: 3,
      },
    ],
    legend: ['Temperatura', 'Pulso', 'Presion'],
  };

  return (
    <View style={styles.chartCard}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <LineChart
          data={data}
          width={scrollableWidth}
          height={chartHeight}
          withDots
          withInnerLines
          withOuterLines={false}
          withShadow={false}
          segments={4}
          bezier
          chartConfig={{
            backgroundColor: palette.card,
            backgroundGradientFrom: palette.card,
            backgroundGradientTo: palette.card,
            decimalPlaces: 0,
            color: () => '#9da0a3',
            labelColor: () => '#9da0a3',
            propsForDots: {
              r: '4',
            },
            propsForBackgroundLines: {
              stroke: '#e8eaed',
              strokeDasharray: '',
            },
          }}
          style={styles.chartCanvas}
          formatYLabel={(value) => `${Math.round(Number(value))}`}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.lightBg,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 90,
    gap: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  brand: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  brandPrimary: {
    color: '#3d3d3d',
  },
  brandAccent: {
    color: palette.teal,
  },
  titleBlock: {
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4d4d4d',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#9da0a3',
  },
  metricRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  metricLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  metricValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
    lineHeight: 24,
  },
  chartBlock: {
    gap: 10,
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4d4d4d',
  },
  chartCard: {
    backgroundColor: palette.card,
    borderRadius: 14,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  chartCanvas: {
    borderRadius: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.teal,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  primaryIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#e5f7f3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#e8eaed',
  },
  secondaryButtonText: {
    fontSize: 14,
    color: palette.darkText,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: palette.teal,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  chatWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10,
  },
  chatCard: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 20,
    maxHeight: 520,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.darkText,
  },
  chatBody: {
    maxHeight: 320,
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f2f4',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: palette.darkText,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.teal,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  chatBubble: {
    padding: 8,
    borderRadius: 10,
    marginBottom: 6,
  },
  chatBot: {
    backgroundColor: '#f1f2f4',
    alignSelf: 'flex-start',
  },
  chatUser: {
    backgroundColor: '#e0f5f2',
    alignSelf: 'flex-end',
  },
  chatText: {
    fontSize: 13,
    color: palette.darkText,
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 4,
  },
  quickButton: {
    backgroundColor: '#eaf7f4',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  quickText: {
    fontSize: 12,
    color: palette.teal,
    fontWeight: '700',
  },
});
