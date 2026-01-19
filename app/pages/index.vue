<template>
  <div
    class="spacer-canvas"
    @mousedown="handleCanvasMouseDown"
    @mousemove="handleCanvasMouseMove"
    @mouseup="handleCanvasMouseUp"
    @click="handleCanvasClick"
    @contextmenu.prevent="handleContextMenu"
    ref="canvasRef"
  >
    <!-- Background Layer (separate so blur doesn't affect content) -->
    <div class="background-layer" :style="{ ...backgroundStyle, ...blurStyle }"></div>

    <!-- Canvas Elements -->
    <div
      v-for="element in elements"
      :key="element.id"
      :class="[
        'group cursor-move select-none min-w-[100px]',
        { 'cursor-auto': editingId === element.id },
        { 'element-selected': isSelected(element.id) && editingId !== element.id },
      ]"
      :style="{
        left: `${element.x}%`,
        top: `${element.y}%`,
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
      }"
      @mousedown.stop="handleMouseDown(element, $event)"
      @touchstart.stop="handleTouchStart(element, $event)"
      @click.stop="handleElementClick(element, $event)"
      @dblclick.stop="handleElementDblClick(element)"
      @contextmenu.prevent.stop="handleElementContextMenu(element, $event)"
    >
      <!-- Text Element -->
      <TextElement
        v-if="element.type === 'text'"
        :element="element"
        :is-editing="editingId === element.id"
        @stop-edit="stopEdit"
      />

      <!-- Link Element -->
      <LinkElement
        v-if="element.type === 'link'"
        :element="element"
        :is-editing="editingId === element.id"
        @stop-edit="stopEdit"
      />

      <!-- Image Element -->
      <ImageElement
        v-if="element.type === 'image'"
        :element="element"
        :is-editing="editingId === element.id"
        @start-edit="startEdit(element)"
        @stop-edit="stopEdit"
        @resize="(event, imageEl) => handleResize(element, event, imageEl)"
      />

      <!-- Shape Element -->
      <ShapeElement v-if="element.type === 'shape'" :element="element" @resize="handleShapeResize(element, $event)" />
    </div>

    <!-- Selection Box -->
    <SelectionBox :visible="isSelecting" :rect="normalizedRect" />

    <!-- Type Selector -->
    <TypeSelector
      :visible="showTypeSelector"
      :position="selectorPosition"
      @select="handleAddElement"
      @select-shape="handleAddShape"
    />

    <!-- Context Menu (Canvas) -->
    <ContextMenu
      :visible="showContextMenu && !contextMenuElement"
      :position="contextMenuPosition"
      :can-undo="canUndo"
      :can-redo="canRedo"
      @select-background="openBackgroundModal"
      @undo="handleContextMenuUndo"
      @redo="handleContextMenuRedo"
    />

    <!-- Image Context Menu -->
    <ImageContextMenu
      :visible="showContextMenu && contextMenuElement?.type === 'image'"
      :position="contextMenuPosition"
      :is-locked="contextMenuElement?.type === 'image' ? (contextMenuElement as ImageElementType).locked : false"
      @select-shape="openShapeModal"
      @toggle-lock="handleToggleLock"
      @delete="handleDeleteElement"
    />

    <!-- Shape Context Menu -->
    <ShapeContextMenu
      :visible="showContextMenu && contextMenuElement?.type === 'shape'"
      :position="contextMenuPosition"
      @add-cover-image="openCoverImageModal"
      @delete="handleDeleteElement"
    />

    <!-- Element Context Menu (Text/Link) -->
    <ElementContextMenu
      :visible="
        showContextMenu &&
        !!contextMenuElement &&
        (contextMenuElement.type === 'text' || contextMenuElement.type === 'link')
      "
      :position="contextMenuPosition"
      @edit="handleEditElement"
      @delete="handleDeleteElement"
    />

    <!-- Background Modal -->
    <BackgroundModal
      :visible="showBgModal"
      :themes="BACKGROUND_THEMES"
      :current-background="canvasBackground"
      :blur="backgroundBlur"
      :blur-amount="blurAmount"
      @close="showBgModal = false"
      @select="handleBackgroundSelect"
      @update:blur="setBlur"
      @update:blur-amount="setBlurAmount"
    />

    <!-- Shape Modal -->
    <ShapeModal
      v-if="contextMenuElement?.type === 'image'"
      :visible="showShapeModal"
      :current-border-radius="(contextMenuElement as ImageElementType).borderRadius || 8"
      @close="showShapeModal = false"
      @select="handleShapeSelect"
    />

    <!-- Cover Image Modal -->
    <CoverImageModal
      v-if="contextMenuElement?.type === 'shape'"
      :visible="showCoverImageModal"
      :current-image="(contextMenuElement as ShapeElementType).coverImage"
      @close="showCoverImageModal = false"
      @apply="handleCoverImageApply"
      @remove="handleCoverImageRemove"
    />

    <!-- Smart Guides -->
    <SmartGuides :guides="activeGuides" />

    <!-- Info Panel -->
    <InfoPanel ref="infoPanelRef" />
  </div>

  <!-- Floating Toolbar (outside canvas for proper positioning) -->
  <FloatingToolbar @align="handleAlign" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import type {
  SpacerElement,
  Position,
  ElementType,
  ImageElement as ImageElementType,
  ShapeType,
  ShapeElement as ShapeElementType,
} from '~/types';
import { BACKGROUND_THEMES } from '~/config/constants';
import { useElements } from '~/composables/useElements';
import { useBackground } from '~/composables/useBackground';
import { useDrag } from '~/composables/useDrag';
import { useResize } from '~/composables/useResize';
import { useSelectionBox } from '~/composables/useSelectionBox';
import { useHistory } from '~/composables/useHistory';
import TextElement from '~/components/canvas/TextElement.vue';
import LinkElement from '~/components/canvas/LinkElement.vue';
import ImageElement from '~/components/canvas/ImageElement.vue';
import ShapeElement from '~/components/canvas/ShapeElement.vue';
import TypeSelector from '~/components/ui/TypeSelector.vue';
import ContextMenu from '~/components/ui/ContextMenu.vue';
import ImageContextMenu from '~/components/ui/ImageContextMenu.vue';
import ShapeContextMenu from '~/components/ui/ShapeContextMenu.vue';
import ElementContextMenu from '~/components/ui/ElementContextMenu.vue';
import BackgroundModal from '~/components/ui/BackgroundModal.vue';
import ShapeModal from '~/components/ui/ShapeModal.vue';
import CoverImageModal from '~/components/ui/CoverImageModal.vue';
import InfoPanel from '~/components/ui/InfoPanel.vue';
import FloatingToolbar from '~/components/ui/FloatingToolbar.vue';
import SmartGuides from '~/components/ui/SmartGuides.vue';
import SelectionBox from '~/components/ui/SelectionBox.vue';
import { useSmartGuides } from '~/composables/useSmartGuides';

