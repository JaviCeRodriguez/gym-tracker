import { useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

type Tab = 'Home' | 'Sesiones' | 'Ejercicios';

type WorkoutSession = {
  id: string;
  day: string;
};

type ExerciseRecord = {
  id: string;
  sessionId: string;
  day: string;
  exercise: string;
  setsReps: string;
  notes: string;
};

const STORAGE_KEY = 'gym-tracker:sessions';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>('Home');
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [exerciseRecords, setExerciseRecords] = useState<ExerciseRecord[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [day, setDay] = useState('Lunes');
  const [exercise, setExercise] = useState('');
  const [setsReps, setSetsReps] = useState('');
  const [notes, setNotes] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);
  const idCounterRef = useRef(0);

  const createId = () => {
    idCounterRef.current += 1;
    return `${Date.now()}-${idCounterRef.current}`;
  };

  const exerciseCountBySession = useMemo(() => {
    return exerciseRecords.reduce<Map<string, number>>((acc, record) => {
      acc.set(record.sessionId, (acc.get(record.sessionId) ?? 0) + 1);
      return acc;
    }, new Map());
  }, [exerciseRecords]);

  const startSession = () => {
    const sessionId = createId();
    setSessions(previousValue => [...previousValue, { id: sessionId, day }]);
    setActiveSessionId(sessionId);
  };

  const finishSession = () => {
    setActiveSessionId(null);
  };

  const addExerciseRecord = () => {
    if (!exercise.trim() || !setsReps.trim()) {
      return;
    }

    let sessionId = activeSessionId ?? sessions[sessions.length - 1]?.id ?? null;

    if (!sessionId) {
      sessionId = createId();
      setSessions([{ id: sessionId, day }]);
    }
    const resolvedSessionId = sessionId;

    setExerciseRecords(previousValue => {
      const nextRecord = {
        id: createId(),
        sessionId: resolvedSessionId,
        day,
        exercise: exercise.trim(),
        setsReps: setsReps.trim(),
        notes: notes.trim(),
      };
      const lastRecord = previousValue[previousValue.length - 1];

      if (
        lastRecord &&
        lastRecord.sessionId === nextRecord.sessionId &&
        lastRecord.day === nextRecord.day &&
        lastRecord.exercise === nextRecord.exercise &&
        lastRecord.setsReps === nextRecord.setsReps &&
        lastRecord.notes === nextRecord.notes
      ) {
        return previousValue;
      }

      return [...previousValue, nextRecord];
    });

    setExercise('');
    setSetsReps('');
    setNotes('');
  };

  useEffect(() => {
    const hydrate = async () => {
      try {
        const value = await AsyncStorage.getItem(STORAGE_KEY);
        if (value) {
          const parsedValue = JSON.parse(value) as {
            sessions?: WorkoutSession[];
            exerciseRecords?: ExerciseRecord[];
            activeSessionId?: string | null;
          };
          setSessions(parsedValue.sessions ?? []);
          setExerciseRecords(parsedValue.exerciseRecords ?? []);
          setActiveSessionId(parsedValue.activeSessionId ?? null);
        }
      } finally {
        setIsHydrated(true);
      }
    };

    hydrate();
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        sessions,
        exerciseRecords,
        activeSessionId,
      }),
    );
  }, [activeSessionId, exerciseRecords, isHydrated, sessions]);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: safeAreaInsets.top,
          paddingBottom: safeAreaInsets.bottom,
        },
      ]}>
      <View style={styles.content}>
        {activeTab === 'Home' && (
          <View>
            <Text style={styles.title} testID="screen-title">
              Último progreso
            </Text>
            <Text style={styles.subtitle}>
              Entrenamiento de piernas · 45 min · 12 series
            </Text>
            <Pressable
              onPress={startSession}
              style={styles.primaryButton}
              testID="start-session-button">
              <Text style={styles.primaryButtonText}>Iniciar sesión</Text>
            </Pressable>
            <Pressable
              onPress={finishSession}
              style={styles.secondaryButton}
              testID="end-session-button">
              <Text style={styles.secondaryButtonText}>Finalizar sesión</Text>
            </Pressable>
            <Text style={styles.detail} testID="session-counter">
              Sesiones iniciadas: {sessions.length}
            </Text>
            <Text style={styles.detail} testID="session-status">
              Estado: {activeSessionId ? 'En curso' : 'Sin sesión activa'}
            </Text>
            <TextInput
              testID="input-day"
              value={day}
              onChangeText={setDay}
              placeholder="Día"
              style={styles.input}
            />
            <TextInput
              testID="input-exercise"
              value={exercise}
              onChangeText={setExercise}
              placeholder="Ejercicio"
              style={styles.input}
            />
            <TextInput
              testID="input-sets-reps"
              value={setsReps}
              onChangeText={setSetsReps}
              placeholder="Series x repeticiones"
              style={styles.input}
            />
            <TextInput
              testID="input-notes"
              value={notes}
              onChangeText={setNotes}
              placeholder="Notas"
              style={styles.input}
            />
            <Pressable
              onPress={addExerciseRecord}
              style={styles.primaryButton}
              testID="add-exercise-button">
              <Text style={styles.primaryButtonText}>Agregar ejercicio</Text>
            </Pressable>
            {exerciseRecords.map(record => (
              <Text style={styles.detail} key={record.id} testID="exercise-row">
                {record.day};{record.exercise};{record.setsReps};{record.notes}
              </Text>
            ))}
          </View>
        )}
        {activeTab === 'Sesiones' && (
          <View>
            <Text style={styles.title} testID="screen-title">
              Sesiones
            </Text>
            <Text style={styles.subtitle} testID="lorem-text">
              Historial de sesiones registradas.
            </Text>
            {sessions.map(session => (
              <Text style={styles.detail} key={session.id} testID="session-row">
                {session.day} · {exerciseCountBySession.get(session.id) ?? 0} ejercicios
              </Text>
            ))}
          </View>
        )}
        {activeTab === 'Ejercicios' && (
          <View>
            <Text style={styles.title} testID="screen-title">
              Ejercicios
            </Text>
            <Text style={styles.subtitle} testID="lorem-text">
              Lista de ejercicios cargados.
            </Text>
            {exerciseRecords.map(record => (
              <Text style={styles.detail} key={record.id} testID="exercise-name-row">
                {record.exercise}
              </Text>
            ))}
          </View>
        )}
      </View>
      <View style={styles.tabBar}>
        <Pressable
          onPress={() => setActiveTab('Home')}
          style={[styles.tabButton, activeTab === 'Home' && styles.activeTab]}
          testID="tab-home">
          <Text style={styles.tabButtonText}>Home</Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab('Sesiones')}
          style={[
            styles.tabButton,
            activeTab === 'Sesiones' && styles.activeTab,
          ]}
          testID="tab-sesiones">
          <Text style={styles.tabButtonText}>Sesiones</Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab('Ejercicios')}
          style={[
            styles.tabButton,
            activeTab === 'Ejercicios' && styles.activeTab,
          ]}
          testID="tab-ejercicios">
          <Text style={styles.tabButtonText}>Ejercicios</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#555555',
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#2f80ed',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#2f80ed',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  secondaryButtonText: {
    color: '#2f80ed',
    fontWeight: '600',
  },
  detail: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d6d6d6',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#dddddd',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#e8f0fe',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default App;
