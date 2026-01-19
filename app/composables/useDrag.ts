/**
 * Composable for handling drag functionality
 * Uses percentage-based positioning for responsive layouts
 * Supports both mouse and touch events
 * Supports smart guides with snap functionality
 */

import { ref } from 'vue';
import type { SpacerElement, DragState } from '~/types';

interface DragCallbacks {
  onDragEnd?: () => void;
  onDragMove?: (element: SpacerElement, x: number, y: number) => { snapX?: number; snapY?: number } | void;
}

export const useDrag = (callbacks?: DragCallbacks | (() => void)) => {
  // Support both old and new callback format
  const onDragEnd = typeof callbacks === 'function' ? callbacks : callbacks?.onDragEnd;
  const onDragMove = typeof callbacks === 'function' ? undefined : callbacks?.onDragMove;

  const dragState = ref<DragState>({
    isDragging: false,
    element: null,
    startX: 0,
    startY: 0,
    elementStartX: 0,
    elementStartY: 0,
  });

  /**
   * Get coordinates from mouse or touch event
   */
  const getEventCoords = (event: MouseEvent | TouchEvent): { x: number; y: number } => {
    if ('touches' in event) {
      const touch = event.touches[0] ?? event.changedTouches[0];
      if (touch) {
        return { x: touch.clientX, y: touch.clientY };
      }
    }
    if ('clientX' in event) {
      return { x: event.clientX, y: event.clientY };
    }
    return { x: 0, y: 0 };
  };

  /**
   * Start dragging an element (mouse)
   */
  const startDrag = (element: SpacerElement, event: MouseEvent) => {
    const coords = getEventCoords(event);
    initDrag(element, coords.x, coords.y);

    document.addEventListener('mousemove', handleMouseDrag);
    document.addEventListener('mouseup', stopMouseDrag);
  };

  /**
   * Start dragging an element (touch)
   */
  const startTouchDrag = (element: SpacerElement, event: TouchEvent) => {
    event.preventDefault(); // Prevent scrolling
    const coords = getEventCoords(event);
    initDrag(element, coords.x, coords.y);

    document.addEventListener('touchmove', handleTouchDrag, { passive: false });
    document.addEventListener('touchend', stopTouchDrag);
    document.addEventListener('touchcancel', stopTouchDrag);
  };

  /**
   * Initialize drag state
   */
  const initDrag = (element: SpacerElement, startX: number, startY: number) => {
    dragState.value = {
      isDragging: true,
      element,
      startX,
      startY,
      elementStartX: element.x,
      elementStartY: element.y,
    };
  };

  /**
   * Handle drag movement
   */
  const handleDragMove = (clientX: number, clientY: number) => {
    if (!dragState.value.isDragging || !dragState.value.element) return;

    // Calculate pixel delta
    const dx = clientX - dragState.value.startX;
    const dy = clientY - dragState.value.startY;

    // Convert to percentage of viewport
    const dxPercent = (dx / window.innerWidth) * 100;
    const dyPercent = (dy / window.innerHeight) * 100;

    // Calculate new position
    let newX = dragState.value.elementStartX + dxPercent;
    let newY = dragState.value.elementStartY + dyPercent;

    // Call onDragMove callback for smart guides
    if (onDragMove) {
      const snapResult = onDragMove(dragState.value.element, newX, newY);
      if (snapResult) {
        if (snapResult.snapX !== undefined) newX = snapResult.snapX;
        if (snapResult.snapY !== undefined) newY = snapResult.snapY;
      }
    }

    // Update element position (as percentage)
    dragState.value.element.x = newX;
    dragState.value.element.y = newY;
  };

  /**
   * Handle mouse drag
   */
  const handleMouseDrag = (event: MouseEvent) => {
    handleDragMove(event.clientX, event.clientY);
  };

  /**
   * Handle touch drag
   */
  const handleTouchDrag = (event: TouchEvent) => {
    event.preventDefault(); // Prevent scrolling while dragging
    const coords = getEventCoords(event);
    handleDragMove(coords.x, coords.y);
  };

  /**
   * Stop dragging (cleanup)
   */
  const finishDrag = () => {
    if (dragState.value.isDragging) {
      onDragEnd?.();
    }
    dragState.value.isDragging = false;
    dragState.value.element = null;
  };

  /**
   * Stop mouse drag
   */
  const stopMouseDrag = () => {
    finishDrag();
    document.removeEventListener('mousemove', handleMouseDrag);
    document.removeEventListener('mouseup', stopMouseDrag);
  };

  /**
   * Stop touch drag
   */
  const stopTouchDrag = () => {
    finishDrag();
    document.removeEventListener('touchmove', handleTouchDrag);
    document.removeEventListener('touchend', stopTouchDrag);
    document.removeEventListener('touchcancel', stopTouchDrag);
  };

  /**
   * Legacy stopDrag for backward compatibility
   */
  const stopDrag = () => {
    stopMouseDrag();
    stopTouchDrag();
  };

  return {
    dragState,
    startDrag,
    startTouchDrag,
    stopDrag,
  };
};
