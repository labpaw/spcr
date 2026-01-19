import { ref, computed } from 'vue';
import type { SpacerElement } from '~/types';

interface GuideLine {
  type: 'horizontal' | 'vertical';
  position: number; // Percentage position
  label?: string;
}

const SNAP_THRESHOLD = 3; // Percentage threshold for snapping (increased for better detection)

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

    // Check alignment with other elements FIRST (higher priority)
    for (const element of otherElements) {
      // Vertical alignment (same X) - for centering elements horizontally
      if (Math.abs(currentX - element.x) < SNAP_THRESHOLD && snapX === null) {
        guides.push({ type: 'vertical', position: element.x, label: 'Align' });
        snapX = element.x;
      }

      // Horizontal alignment (same Y) - for aligning elements vertically
      if (Math.abs(currentY - element.y) < SNAP_THRESHOLD && snapY === null) {
        guides.push({ type: 'horizontal', position: element.y, label: 'Align' });
        snapY = element.y;
      }
    }

    // Canvas center guides (50%) - only if not already snapping to element
    if (snapX === null && Math.abs(currentX - 50) < SNAP_THRESHOLD) {
      guides.push({ type: 'vertical', position: 50, label: 'Center' });
      snapX = 50;
    }
    if (snapY === null && Math.abs(currentY - 50) < SNAP_THRESHOLD) {
      guides.push({ type: 'horizontal', position: 50, label: 'Middle' });
      snapY = 50;
    }

    // Edge guides (5% and 95%)
    if (snapX === null && Math.abs(currentX - 5) < SNAP_THRESHOLD) {
      guides.push({ type: 'vertical', position: 5, label: 'Left' });
      snapX = 5;
    }
    if (snapX === null && Math.abs(currentX - 95) < SNAP_THRESHOLD) {
      guides.push({ type: 'vertical', position: 95, label: 'Right' });
      snapX = 95;
    }
    if (snapY === null && Math.abs(currentY - 5) < SNAP_THRESHOLD) {
      guides.push({ type: 'horizontal', position: 5, label: 'Top' });
      snapY = 5;
    }
    if (snapY === null && Math.abs(currentY - 95) < SNAP_THRESHOLD) {
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
