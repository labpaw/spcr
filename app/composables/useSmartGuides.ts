import { ref, computed } from 'vue';
import type { SpacerElement } from '~/types';

interface GuideLine {
  type: 'horizontal' | 'vertical';
  position: number; // Percentage position
  label?: string;
}

const SNAP_THRESHOLD = 2; // Percentage threshold for snapping

export const useSmartGuides = () => {
  const activeGuides = ref<GuideLine[]>([]);
  const isEnabled = ref(true);

  /**
   * Calculate guides while dragging an element
   */
  const calculateGuides = (
    draggedElement: SpacerElement,
    allElements: SpacerElement[],
    currentX: number,
    currentY: number,
  ): { guides: GuideLine[]; snapX: number | null; snapY: number | null } => {
    if (!isEnabled.value) {
      return { guides: [], snapX: null, snapY: null };
    }

    const guides: GuideLine[] = [];
    let snapX: number | null = null;
    let snapY: number | null = null;

    // Get other elements (not the dragged one)
    const otherElements = allElements.filter((el) => el.id !== draggedElement.id);

    // Canvas center guides (50%)
    if (Math.abs(currentX - 50) < SNAP_THRESHOLD) {
      guides.push({ type: 'vertical', position: 50, label: 'Center' });
      snapX = 50;
    }
    if (Math.abs(currentY - 50) < SNAP_THRESHOLD) {
      guides.push({ type: 'horizontal', position: 50, label: 'Middle' });
      snapY = 50;
    }

    // Check alignment with other elements
    for (const element of otherElements) {
      // Horizontal alignment (same Y)
      if (Math.abs(currentY - element.y) < SNAP_THRESHOLD) {
        guides.push({ type: 'horizontal', position: element.y });
        snapY = element.y;
      }

      // Vertical alignment (same X)
      if (Math.abs(currentX - element.x) < SNAP_THRESHOLD) {
        guides.push({ type: 'vertical', position: element.x });
        snapX = element.x;
      }
    }

    // Edge guides (5% and 95%)
    if (Math.abs(currentX - 5) < SNAP_THRESHOLD) {
      guides.push({ type: 'vertical', position: 5, label: 'Left' });
      snapX = 5;
    }
    if (Math.abs(currentX - 95) < SNAP_THRESHOLD) {
      guides.push({ type: 'vertical', position: 95, label: 'Right' });
      snapX = 95;
    }
    if (Math.abs(currentY - 5) < SNAP_THRESHOLD) {
      guides.push({ type: 'horizontal', position: 5, label: 'Top' });
      snapY = 5;
    }
    if (Math.abs(currentY - 95) < SNAP_THRESHOLD) {
      guides.push({ type: 'horizontal', position: 95, label: 'Bottom' });
      snapY = 95;
    }

    activeGuides.value = guides;
    return { guides, snapX, snapY };
  };

  /**
   * Clear all guides
   */
  const clearGuides = () => {
    activeGuides.value = [];
  };

  /**
   * Toggle smart guides
   */
  const toggleGuides = () => {
    isEnabled.value = !isEnabled.value;
    if (!isEnabled.value) {
      clearGuides();
    }
  };

  return {
    activeGuides,
    isEnabled,
    calculateGuides,
    clearGuides,
    toggleGuides,
  };
};
