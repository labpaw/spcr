import { ref, computed } from 'vue';
import type { SpacerElement } from '~/types';

interface GuideLine {
  type: 'horizontal' | 'vertical' | 'spacing';
  position: number; // Percentage position
  label?: string;
  // For spacing guides
  start?: number;
  end?: number;
  axis?: 'x' | 'y';
}

const SNAP_THRESHOLD = 3; // Percentage threshold for snapping
const SPACING_THRESHOLD = 2; // Threshold for equal spacing detection
const Y_ALIGNMENT_THRESHOLD = 5; // Elements within 5% Y are considered "same row"

export const useSmartGuides = () => {
  const activeGuides = ref<GuideLine[]>([]);
  const isEnabled = ref(true);

  /**
   * Calculate equal spacing guides for horizontal distribution
   */
  const calculateSpacingGuides = (
    draggedElement: SpacerElement,
    otherElements: SpacerElement[],
    currentX: number,
    currentY: number,
  ): { spacingGuides: GuideLine[]; spacingSnapX: number | null } => {
    const spacingGuides: GuideLine[] = [];
    let spacingSnapX: number | null = null;

    // Find elements roughly on the same horizontal line (same Y)
    const sameRowElements = otherElements.filter((el) => Math.abs(el.y - currentY) < Y_ALIGNMENT_THRESHOLD);

    if (sameRowElements.length >= 2) {
      // Sort elements by X position (including the dragged one at current position)
      const allRowElements = [...sameRowElements, { ...draggedElement, x: currentX }];
      allRowElements.sort((a, b) => a.x - b.x);

      // Find the index of the dragged element
      const draggedIndex = allRowElements.findIndex((el) => el.id === draggedElement.id);

      // Calculate gaps between consecutive elements
      const gaps: { gap: number; startX: number; endX: number }[] = [];
      for (let i = 0; i < allRowElements.length - 1; i++) {
        const current = allRowElements[i];
        const next = allRowElements[i + 1];
        if (current && next) {
          const gap = next.x - current.x;
          gaps.push({
            gap,
            startX: current.x,
            endX: next.x,
          });
        }
      }

      // Check if we can create equal spacing
      if (gaps.length >= 2) {
        // Find gaps that don't involve the dragged element
        const fixedGaps = gaps.filter((_, i) => i !== draggedIndex - 1 && i !== draggedIndex);

        if (fixedGaps.length > 0 && fixedGaps[0]) {
          // Use the first fixed gap as reference
          const referenceGap = fixedGaps[0].gap;

          // Calculate where dragged element should be for equal spacing
          // Check left neighbor
          if (draggedIndex > 0) {
            const leftNeighbor = allRowElements[draggedIndex - 1];
            if (leftNeighbor) {
              const equalSpacingX = leftNeighbor.x + referenceGap;

              if (Math.abs(currentX - equalSpacingX) < SPACING_THRESHOLD) {
                spacingSnapX = equalSpacingX;
                // Add spacing indicator
                spacingGuides.push({
                  type: 'spacing',
                  position: (leftNeighbor.x + equalSpacingX) / 2,
                  start: leftNeighbor.x,
                  end: equalSpacingX,
                  axis: 'x',
                  label: '=',
                });
              }
            }
          }

          // Check right neighbor
          if (draggedIndex < allRowElements.length - 1 && spacingSnapX === null) {
            const rightNeighbor = allRowElements[draggedIndex + 1];
            if (rightNeighbor) {
              const equalSpacingX = rightNeighbor.x - referenceGap;

              if (Math.abs(currentX - equalSpacingX) < SPACING_THRESHOLD) {
                spacingSnapX = equalSpacingX;
                spacingGuides.push({
                  type: 'spacing',
                  position: (equalSpacingX + rightNeighbor.x) / 2,
                  start: equalSpacingX,
                  end: rightNeighbor.x,
                  axis: 'x',
                  label: '=',
                });
              }
            }
          }
        }
      }
    }

    return { spacingGuides, spacingSnapX };
  };

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

    // Check equal spacing FIRST (highest priority for distribution)
    const { spacingGuides, spacingSnapX } = calculateSpacingGuides(draggedElement, otherElements, currentX, currentY);
    if (spacingSnapX !== null) {
      guides.push(...spacingGuides);
      snapX = spacingSnapX;
    }

    // Check alignment with other elements
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