// Refs
const canvasRef = ref<HTMLElement | null>(null);
const infoPanelRef = ref<InstanceType<typeof InfoPanel> | null>(null);
const editingId = ref<number | null>(null);

// Selection box tracking
const selectionStarted = ref(false);
const didDragSelect = ref(false);

// UI State
const showTypeSelector = ref(false);
const selectorPosition = ref<Position>({ x: 0, y: 0 });
const showContextMenu = ref(false);
const contextMenuPosition = ref<Position>({ x: 0, y: 0 });
const contextMenuElement = ref<SpacerElement | null>(null);
const showBgModal = ref(false);
const showShapeModal = ref(false);
const showCoverImageModal = ref(false);

// Composables
const { elements, loadElements, saveElements, addElement, deleteElement } = useElements();
const { canUndo, canRedo, pushState, recordState, undo, redo, initHistory } = useHistory();
const {
  canvasBackground,
  backgroundBlur,
  blurAmount,
  backgroundStyle,
  blurStyle,
  setBackground,
  setBlur,
  setBlurAmount,
} = useBackground();
const { activeGuides, calculateGuides, clearGuides } = useSmartGuides();
const {
  isSelecting,
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
} = useSelectionBox();
const { dragState, startDrag, startTouchDrag, stopDrag } = useDrag({
  onDragEnd: () => {
    clearGuides();
    saveElements();
  },
  onDragMove: (element, x, y) => {
    const result = calculateGuides(element, elements.value, x, y);
    return { snapX: result.snapX ?? undefined, snapY: result.snapY ?? undefined };
  },
});
const { startResize } = useResize(saveElements);

