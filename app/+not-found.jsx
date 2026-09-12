import { View, Text, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Trang không tồn tại!' }} />
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.tag}>Special Route (+)</Text>
          <Text style={styles.codeTitle}>404</Text>
          <Text style={styles.title}>Không tìm thấy trang!</Text>

          <Text style={styles.description}>
            File: <Text style={styles.code}>app/+not-found.jsx</Text>
          </Text>

          <Text style={styles.body}>
            Tiền tố <Text style={styles.code}>+</Text> là quy ước đặc biệt của Expo Router. File <Text style={styles.code}>+not-found.jsx</Text> sẽ tự động kích hoạt khi người dùng truy cập một đường dẫn không khớp với bất kỳ file nào trong dự án.
          </Text>
        </View>

        <Link href="/" style={styles.backLink}>
          <Text style={styles.backLinkText}>← Trở về Trang Chủ</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    marginBottom: 24,
    alignItems: 'center',
  },
  tag: {
    alignSelf: 'center',
    backgroundColor: '#fee2e2',
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  codeTitle: {
    fontSize: 64,
    fontWeight: '900',
    color: '#ef4444',
    lineHeight: 70,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 12,
  },
  code: {
    fontFamily: 'monospace',
    backgroundColor: '#f1f5f9',
    color: '#0f172a',
    fontWeight: '600',
  },
  body: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    textAlign: 'center',
  },
  backLink: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#0a7ea4',
    borderRadius: 10,
  },
  backLinkText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
});

