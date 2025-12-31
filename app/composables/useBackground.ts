/**
 * Composable for managing canvas background
 */

import { ref, onMounted } from 'vue';
import { STORAGE_KEYS, DEFAULT_BACKGROUND } from '~/config/constants';

export const useBackground = () => {
  const canvasBackground = ref<string>(DEFAULT_BACKGROUND);

  /**
   * Load background from localStorage
   */
  const loadBackground = () => {
    if (typeof window === 'undefined') return;

    const savedBg = localStorage.getItem(STORAGE_KEYS.BACKGROUND);
    if (savedBg) {
      canvasBackground.value = savedBg;
    }
  };

  /**
   * Set and save background
   */
  const setBackground = (value: string) => {
    canvasBackground.value = value;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.BACKGROUND, value);
    }
  };

  // Auto-load on mount
  onMounted(() => {
    loadBackground();
  });

  return {
    canvasBackground,
    setBackground,
    loadBackground,
  };
};