/**
 * Save elements with history tracking
 */
const saveWithHistory = () => {
  saveElements();
  pushState(elements.value);
};

/**
 * Handle undo action
 */
const handleUndo = () => {
  const previousState = undo();
  if (previousState) {
    elements.value.length = 0;
    elements.value.push(...previousState);
    saveElements();
    clearSelection();
  }
};

/**
 * Handle redo action
 */
const handleRedo = () => {
  const nextState = redo();
  if (nextState) {
    elements.value.length = 0;
    elements.value.push(...nextState);
    saveElements();
    clearSelection();
  }
};

/**
 * Handle undo from context menu
 */
const handleContextMenuUndo = () => {
  handleUndo();
  showContextMenu.value = false;
};

/**
 * Handle redo from context menu
 */
const handleContextMenuRedo = () => {
  handleRedo();
  showContextMenu.value = false;
};

// Lifecycle
onMounted(() => {
  loadElements();
  // Initialize history with loaded elements
  nextTick(() => {
    initHistory(elements.value);
  });
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

/**
 * Handle keyboard events
 */
const handleKeyDown = (e: KeyboardEvent) => {
  const activeElement = document.activeElement;
  const isInputFocused = activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA';

  if (isInputFocused) return;

  // Undo (Cmd/Ctrl + Z)
  if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
    e.preventDefault();
    handleUndo();
    return;
  }

  // Redo (Cmd/Ctrl + Shift + Z) or (Cmd/Ctrl + Y)
  if ((e.metaKey || e.ctrlKey) && ((e.key === 'z' && e.shiftKey) || e.key === 'y')) {
    e.preventDefault();
    handleRedo();
    return;
  }

  // Delete selected elements
  if (e.key === 'Backspace' || e.key === 'Delete') {
    if (selectedIds.value.size > 0) {
      e.preventDefault();
      // Record state BEFORE deleting
      recordState(elements.value);
      // Delete all selected elements
      for (const id of selectedArray.value) {
        deleteElement(id);
      }
      clearSelection();
      saveElements();
    }
  }

  // Select all (Cmd/Ctrl + A)
  if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
    e.preventDefault();
    for (const el of elements.value) {
      selectedIds.value.add(el.id);
    }
  }

  // Escape to clear selection
  if (e.key === 'Escape') {
    clearSelection();
    editingId.value = null;
  }
};

/**
 * Handle canvas mouse down - start selection box
 */
const handleCanvasMouseDown = (e: MouseEvent) => {
  // Only start selection if clicking directly on canvas (not on element)
  if (e.target !== canvasRef.value && !(e.target as HTMLElement).classList.contains('background-layer')) {
    return;
  }

  const rect = canvasRef.value?.getBoundingClientRect();
  if (!rect) return;

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  selectionStarted.value = true;
  didDragSelect.value = false;
  startSelection(x, y, e.shiftKey);
};

/**
 * Handle canvas mouse move - update selection box
 */
const handleCanvasMouseMove = (e: MouseEvent) => {
  if (!selectionStarted.value) return;

  const rect = canvasRef.value?.getBoundingClientRect();
  if (!rect) return;

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  updateSelection(x, y);

  // Check if we've dragged enough to consider it a selection
  if (normalizedRect.value && (normalizedRect.value.width > 5 || normalizedRect.value.height > 5)) {
    didDragSelect.value = true;
  }
};

/**
 * Handle canvas mouse up - end selection box
 */
const handleCanvasMouseUp = (e: MouseEvent) => {
  if (!selectionStarted.value) return;

  const rect = canvasRef.value?.getBoundingClientRect();
  if (rect) {
    endSelection(elements.value, rect);
  }

  selectionStarted.value = false;
};

/**
 * Handle canvas click (for type selector - only if not drag-selecting)
 */
