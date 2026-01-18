/**
 * Composable for managing canvas background
 */

import { ref, onMounted, computed } from 'vue';
import { STORAGE_KEYS, DEFAULT_BACKGROUND } from '~/config/constants';

const BLUR_STORAGE_KEY = 'spacer_bg_blur';
const BLUR_AMOUNT_KEY = 'spacer_bg_blur_amount';

export const useBackground = () => {
  const canvasBackground = ref<string>(DEFAULT_BACKGROUND);
  const backgroundBlur = ref<boolean>(false);
  const blurAmount = ref<number>(8); // Default blur amount in pixels

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
   * Computed property for blur filter
   */
  const blurStyle = computed(() => {
    if (backgroundBlur.value && blurAmount.value > 0) {
      return {
        filter: `blur(${blurAmount.value}px)`,
        transform: 'scale(1.1)', // Prevent blur edge artifacts
      };
    }
    return {};
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

    const savedBlur = localStorage.getItem(BLUR_STORAGE_KEY);
    if (savedBlur) {
      backgroundBlur.value = savedBlur === 'true';
    }

    const savedBlurAmount = localStorage.getItem(BLUR_AMOUNT_KEY);
    if (savedBlurAmount) {
      blurAmount.value = parseInt(savedBlurAmount, 10) || 8;
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

  /**
   * Set and save blur
   */
  const setBlur = (value: boolean) => {
    backgroundBlur.value = value;
    if (typeof window !== 'undefined') {
      localStorage.setItem(BLUR_STORAGE_KEY, String(value));
    }
  };

  /**
   * Toggle blur
   */
  const toggleBlur = () => {
    setBlur(!backgroundBlur.value);
  };

  /**
   * Set and save blur amount
   */
  const setBlurAmount = (value: number) => {
    blurAmount.value = value;
    if (typeof window !== 'undefined') {
      localStorage.setItem(BLUR_AMOUNT_KEY, String(value));
    }
  };

  // Auto-load on mount
  onMounted(() => {
    loadBackground();
  });

  return {
    canvasBackground,
    backgroundBlur,
    blurAmount,
    backgroundStyle,
    blurStyle,
    setBackground,
    setBlur,
    setBlurAmount,
    toggleBlur,
    loadBackground,
  };
};
