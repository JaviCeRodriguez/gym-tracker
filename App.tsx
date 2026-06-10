import { useMemo, useState } from 'react';
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

type Tab = 'Home' | 'Sesiones' | 'Ejercicios';

const mockExercises = ['Sentadillas', 'Press de banca', 'Peso muerto'];

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
  const [sessionCounter, setSessionCounter] = useState(0);
  const [exerciseIndex, setExerciseIndex] = useState(0);

  const currentExercise = useMemo(
    () => mockExercises[exerciseIndex % mockExercises.length],
    [exerciseIndex],
  );

  const startSession = () => {
    setSessionCounter(previousValue => previousValue + 1);
    setExerciseIndex(previousValue => previousValue + 1);
  };

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
              <Text style={styles.primaryButtonText}>Empezar sesión</Text>
            </Pressable>
            <Text style={styles.detail} testID="session-counter">
              Contador: {sessionCounter}
            </Text>
            <Text style={styles.detail} testID="current-exercise">
              Ejercicio actual: {currentExercise}
            </Text>
          </View>
        )}
        {activeTab === 'Sesiones' && (
          <View>
            <Text style={styles.title} testID="screen-title">
              Sesiones
            </Text>
            <Text style={styles.subtitle} testID="lorem-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </Text>
          </View>
        )}
        {activeTab === 'Ejercicios' && (
          <View>
            <Text style={styles.title} testID="screen-title">
              Ejercicios
            </Text>
            <Text style={styles.subtitle} testID="lorem-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </Text>
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
    marginBottom: 18,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  detail: {
    fontSize: 16,
    marginBottom: 8,
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