const handleCanvasClick = (e: MouseEvent) => {
  // If we did a drag selection, don't open type selector
  if (didDragSelect.value) {
    didDragSelect.value = false;
    return;
  }

  // Close context menu if open
  if (showContextMenu.value) {
    showContextMenu.value = false;
    showBgModal.value = false;
    return;
  }

  // Close background modal if open
  if (showBgModal.value) {
    showBgModal.value = false;
    return;
  }

  // If type selector is already open, close it
  if (showTypeSelector.value) {
    showTypeSelector.value = false;
    return;
  }

  if (editingId.value) {
    stopEdit();
    return;
  }

  // Close info panel if open
  if (infoPanelRef.value?.isOpen) {
    infoPanelRef.value.togglePanel();
    return;
  }

  // Clear selection when clicking on empty canvas
  clearSelection();

  // Get click position relative to canvas
  const rect = canvasRef.value?.getBoundingClientRect();
  if (!rect) return;

  selectorPosition.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
  showTypeSelector.value = true;
};

/**
 * Handle context menu (right-click on canvas)
 */
const handleContextMenu = (e: MouseEvent) => {
  showTypeSelector.value = false;
  showBgModal.value = false;
  contextMenuElement.value = null;
  if (infoPanelRef.value?.isOpen) {
    infoPanelRef.value.togglePanel();
  }

  const rect = canvasRef.value?.getBoundingClientRect();
  if (!rect) return;

  contextMenuPosition.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
  showContextMenu.value = true;
};

/**
 * Handle context menu on element (right-click on element)
 */
const handleElementContextMenu = (element: SpacerElement, e: MouseEvent) => {
  showTypeSelector.value = false;
  showBgModal.value = false;
  contextMenuElement.value = element;
  if (infoPanelRef.value?.isOpen) {
    infoPanelRef.value.togglePanel();
  }

  const rect = canvasRef.value?.getBoundingClientRect();
  if (!rect) return;

  contextMenuPosition.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
  showContextMenu.value = true;
};

/**
 * Handle adding new element
 */
const handleAddElement = (type: ElementType) => {
  const rect = canvasRef.value?.getBoundingClientRect();
  if (!rect) return;

  const percentPosition = {
    x: (selectorPosition.value.x / rect.width) * 100,
    y: (selectorPosition.value.y / rect.height) * 100,
  };

  const newElement = addElement(type, percentPosition);
  showTypeSelector.value = false;

  nextTick(() => {
    startEdit(newElement);
  });
};

/**
 * Handle mouse down on element
 */
const handleMouseDown = (element: SpacerElement, e: MouseEvent) => {
  showTypeSelector.value = false;

  if (editingId.value === element.id) return;

  if (element.type === 'image' && (element as ImageElementType).locked) {
    return;
  }

  startDrag(element, e);
};

/**
 * Handle touch start on element (mobile)
 */
const handleTouchStart = (element: SpacerElement, e: TouchEvent) => {
  showTypeSelector.value = false;

  if (editingId.value === element.id) return;

  if (element.type === 'image' && (element as ImageElementType).locked) {
    return;
  }

  startTouchDrag(element, e);
};

/**
 * Handle element click (single-click to select)
 */
const handleElementClick = (element: SpacerElement, e: MouseEvent) => {
  if (dragState.value.isDragging) return;
  if (editingId.value === element.id) return;

  // Shift+click for multi-select
  if (e.shiftKey) {
    toggleSelection(element.id, true);
  } else {
    selectSingle(element.id);
  }
  editingId.value = null;
};

/**
 * Handle element double-click (to edit text/link)
 */
const handleElementDblClick = (element: SpacerElement) => {
  if (dragState.value.isDragging) return;

  selectSingle(element.id);
  startEdit(element);
};

/**
 * Start editing an element
 */
const startEdit = (element: SpacerElement) => {
  if (dragState.value.isDragging) return;
  editingId.value = element.id;
  selectSingle(element.id);
};

/**
 * Stop editing
 */
const stopEdit = () => {
  editingId.value = null;
  saveElements();
};

/**
 * Handle image resize
 */
const handleResize = (element: SpacerElement, event: MouseEvent, imageEl: HTMLImageElement) => {
  if (element.type === 'image') {
    startResize(element as ImageElementType, event, imageEl);
  }
};

/**
 * Open background modal
 */
const openBackgroundModal = () => {
  showContextMenu.value = false;
  showBgModal.value = true;
};

/**
 * Handle background selection
 */
const handleBackgroundSelect = (value: string) => {
  setBackground(value);
  showBgModal.value = false;
};

/**
 * Open shape modal
 */
