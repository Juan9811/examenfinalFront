// Mock global de localStorage para todos los tests
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn((key: string, value: string) => {}),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
// @ts-ignore
window.localStorage = localStorageMock;
import '@testing-library/jest-dom'

// Extensión global para Vitest
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Limpiar después de cada test
afterEach(() => {
  cleanup()
})
