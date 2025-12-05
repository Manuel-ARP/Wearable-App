import React, { useEffect, useState, useCallback } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator, Alert, ActionSheetIOS, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { getCurrentUser } from "../authStore";
import { API_BASE } from "@/constants/api";

const palette = {
  teal: "#36b6ac",
  darkText: "#4d4d4d",
  muted: "#8c8f94",
  lightBg: "#f5f6f8",
  card: "#ffffff",
};

type Contact = {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  relacion?: string | null;
};

export default function ContactsScreen() {
  const user = getCurrentUser();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);

  const loadContacts = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}?action=list_contacts&user_id=${user.id}`);
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "No se pudo cargar");
      setContacts(json.contacts || []);
    } catch (err: any) {
      Alert.alert("Error", err.message || "No se pudieron cargar tus contactos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadContacts();
    }, [user])
  );

  const handleEdit = (contact: Contact) => {
    router.push({
      pathname: '/(tabs)/anadir_contacto',
      params: {
        id: String(contact.id),
        nombre: contact.nombre,
        apellidos: contact.apellidos,
        email: contact.email,
        telefono: contact.telefono,
        relacion: contact.relacion || '',
      },
    });
  };

  const confirmDelete = (id: number) => {
    Alert.alert("Contacto", "Deseas eliminar este contacto?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await fetch(`${API_BASE}?action=delete_contact`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id, user_id: user?.id }),
            });
            const json = await res.json();
            if (!res.ok || !json.success) throw new Error(json.error || "No se pudo eliminar");
            loadContacts();
          } catch (err: any) {
            Alert.alert("Error", err.message || "No se pudo eliminar el contacto");
          }
        },
      },
    ]);
  };

  const openMenu = (contact: Contact) => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Editar contacto', 'Eliminar contacto'],
          cancelButtonIndex: -1,
          destructiveButtonIndex: 1,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) handleEdit(contact);
          if (buttonIndex === 1) confirmDelete(contact.id);
        }
      );
    } else {
      Alert.alert(
        'Contacto',
        undefined,
        [
          { text: "Editar contacto", onPress: () => handleEdit(contact) },
          { text: "Eliminar contacto", style: "destructive", onPress: () => confirmDelete(contact.id) },
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Contactos</Text>
            <Text style={styles.subtitle}>
              Notificaremos a estas personas en caso de presentar valores criticos
            </Text>
          </View>
        </View>

        <Pressable
          style={styles.addButton}
          onPress={() => router.push('/(tabs)/anadir_contacto')}
        >
          <View style={styles.addIconCircle}>
            <Ionicons name='add' size={20} color='#fff' />
          </View>
          <Text style={styles.addButtonText}>Anadir Contacto</Text>
        </Pressable>

        {!user && (
          <Text style={styles.notice}>Inicia sesion para ver y agregar tus contactos.</Text>
        )}

        {loading && <ActivityIndicator color={palette.teal} />}

        <View style={styles.list}>
          {contacts.map((contact) => (
            <View key={contact.id} style={styles.contactCard}>
              <View style={styles.avatar}>
                <Ionicons name='person' size={28} color={palette.muted} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{`${contact.nombre} ${contact.apellidos}`}</Text>
                <Text style={styles.contactDetail}>{contact.email}</Text>
                <Text style={styles.contactDetail}>{contact.telefono}</Text>
                {contact.relacion ? (
                  <Text style={styles.contactDetail}>{contact.relacion}</Text>
                ) : null}
              </View>
              <Pressable
                style={styles.editButton}
                hitSlop={10}
                onPress={() => openMenu(contact)}
              >
                <Ionicons name='ellipsis-horizontal' size={20} color={palette.muted} />
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
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
    paddingBottom: 24,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: palette.darkText,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: palette.muted,
    lineHeight: 18,
    maxWidth: "88%",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.teal,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  addIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  list: {
    gap: 12,
  },
  notice: {
    fontSize: 14,
    color: palette.muted,
    fontWeight: "700",
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: palette.card,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#e8eaed",
    alignItems: "center",
    justifyContent: "center",
  },
  contactInfo: {
    flex: 1,
    gap: 2,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "700",
    color: palette.darkText,
  },
  contactDetail: {
    fontSize: 13,
    color: palette.muted,
  },
  editButton: {
    padding: 8,
  },
});
