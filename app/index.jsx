import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Expo Router Notation</Text>
        <Text style={styles.headerSubtitle}>
          Quy ước đặt tên file và thư mục để định nghĩa cây điều hướng
        </Text>
      </View>

      {/* Mục 1: index.jsx */}
      <View style={styles.card}>
        <View style={styles.badgeRow}>
          <Text style={[styles.badge, styles.badgeIndex]}>index.jsx</Text>
          <Text style={styles.routeType}>Default Route</Text>
        </View>
        <Text style={styles.cardTitle}>Màn hình hiện tại: Trang chủ (/)</Text>
        <Text style={styles.cardDesc}>
          File <Text style={styles.code}>app/index.jsx</Text> tự động đóng vai trò là route gốc mặc định (<Text style={styles.code}>/</Text>).
        </Text>
      </View>

      {/* Mục 2: Tên thường (Static Route) */}
      <Link href="/about" style={styles.cardLink}>
        <View style={styles.card}>
          <View style={styles.badgeRow}>
            <Text style={[styles.badge, styles.badgeStatic]}>Tên thường</Text>
            <Text style={styles.routeType}>Static Route</Text>
          </View>
          <Text style={styles.cardTitle}>1. Giới thiệu (/about) →</Text>
          <Text style={styles.cardDesc}>
            File <Text style={styles.code}>app/about.jsx</Text> khớp 1-1 với URL <Text style={styles.code}>/about</Text>.
          </Text>
        </View>
      </Link>

      {/* Mục 3: Ngoặc vuông [param] (Dynamic Route) */}
      <Link href="/users/dev_01" style={styles.cardLink}>
        <View style={styles.card}>
          <View style={styles.badgeRow}>
            <Text style={[styles.badge, styles.badgeDynamic]}>[param]</Text>
            <Text style={styles.routeType}>Dynamic Route</Text>
          </View>
          <Text style={styles.cardTitle}>2. Xem Profile User: dev_01 →</Text>
          <Text style={styles.cardDesc}>
            File <Text style={styles.code}>app/users/[userId].jsx</Text> bắt tham số động bằng hook <Text style={styles.code}>useLocalSearchParams()</Text>.
          </Text>
        </View>
      </Link>

      {/* Mục 4: Ngoặc tròn (group) (Route Group) */}
      <Link href="/feed" style={styles.cardLink}>
        <View style={styles.card}>
          <View style={styles.badgeRow}>
            <Text style={[styles.badge, styles.badgeGroup]}>(group)</Text>
            <Text style={styles.routeType}>Route Group</Text>
          </View>
          <Text style={styles.cardTitle}>3. Bảng tin (/feed) →</Text>
          <Text style={styles.cardDesc}>
            File nằm ở <Text style={styles.code}>app/(home)/feed.jsx</Text>, nhưng URL vẫn là <Text style={styles.code}>/feed</Text> mà không có <Text style={styles.code}>/(home)</Text>.
          </Text>
        </View>
      </Link>

      {/* Mục 5: _layout.jsx */}
      <View style={styles.card}>
        <View style={styles.badgeRow}>
          <Text style={[styles.badge, styles.badgeLayout]}>_layout.jsx</Text>
          <Text style={styles.routeType}>Layout Route</Text>
        </View>
        <Text style={styles.cardTitle}>4. Khung điều hướng chung</Text>
        <Text style={styles.cardDesc}>
          File <Text style={styles.code}>app/_layout.jsx</Text> đang bọc thanh Stack Header màu xanh phía trên cùng cho tất cả các trang.
        </Text>
      </View>

      {/* Mục 6: Ký hiệu + (+not-found.jsx) */}
      <Link href="/duong-dan-khong-ton-tai" style={styles.cardLink}>
        <View style={[styles.card, styles.cardNotFound]}>
          <View style={styles.badgeRow}>
            <Text style={[styles.badge, styles.badgeSpecial]}>+prefix</Text>
            <Text style={styles.routeType}>Special Route</Text>
          </View>
          <Text style={[styles.cardTitle, { color: '#ef4444' }]}>5. Thử vào trang 404 →</Text>
          <Text style={styles.cardDesc}>
            Bấm để test file <Text style={styles.code}>app/+not-found.jsx</Text> khi truy cập vào link không tồn tại.
          </Text>
        </View>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    padding: 16,
    paddingBottom: 40,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    maxWidth: 500,
    marginBottom: 20,
    marginTop: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  cardLink: {
    width: '100%',
    maxWidth: 500,
    marginBottom: 12,
  },
  card: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardNotFound: {
    borderColor: '#fecaca',
    backgroundColor: '#fffdfd',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  badge: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: 'hidden',
  },
  badgeIndex: {
    backgroundColor: '#e0e7ff',
    color: '#4338ca',
  },
  badgeStatic: {
    backgroundColor: '#e0f2fe',
    color: '#0284c7',
  },
  badgeDynamic: {
    backgroundColor: '#fef3c7',
    color: '#d97706',
  },
  badgeGroup: {
    backgroundColor: '#dcfce7',
    color: '#16a34a',
  },
  badgeLayout: {
    backgroundColor: '#f3e8ff',
    color: '#7e22ce',
  },
  badgeSpecial: {
    backgroundColor: '#fee2e2',
    color: '#ef4444',
  },
  routeType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 19,
  },
  code: {
    fontFamily: 'monospace',
    backgroundColor: '#f1f5f9',
    color: '#0f172a',
    fontWeight: '600',
    fontSize: 12,
  },
});
