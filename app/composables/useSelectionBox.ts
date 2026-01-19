/**
 * Composable for handling drag-to-select (marquee selection)
 * Allows selecting multiple elements by drawing a selection rectangle
 */

import { ref, computed } from 'vue';
import type { SpacerElement } from '~/types';

interface SelectionRect {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

export const useSelectionBox = () => {
  const isSelecting = ref(false);
  const selectionRect = ref<SelectionRect | null>(null);
  const selectedIds = ref<Set<number>>(new Set());

  /**
   * Get the normalized rectangle (handles drag in any direction)
   */
  const normalizedRect = computed(() => {
    if (!selectionRect.value) return null;

    const { startX, startY, currentX, currentY } = selectionRect.value;

    return {
      left: Math.min(startX, currentX),
      top: Math.min(startY, currentY),
      width: Math.abs(currentX - startX),
      height: Math.abs(currentY - startY),
      right: Math.max(startX, currentX),
      bottom: Math.max(startY, currentY),
    };
  });

  /**
   * Start selection at a point
   */
  const startSelection = (x: number, y: number, additive = false) => {
    isSelecting.value = true;
    selectionRect.value = {
      startX: x,
      startY: y,
      currentX: x,
      currentY: y,
    };

    // If not additive (shift key), clear previous selection
    if (!additive) {
      selectedIds.value.clear();
    }
  };

  /**
   * Update selection rectangle during drag
   */
  const updateSelection = (x: number, y: number) => {
    if (!isSelecting.value || !selectionRect.value) return;

    selectionRect.value.currentX = x;
    selectionRect.value.currentY = y;
  };

  /**
   * End selection and calculate which elements are selected
   */
  const endSelection = (elements: SpacerElement[], canvasRect: DOMRect) => {
    if (!isSelecting.value || !normalizedRect.value) {
      isSelecting.value = false;
      selectionRect.value = null;
      return;
    }

    const rect = normalizedRect.value;

    // Only process if we have a meaningful selection area (not just a click)
    if (rect.width > 5 && rect.height > 5) {
      // Convert selection rect from pixels to percentages
      const selectLeft = (rect.left / canvasRect.width) * 100;
      const selectTop = (rect.top / canvasRect.height) * 100;
      const selectRight = (rect.right / canvasRect.width) * 100;
      const selectBottom = (rect.bottom / canvasRect.height) * 100;

      // Check each element for intersection
      for (const element of elements) {
        // Element position is at center, so we need to estimate bounds
        // For simplicity, we'll use a small tolerance around the center point
        const elementX = element.x;
        const elementY = element.y;

        // Check if element center is within selection rectangle
        if (elementX >= selectLeft && elementX <= selectRight && elementY >= selectTop && elementY <= selectBottom) {
          selectedIds.value.add(element.id);
        }
      }
    }

    isSelecting.value = false;
    selectionRect.value = null;
  };

  /**
   * Clear all selections
   */
  const clearSelection = () => {
    selectedIds.value.clear();
  };

  /**
   * Toggle selection of a single element
   */
  const toggleSelection = (id: number, additive = false) => {
    if (additive) {
      if (selectedIds.value.has(id)) {
        selectedIds.value.delete(id);
      } else {
        selectedIds.value.add(id);
      }
    } else {
      selectedIds.value.clear();
      selectedIds.value.add(id);
    }
  };

  /**
   * Select a single element (replacing any existing selection)
   */
  const selectSingle = (id: number) => {
    selectedIds.value.clear();
    selectedIds.value.add(id);
  };

  /**
   * Check if an element is selected
   */
  const isSelected = (id: number) => {
    return selectedIds.value.has(id);
  };

  /**
   * Get array of selected IDs
   */
  const selectedArray = computed(() => Array.from(selectedIds.value));

  return {
    isSelecting,
    selectionRect,
    normalizedRect,
    selectedIds,
    selectedArray,
    startSelection,
    updateSelection,
    endSelection,
    clearSelection,
    toggleSelection,
    selectSingle,
    isSelected,
  };
};
