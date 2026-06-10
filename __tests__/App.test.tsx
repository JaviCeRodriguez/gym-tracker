/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }),
}));

test('renders home content by default', async () => {
  let app: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    app = ReactTestRenderer.create(<App />);
  });

  const root = app!.root;
  expect(root.findByProps({ testID: 'tab-home' })).toBeTruthy();
  expect(root.findByProps({ testID: 'tab-sesiones' })).toBeTruthy();
  expect(root.findByProps({ testID: 'tab-ejercicios' })).toBeTruthy();
  expect(root.findByProps({ testID: 'screen-title' }).props.children).toBe(
    'Último progreso',
  );
  expect(root.findByProps({ testID: 'session-counter' }).props.children).toEqual([
    'Contador: ',
    0,
  ]);
});

test('increments counter when starting a session', async () => {
  let app: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    app = ReactTestRenderer.create(<App />);
  });
  const root = app!.root;
  await ReactTestRenderer.act(() => {
    root.findByProps({ testID: 'start-session-button' }).props.onPress();
  });

  expect(root.findByProps({ testID: 'session-counter' }).props.children).toEqual([
    'Contador: ',
    1,
  ]);
  expect(root.findByProps({ testID: 'current-exercise' }).props.children).toEqual([
    'Ejercicio actual: ',
    'Press de banca',
  ]);
});

test('navigates to sesiones and ejercicios tabs', async () => {
  let app: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    app = ReactTestRenderer.create(<App />);
  });

  const root = app!.root;
  await ReactTestRenderer.act(() => {
    root.findByProps({ testID: 'tab-sesiones' }).props.onPress();
  });
  expect(root.findByProps({ testID: 'screen-title' }).props.children).toBe(
    'Sesiones',
  );
  expect(root.findByProps({ testID: 'lorem-text' }).props.children).toBe(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  );

  await ReactTestRenderer.act(() => {
    root.findByProps({ testID: 'tab-ejercicios' }).props.onPress();
  });
  expect(root.findByProps({ testID: 'screen-title' }).props.children).toBe(
    'Ejercicios',
  );
  expect(root.findByProps({ testID: 'lorem-text' }).props.children).toBe(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  );
});
