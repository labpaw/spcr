<template>
  <div class="spacer-canvas" @click="handleCanvasClick" @contextmenu.prevent="handleContextMenu" ref="canvasRef">
    <!-- Background Layer (separate so blur doesn't affect content) -->
    <div class="background-layer" :style="{ ...backgroundStyle, ...blurStyle }"></div>

    <!-- Canvas Elements -->
    <div
      v-for="element in elements"
      :key="element.id"
      :class="[
        'group cursor-move select-none transition-shadow duration-200 min-w-[100px] hover:shadow-sm',
        { 'cursor-auto shadow-lg': editingId === element.id },
      ]"
      :style="{
        left: `${element.x}%`,
        top: `${element.y}%`,
        position: 'absolute',
      }"
      @mousedown.stop="handleMouseDown(element, $event)"
      @touchstart.stop="handleTouchStart(element, $event)"
      @click.stop="handleElementClick(element)"
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

      <!-- Delete button -->
      <button
        class="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-red-500 text-white border-2 border-white text-xl leading-none cursor-pointer opacity-0 transition-all duration-200 flex items-center justify-center shadow-md group-hover:opacity-100 hover:bg-red-600 hover:scale-110"
        @click.stop="deleteElement(element.id)"
        title="Delete"
      >
        ×
      </button>
    </div>

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
      @select-background="openBackgroundModal"
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

    <!-- Info Panel -->
    <InfoPanel ref="infoPanelRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
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

// Refs
const canvasRef = ref<HTMLElement | null>(null);
const infoPanelRef = ref<InstanceType<typeof InfoPanel> | null>(null);
const editingId = ref<number | null>(null);

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
const { dragState, startDrag, startTouchDrag, stopDrag } = useDrag(saveElements);
const { startResize } = useResize(saveElements);

// Lifecycle
onMounted(() => {
  loadElements();
});

/**
 * Handle canvas click
 */
const handleCanvasClick = (e: MouseEvent) => {
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
  // Close other menus
  showTypeSelector.value = false;
  showBgModal.value = false;
  contextMenuElement.value = null; // Clear element context
  if (infoPanelRef.value?.isOpen) {
    infoPanelRef.value.togglePanel();
  }

  // Get click position relative to canvas
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
  // Close other menus
  showTypeSelector.value = false;
  showBgModal.value = false;
  contextMenuElement.value = element; // Store which element was right-clicked
  if (infoPanelRef.value?.isOpen) {
    infoPanelRef.value.togglePanel();
  }

  // Get click position relative to canvas
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
  // Convert pixel position to percentage
  const rect = canvasRef.value?.getBoundingClientRect();
  if (!rect) return;

  const percentPosition = {
    x: (selectorPosition.value.x / rect.width) * 100,
    y: (selectorPosition.value.y / rect.height) * 100,
  };

  const newElement = addElement(type, percentPosition);
  showTypeSelector.value = false;

  // Start editing the new element
  nextTick(() => {
    startEdit(newElement);
  });
};

/**
 * Handle mouse down on element
 */
const handleMouseDown = (element: SpacerElement, e: MouseEvent) => {
  // Close any open menus
  showTypeSelector.value = false;

  if (editingId.value === element.id) return;

  // Don't allow dragging locked elements
  if (element.type === 'image' && (element as ImageElementType).locked) {
    return;
  }

  startDrag(element, e);
};

/**
 * Handle touch start on element (mobile)
 */
const handleTouchStart = (element: SpacerElement, e: TouchEvent) => {
  // Close any open menus
  showTypeSelector.value = false;

  if (editingId.value === element.id) return;

  // Don't allow dragging locked elements
  if (element.type === 'image' && (element as ImageElementType).locked) {
    return;
  }

  startTouchDrag(element, e);
};

/**
 * Handle element click
 */
const handleElementClick = (element: SpacerElement) => {
  if (dragState.value.isDragging) return;
  startEdit(element);
};

/**
 * Start editing an element
 */
const startEdit = (element: SpacerElement) => {
  if (dragState.value.isDragging) return;
  editingId.value = element.id;
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
  // Convert pixel position to percentage
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
 * Handle delete element from context menu
 */
const handleDeleteElement = () => {
  if (contextMenuElement.value) {
    deleteElement(contextMenuElement.value.id);
  }
  showContextMenu.value = false;
  contextMenuElement.value = null;
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
</style>
