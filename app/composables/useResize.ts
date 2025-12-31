/**
 * Composable for handling image resize functionality
 */

import { ref } from 'vue';
import type { ImageElement, ResizeState } from '~/types';
import { ELEMENT_CONSTRAINTS } from '~/config/constants';

export const useResize = (onResizeEnd?: () => void) => {
  const resizeState = ref<ResizeState>({
    isResizing: false,
    element: null,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    aspectRatio: undefined,
  });

  /**
   * Start resizing an image
   */
  const startResize = (element: ImageElement, event: MouseEvent, imageElement: HTMLImageElement) => {
    const aspectRatio = imageElement.naturalWidth / imageElement.naturalHeight;

    resizeState.value = {
      isResizing: true,
      element,
      startX: event.clientX,
      startY: event.clientY,
      startWidth: element.width || imageElement.offsetWidth,
      startHeight: element.height || imageElement.offsetHeight,
      aspectRatio,
    };

    document.body.style.cursor = 'nwse-resize';
    document.body.style.userSelect = 'none';

    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);
    event.preventDefault();
  };

  /**
   * Handle resize movement
   */
  const handleResize = (event: MouseEvent) => {
    if (!resizeState.value.isResizing || !resizeState.value.element) return;

    const dx = event.clientX - resizeState.value.startX;
    const dy = event.clientY - resizeState.value.startY;

    if (event.shiftKey && resizeState.value.aspectRatio) {
      // Proportional resize with Shift held
      const distance = Math.sqrt(dx * dx + dy * dy);
      const direction = dx + dy > 0 ? 1 : -1;
      const newWidth = Math.max(ELEMENT_CONSTRAINTS.MIN_SIZE, resizeState.value.startWidth + distance * direction);
      const newHeight = newWidth / resizeState.value.aspectRatio;

      resizeState.value.element.width = newWidth;
      resizeState.value.element.height = newHeight;
    } else {
      // Free resize - independent width and height
      const newWidth = Math.max(ELEMENT_CONSTRAINTS.MIN_SIZE, resizeState.value.startWidth + dx);
      const newHeight = Math.max(ELEMENT_CONSTRAINTS.MIN_SIZE, resizeState.value.startHeight + dy);

      resizeState.value.element.width = newWidth;
      resizeState.value.element.height = newHeight;
    }

    event.preventDefault();
  };

  /**
   * Stop resizing
   */
  const stopResize = () => {
    if (resizeState.value.isResizing) {
      onResizeEnd?.();
    }

    resizeState.value.isResizing = false;
    resizeState.value.element = null;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';

    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
  };

  return {
    resizeState,
    startResize,
    stopResize,
  };
};
