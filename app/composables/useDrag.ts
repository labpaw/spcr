/**
 * Composable for handling drag functionality
 * Uses percentage-based positioning for responsive layouts
 */

import { ref } from 'vue';
import type { SpacerElement, DragState } from '~/types';

export const useDrag = (onDragEnd?: () => void) => {
  const dragState = ref<DragState>({
    isDragging: false,
    element: null,
    startX: 0,
    startY: 0,
    elementStartX: 0,
    elementStartY: 0,
  });

  /**
   * Start dragging an element
   */
  const startDrag = (element: SpacerElement, event: MouseEvent) => {
    dragState.value = {
      isDragging: true,
      element,
      startX: event.clientX,
      startY: event.clientY,
      elementStartX: element.x, // Already percentage
      elementStartY: element.y, // Already percentage
    };

    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);
  };

  /**
   * Handle drag movement
   * Convert pixel movement to percentage of viewport
   */
  const handleDrag = (event: MouseEvent) => {
    if (!dragState.value.isDragging || !dragState.value.element) return;

    // Calculate pixel delta
    const dx = event.clientX - dragState.value.startX;
    const dy = event.clientY - dragState.value.startY;

    // Convert to percentage of viewport
    const dxPercent = (dx / window.innerWidth) * 100;
    const dyPercent = (dy / window.innerHeight) * 100;

    // Update element position (as percentage)
    dragState.value.element.x = dragState.value.elementStartX + dxPercent;
    dragState.value.element.y = dragState.value.elementStartY + dyPercent;
  };

  /**
   * Stop dragging
   */
  const stopDrag = () => {
    if (dragState.value.isDragging) {
      onDragEnd?.();
    }
    dragState.value.isDragging = false;
    dragState.value.element = null;

    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
  };

  return {
    dragState,
    startDrag,
    stopDrag,
  };
};
