/**
 * Composable for managing canvas elements
 */

import { ref } from 'vue';
import type { SpacerElement, ElementType, Position } from '~/types';
import { STORAGE_KEYS } from '~/config/constants';

export const useElements = () => {
  const elements = ref<SpacerElement[]>([]);

  /**
   * Load elements from localStorage
   */
  const loadElements = () => {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem(STORAGE_KEYS.ELEMENTS);
    if (saved) {
      try {
        elements.value = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load saved elements:', e);
      }
    }
  };

  /**
   * Save elements to localStorage
   */
  const saveElements = () => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ELEMENTS, JSON.stringify(elements.value));
  };

  /**
   * Add a new element
   * Position is passed as percentages (0-100)
   */
  const addElement = (type: ElementType, position: Position, shapeType?: 'circle' | 'square') => {
    let newElement: SpacerElement;

    if (type === 'shape') {
      newElement = {
        id: Date.now(),
        type: 'shape',
        x: position.x, // Already percentage
        y: position.y, // Already percentage
        shapeType: shapeType || 'square',
        width: 8, // Percentage of viewport width
        height: 8, // Will be calculated as same as width for aspect ratio
        color: '#3b82f6',
      };
    } else {
      newElement = {
        id: Date.now(),
        type,
        x: position.x, // Already percentage
        y: position.y, // Already percentage
        content: '',
        url: '',
      } as SpacerElement;
    }

    elements.value.push(newElement);
    saveElements();
    return newElement;
  };

  /**
   * Delete an element by ID
   */
  const deleteElement = (id: number) => {
    elements.value = elements.value.filter((el) => el.id !== id);
    saveElements();
  };

  /**
   * Update an element
   */
  const updateElement = (id: number, updates: Partial<SpacerElement>) => {
    const index = elements.value.findIndex((el) => el.id === id);
    if (index !== -1) {
      elements.value[index] = { ...elements.value[index], ...updates } as SpacerElement;
      saveElements();
    }
  };

  /**
   * Get element by ID
   */
  const getElementById = (id: number) => {
    return elements.value.find((el) => el.id === id);
  };

  return {
    elements,
    loadElements,
    saveElements,
    addElement,
    deleteElement,
    updateElement,
    getElementById,
  };
};
