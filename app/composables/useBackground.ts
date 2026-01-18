/**
 * Composable for managing canvas background
 */

import { ref, onMounted, computed } from 'vue';
import { STORAGE_KEYS, DEFAULT_BACKGROUND } from '~/config/constants';

export const useBackground = () => {
  const canvasBackground = ref<string>(DEFAULT_BACKGROUND);

  /**
   * Computed property to format background for CSS
   */
  const backgroundStyle = computed(() => {
    const bg = canvasBackground.value;
    // If it's a url() format (image), add additional CSS properties
    if (bg.startsWith('url(')) {
      return {
        background: bg,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      };
    }
    // Otherwise it's a color
    return {
      background: bg,
    };
  });

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
    backgroundStyle,
    setBackground,
    loadBackground,
  };
};
