/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

const textValue = (children: React.ReactNode) =>
  Array.isArray(children) ? children.join('') : String(children);

const renderApp = async () => {
  let app: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    app = ReactTestRenderer.create(<App />);
    await Promise.resolve();
  });
  return app!;
};

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

beforeEach(() => {
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
});

test('renders home content by default', async () => {
  const app = await renderApp();
  const root = app.root;
  expect(root.findByProps({ testID: 'tab-home' })).toBeTruthy();
  expect(root.findByProps({ testID: 'tab-sesiones' })).toBeTruthy();
  expect(root.findByProps({ testID: 'tab-ejercicios' })).toBeTruthy();
  expect(root.findByProps({ testID: 'screen-title' }).props.children).toBe(
    'Último progreso',
  );
  expect(root.findByProps({ testID: 'session-counter' }).props.children).toEqual([
    'Sesiones iniciadas: ',
    0,
  ]);
});

test('starts session and allows adding exercise records', async () => {
  const app = await renderApp();
  const root = app.root;

  await ReactTestRenderer.act(() => {
    root.findByProps({ testID: 'start-session-button' }).props.onPress();
  });
  await ReactTestRenderer.act(() => {
    root.findByProps({ testID: 'input-day' }).props.onChangeText('Lunes');
    root
      .findByProps({ testID: 'input-exercise' })
      .props.onChangeText('Caminata en cinta');
    root.findByProps({ testID: 'input-sets-reps' }).props.onChangeText('15 min');
  });
  await ReactTestRenderer.act(() => {
    root.findByProps({ testID: 'add-exercise-button' }).props.onPress();
  });
  await ReactTestRenderer.act(() => {
    root.findByProps({ testID: 'end-session-button' }).props.onPress();
  });
  await ReactTestRenderer.act(() => {
    root
      .findByProps({ testID: 'input-exercise' })
      .props.onChangeText('Sillón femoral');
    root.findByProps({ testID: 'input-sets-reps' }).props.onChangeText('4 x 10');
  });
  await ReactTestRenderer.act(() => {
    root.findByProps({ testID: 'add-exercise-button' }).props.onPress();
  });

  expect(root.findByProps({ testID: 'session-counter' }).props.children).toEqual([
    'Sesiones iniciadas: ',
    1,
  ]);
  expect(root.findByProps({ testID: 'session-status' }).props.children).toEqual([
    'Estado: ',
    'Sin sesión activa',
  ]);
  const exerciseRows = root.findAllByProps({ testID: 'exercise-row' });
  const uniqueRows = new Set(exerciseRows.map(row => textValue(row.props.children)));
  expect(uniqueRows).toEqual(
    new Set(['Lunes;Caminata en cinta;15 min;', 'Lunes;Sillón femoral;4 x 10;']),
  );
  expect(AsyncStorage.setItem).toHaveBeenCalled();
});

test('navigates to sesiones and ejercicios tabs', async () => {
  const app = await renderApp();
  const root = app.root;
  await ReactTestRenderer.act(() => {
    root.findByProps({ testID: 'tab-sesiones' }).props.onPress();
  });
  expect(root.findByProps({ testID: 'screen-title' }).props.children).toBe(
    'Sesiones',
  );
  expect(root.findByProps({ testID: 'lorem-text' }).props.children).toBe(
    'Historial de sesiones registradas.',
  );

  await ReactTestRenderer.act(() => {
    root.findByProps({ testID: 'tab-ejercicios' }).props.onPress();
  });
  expect(root.findByProps({ testID: 'screen-title' }).props.children).toBe(
    'Ejercicios',
  );
  expect(root.findByProps({ testID: 'lorem-text' }).props.children).toBe(
    'Lista de ejercicios cargados.',
  );
});
