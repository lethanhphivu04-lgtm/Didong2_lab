import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.tag}>Static Route (Tên thường)</Text>
        <Text style={styles.title}>Trang Giới Thiệu (/about)</Text>
        <Text style={styles.description}>
          File: <Text style={styles.code}>app/about.jsx</Text>{'\n'}
          Đường dẫn URL khớp 1-1 với tên file:{' '}
          <Text style={styles.highlight}>/about</Text>
        </Text>
        <Text style={styles.body}>
          Đây là loại route đơn giản nhất trong Expo Router. Khi không có ký hiệu đặc biệt nào, tên file và cấu trúc thư mục quyết định chính xác URL truy cập.
        </Text>
      </View>

      <Link href="/" style={styles.backLink}>
        <Text style={styles.backLinkText}>← Quay lại Trang Chủ</Text>
      </Link>
    </View>
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
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0f2fe',
    color: '#0284c7',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 12,
  },
  code: {
    fontFamily: 'monospace',
    backgroundColor: '#f1f5f9',
    color: '#0f172a',
    fontWeight: '600',
  },
  highlight: {
    color: '#0284c7',
    fontWeight: 'bold',
  },
  body: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
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

