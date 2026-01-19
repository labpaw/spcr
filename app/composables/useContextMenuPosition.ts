/**
 * Composable for handling context menu positioning
 * Ensures menus stay within viewport bounds
 */

import { ref, computed, watch, nextTick } from 'vue';
import type { Position } from '~/types';
import type { Ref } from 'vue';

interface UseContextMenuPositionOptions {
  visible: Ref<boolean> | (() => boolean);
  position: Ref<Position> | (() => Position);
  padding?: number;
}

export const useContextMenuPosition = (options: UseContextMenuPositionOptions) => {
  const { padding = 10 } = options;

  const menuRef = ref<HTMLDivElement | null>(null);
  const menuHeight = ref(0);
  const menuWidth = ref(0);

  // Get the current visibility value (support both ref and getter)
  const getVisible = () => {
    return typeof options.visible === 'function' ? options.visible() : options.visible.value;
  };

  // Get the current position value (support both ref and getter)
  const getPosition = () => {
    return typeof options.position === 'function' ? options.position() : options.position.value;
  };

  /**
   * Computed style for menu positioning
   * Adjusts position to keep menu within viewport
   */
  const adjustedPosition = computed(() => {
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

    const pos = getPosition();
    let x = pos.x;
    let y = pos.y;

    // Prevent overflow on right edge
    if (x + menuWidth.value + padding > viewportWidth) {
      x = Math.max(padding, x - menuWidth.value);
    }

    // Prevent overflow on bottom edge
    if (y + menuHeight.value + padding > viewportHeight) {
      y = Math.max(padding, y - menuHeight.value);
    }

    return {
      left: `${x}px`,
      top: `${y}px`,
    };
  });

  /**
   * Update menu dimensions when visibility changes
   */
  const updateMenuDimensions = async () => {
    await nextTick();
    if (menuRef.value) {
      menuHeight.value = menuRef.value.offsetHeight;
      menuWidth.value = menuRef.value.offsetWidth;
    }
  };

  // Watch for visibility changes to update dimensions
  watch(
    () => getVisible(),
    async (visible) => {
      if (visible) {
        await updateMenuDimensions();
      }
    },
  );

  return {
    menuRef,
    adjustedPosition,
    updateMenuDimensions,
  };
};
