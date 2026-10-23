import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.badge}>Môi trường sạch • Expo SDK 57</Text>
        <Text style={styles.title}>Sẵn sàng cho dự án mới! 🚀</Text>
        <Text style={styles.subtitle}>
          Môi trường và các thư viện đã được dọn sạch và giữ nguyên.
          Bạn có thể bắt đầu code trực tiếp tại:
        </Text>
        <View style={styles.codeBox}>
          <Text style={styles.codeText}>app/index.jsx</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  badge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284c7',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 18,
  },
  codeBox: {
    backgroundColor: '#0f172a',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  codeText: {
    color: '#38bdf8',
    fontFamily: 'monospace',
    fontWeight: '700',
    fontSize: 14,
  },
});
