import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';

export default function UserProfileScreen() {
  const { userId } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.tag}>Dynamic Route [param]</Text>
        <Text style={styles.title}>Hồ sơ người dùng</Text>

        <View style={styles.paramBox}>
          <Text style={styles.paramLabel}>Tham số URL nhận được:</Text>
          <Text style={styles.paramValue}>{userId ?? 'Chưa có ID'}</Text>
        </View>

        <Text style={styles.description}>
          File: <Text style={styles.code}>app/users/[userId].jsx</Text>{'\n'}
          Đường dẫn URL:{' '}
          <Text style={styles.highlight}>/users/{userId}</Text>
        </Text>

        <Text style={styles.body}>
          Ký hiệu ngoặc vuông <Text style={styles.code}>[userId]</Text> cho phép Expo Router bắt tham số động. Trong code, ta dùng hook:{'\n'}
          <Text style={styles.code}>const &#123; userId &#125; = useLocalSearchParams();</Text>
        </Text>
      </View>

      <View style={styles.otherUsersBox}>
        <Text style={styles.otherUsersTitle}>Thử chuyển sang User khác:</Text>
        <View style={styles.buttonRow}>
          <Link href="/users/alex_99" style={styles.pillButton}>
            <Text style={styles.pillButtonText}>alex_99</Text>
          </Link>
          <Link href="/users/sarah_design" style={styles.pillButton}>
            <Text style={styles.pillButtonText}>sarah_design</Text>
          </Link>
          <Link href="/users/thanhvu" style={styles.pillButton}>
            <Text style={styles.pillButtonText}>thanhvu</Text>
          </Link>
        </View>
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
    marginBottom: 20,
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: '#fef3c7',
    color: '#d97706',
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
    marginBottom: 16,
  },
  paramBox: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#d97706',
  },
  paramLabel: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 4,
  },
  paramValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
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
    color: '#d97706',
    fontWeight: 'bold',
  },
  body: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  otherUsersBox: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 24,
    alignItems: 'center',
  },
  otherUsersTitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 8,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  pillButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#e2e8f0',
    borderRadius: 20,
  },
  pillButtonText: {
    color: '#1e293b',
    fontSize: 13,
    fontWeight: '600',
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

