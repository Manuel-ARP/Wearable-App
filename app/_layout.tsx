import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="ajustes" options={{ headerShown: false }} />
        <Stack.Screen name="guardian" options={{ headerShown: false }} />
        <Stack.Screen name="asignar_permisos" options={{ headerShown: false }} />
        <Stack.Screen name="menu_permisos" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="registro_paso1" options={{ headerShown: false }} />
        <Stack.Screen name="registro_paso2" options={{ headerShown: false }} />
        <Stack.Screen name="registro_paso3" options={{ headerShown: false }} />
        <Stack.Screen name="registro_paso4" options={{ headerShown: false }} />
        <Stack.Screen name="pulso" options={{ headerShown: false }} />
        <Stack.Screen name="presion" options={{ headerShown: false }} />
        <Stack.Screen name="oxigeno" options={{ headerShown: false }} />
        <Stack.Screen name="sueno" options={{ headerShown: false }} />
        <Stack.Screen name="editar_perfil" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