const openShapeModal = () => {
  showContextMenu.value = false;
  showShapeModal.value = true;
};

/**
 * Handle shape selection
 */
const handleShapeSelect = (borderRadius: number) => {
  if (contextMenuElement.value && contextMenuElement.value.type === 'image') {
    (contextMenuElement.value as ImageElementType).borderRadius = borderRadius;
    saveElements();
  }
  showShapeModal.value = false;
  contextMenuElement.value = null;
};

/**
 * Handle adding a shape element
 */
const handleAddShape = (shapeType: ShapeType) => {
  const rect = canvasRef.value?.getBoundingClientRect();
  if (!rect) return;

  const percentPosition = {
    x: (selectorPosition.value.x / rect.width) * 100,
    y: (selectorPosition.value.y / rect.height) * 100,
  };

  addElement('shape', percentPosition, shapeType);
  showTypeSelector.value = false;
};

/**
 * Handle shape element resize
 */
const handleShapeResize = (element: SpacerElement, event: MouseEvent) => {
  if (element.type !== 'shape') return;

  const shapeEl = element as ShapeElementType;
  const startX = event.clientX;
  const startY = event.clientY;
  const startWidth = shapeEl.width;
  const startHeight = shapeEl.height;

  const onMouseMove = (e: MouseEvent) => {
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    const delta = Math.max(deltaX, deltaY);

    shapeEl.width = Math.max(20, startWidth + delta);
    shapeEl.height = Math.max(20, startHeight + delta);
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    saveElements();
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

/**
 * Open cover image modal
 */
const openCoverImageModal = () => {
  showContextMenu.value = false;
  showCoverImageModal.value = true;
};

/**
 * Handle cover image apply
 */
const handleCoverImageApply = (url: string) => {
  if (contextMenuElement.value && contextMenuElement.value.type === 'shape') {
    (contextMenuElement.value as ShapeElementType).coverImage = url;
    saveElements();
  }
  showCoverImageModal.value = false;
  contextMenuElement.value = null;
};

/**
 * Handle cover image remove
 */
const handleCoverImageRemove = () => {
  if (contextMenuElement.value && contextMenuElement.value.type === 'shape') {
    (contextMenuElement.value as ShapeElementType).coverImage = undefined;
    saveElements();
  }
  showCoverImageModal.value = false;
  contextMenuElement.value = null;
};

/**
 * Handle toggle lock for images
 */
const handleToggleLock = () => {
  if (contextMenuElement.value && contextMenuElement.value.type === 'image') {
    const img = contextMenuElement.value as ImageElementType;
    img.locked = !img.locked;
    saveElements();
  }
  showContextMenu.value = false;
  contextMenuElement.value = null;
};

/**
 * Handle edit element from context menu
 */
const handleEditElement = () => {
  if (contextMenuElement.value) {
    startEdit(contextMenuElement.value);
  }
  showContextMenu.value = false;
};

/**
 * Handle delete element from context menu
 */
const handleDeleteElement = () => {
  if (contextMenuElement.value) {
    // Record state BEFORE deleting
    recordState(elements.value);
    deleteElement(contextMenuElement.value.id);
    saveElements();
  }
  showContextMenu.value = false;
  contextMenuElement.value = null;
};

/**
 * Handle element alignment from toolbar
 */
type AlignmentType = 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom';

const handleAlign = (alignment: AlignmentType) => {
  if (selectedIds.value.size === 0) return;

  // Align all selected elements
  for (const id of selectedArray.value) {
    const element = elements.value.find((el) => el.id === id);
    if (!element) continue;

    switch (alignment) {
      case 'left':
        element.x = 5;
        break;
      case 'center':
        element.x = 50;
        break;
      case 'right':
        element.x = 95;
        break;
      case 'top':
        element.y = 5;
        break;
      case 'middle':
        element.y = 50;
        break;
      case 'bottom':
        element.y = 95;
        break;
    }
  }

  saveElements();
};
</script>

<style scoped>
.spacer-canvas {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  cursor: crosshair;
}

.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  pointer-events: none;
}

/* Selected element indicator - shadcn style */
.element-selected {
  outline: 1.5px dashed rgba(59, 130, 246, 0.5);
  outline-offset: 6px;
  border-radius: 6px;
}
</style>
