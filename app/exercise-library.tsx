import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { strings } from '../constants/strings';
import { Header, TextField, Chip, ExerciseRow } from '../components';
import { workoutService } from '../services';
import { Exercise, MuscleGroup } from '../types';

export default function ExerciseLibraryScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<MuscleGroup>('all');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadExercises();
  }, [search, selectedGroup]);

  const loadExercises = async () => {
    setLoading(true);
    const list = await workoutService.searchExercises(search, selectedGroup);
    setExercises(list);
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Header title={strings.workout.library} />

        {/* Search */}
        <TextField
          label="Tìm kiếm"
          placeholder={strings.workout.searchPlaceholder}
          value={search}
          onChangeText={setSearch}
        />

        {/* Filter Chips */}
        <View style={styles.chipsRow}>
          <Chip
            label={strings.workout.filterAll}
            selected={selectedGroup === 'all'}
            onPress={() => setSelectedGroup('all')}
          />
          <Chip
            label="Ngực"
            selected={selectedGroup === 'chest'}
            onPress={() => setSelectedGroup('chest')}
          />
          <Chip
            label="Lưng"
            selected={selectedGroup === 'back'}
            onPress={() => setSelectedGroup('back')}
          />
          <Chip
            label="Chân"
            selected={selectedGroup === 'legs'}
            onPress={() => setSelectedGroup('legs')}
          />
          <Chip
            label="Core"
            selected={selectedGroup === 'core'}
            onPress={() => setSelectedGroup('core')}
          />
        </View>

        {/* Loading State */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
          </View>
        )}

        {/* Empty State */}
        {!loading && exercises.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Không tìm thấy bài tập nào</Text>
            <Text style={styles.emptySubtitle}>
              Thử tìm kiếm với từ khóa khác hoặc chọn nhóm cơ khác
            </Text>
          </View>
        )}

        {/* Exercises */}
        {!loading &&
          exercises.map((item) => (
            <ExerciseRow
              key={item.id}
              title={item.name}
              subtitle={`${item.muscleGroupDisplay} · ${item.difficultyDisplay}`}
              badgeText={strings.workout.videoBadge}
              onPress={() => router.push(`/exercise/${item.id}/video`)}
            />
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xxxl,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: theme.spacing.xl,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 50,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: theme.typography.sizes.base,
    fontFamily: theme.fontFamilies.bold,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
