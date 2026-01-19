/**
 * Composable for undo/redo history management
 * Maintains a stack of states for reversible operations
 */

import { ref, computed } from 'vue';
import type { SpacerElement } from '~/types';

const MAX_HISTORY_SIZE = 50;

interface HistoryState {
  elements: SpacerElement[];
  timestamp: number;
}

// Global history state (shared across composable instances)
const historyStack = ref<HistoryState[]>([]);
const currentIndex = ref(-1);
const isUndoRedoAction = ref(false);

export const useHistory = () => {
  /**
   * Check if undo is available
   */
  const canUndo = computed(() => currentIndex.value > 0);

  /**
   * Check if redo is available
   */
  const canRedo = computed(() => currentIndex.value < historyStack.value.length - 1);

  /**
   * Record the current state BEFORE making a change
   * Call this before any destructive operation
   */
  const recordState = (elements: SpacerElement[]) => {
    if (isUndoRedoAction.value) return;

    // Create a deep copy of the current elements
    const state: HistoryState = {
      elements: JSON.parse(JSON.stringify(elements)),
      timestamp: Date.now(),
    };

    // If we're not at the end of the stack, remove all future states
    if (currentIndex.value < historyStack.value.length - 1) {
      historyStack.value = historyStack.value.slice(0, currentIndex.value + 1);
    }

    // Add the new state
    historyStack.value.push(state);

    // Limit history size
    if (historyStack.value.length > MAX_HISTORY_SIZE) {
      historyStack.value.shift();
    } else {
      currentIndex.value++;
    }
  };

  /**
   * Push a new state to history (alias for recordState)
   * @deprecated Use recordState instead for clarity
   */
  const pushState = (elements: SpacerElement[]) => {
    recordState(elements);
  };

  /**
   * Undo - go back one state
   * Returns the previous state's elements or null if can't undo
   */
  const undo = (): SpacerElement[] | null => {
    if (!canUndo.value) return null;

    isUndoRedoAction.value = true;
    currentIndex.value--;
    const state = historyStack.value[currentIndex.value];
    return state ? JSON.parse(JSON.stringify(state.elements)) : null;
  };

  /**
   * Redo - go forward one state
   * Returns the next state's elements or null if can't redo
   */
  const redo = (): SpacerElement[] | null => {
    if (!canRedo.value) return null;

    isUndoRedoAction.value = true;
    currentIndex.value++;
    const state = historyStack.value[currentIndex.value];
    return state ? JSON.parse(JSON.stringify(state.elements)) : null;
  };

  /**
   * Clear all history
   */
  const clearHistory = () => {
    historyStack.value = [];
    currentIndex.value = -1;
  };

  /**
   * Initialize history with current state
   */
  const initHistory = (elements: SpacerElement[]) => {
    if (historyStack.value.length === 0) {
      const state: HistoryState = {
        elements: JSON.parse(JSON.stringify(elements)),
        timestamp: Date.now(),
      };
      historyStack.value.push(state);
      currentIndex.value = 0;
    }
  };

  /**
   * Get current history info for debugging
   */
  const historyInfo = computed(() => ({
    total: historyStack.value.length,
    current: currentIndex.value + 1,
    canUndo: canUndo.value,
    canRedo: canRedo.value,
  }));

  return {
    canUndo,
    canRedo,
    pushState,
    recordState,
    undo,
    redo,
    clearHistory,
    initHistory,
    historyInfo,
  };
};
