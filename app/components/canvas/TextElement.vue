<template>
  <div v-if="!isEditing" class="text-element whitespace-pre-wrap min-w-[50px]" :style="textStyles">
    {{ element.content || 'Click to edit' }}
  </div>
  <div v-else class="editing-container" @click.stop>
    <div class="textarea-wrapper" ref="textareaWrapper">
      <textarea
        v-model="element.content"
        ref="inputRef"
        class="text-input"
        :style="textStyles"
        placeholder="Type something..."
        @keydown.escape="$emit('stopEdit')"
      />
      <!-- Resize Handles -->
      <div class="resize-handle resize-left" @mousedown="startResize($event, 'left')"></div>
      <div class="resize-handle resize-right" @mousedown="startResize($event, 'right')"></div>
      <div class="resize-handle resize-bottom" @mousedown="startResize($event, 'bottom')"></div>
      <div class="resize-handle resize-bottom-right" @mousedown="startResize($event, 'bottom-right')"></div>
    </div>

    <!-- Ultra Minimal Toolbar -->
    <div class="toolbar">
      <button
        @click="element.fontWeight = element.fontWeight === 700 ? 400 : 700"
        :class="['tool-btn', { active: element.fontWeight >= 700 }]"
        title="Bold"
      >
        <span class="tool-icon">B</span>
      </button>

      <input type="number" v-model.number="element.fontSize" min="8" max="200" class="size-input" title="Font size" />

      <div class="color-picker-container">
        <button class="color-btn" @click="showColorPicker = !showColorPicker" title="Text color" type="button">
          <div class="color-circle" :style="{ background: element.fontColor || '#000000' }"></div>
        </button>
        <div v-show="showColorPicker" class="color-picker-popup" @click.stop>
          <UColorPicker v-model="localColor" />
          <div class="hex-input-row">
            <span class="hex-label">#</span>
            <input
              type="text"
              :value="localColor?.replace('#', '')"
              @input="handleHexInput"
              class="hex-input"
              maxlength="6"
              placeholder="000000"
            />
          </div>
        </div>
      </div>

      <button class="tool-btn more-btn" @click="showMore = !showMore" title="More options">
        <span class="tool-icon">⋯</span>
      </button>
    </div>

    <!-- Expanded Options -->
    <div v-if="showMore" class="more-options">
      <select v-model="element.fontFamily" class="font-select">
        <option v-for="font in availableFonts" :key="font" :value="font">
          {{ font }}
        </option>
      </select>
      <div class="weight-options">
        <button
          v-for="weight in fontWeights"
          :key="weight.value"
          @click="element.fontWeight = weight.value"
          :class="['weight-option', { active: element.fontWeight === weight.value }]"
        >
          {{ weight.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue';
import type { TextElement } from '~/types';

interface Props {
  element: TextElement;
  isEditing: boolean;
}

const props = defineProps<Props>();
defineEmits<{
  stopEdit: [];
}>();

const inputRef = ref<HTMLTextAreaElement | null>(null);
const textareaWrapper = ref<HTMLDivElement | null>(null);
const showMore = ref(false);
const showColorPicker = ref(false);

// Local color ref for color picker (ensures default value)
const localColor = ref('#000000');

// Resize functionality
const startResize = (e: MouseEvent, direction: string) => {
  e.preventDefault();
  e.stopPropagation();

  if (!textareaWrapper.value || !inputRef.value) return;

  const startX = e.clientX;
  const startY = e.clientY;
  const startWidth = textareaWrapper.value.offsetWidth;
  const startHeight = inputRef.value.offsetHeight;

  const onMouseMove = (moveEvent: MouseEvent) => {
    if (!textareaWrapper.value || !inputRef.value) return;

    const deltaX = moveEvent.clientX - startX;
    const deltaY = moveEvent.clientY - startY;

    if (direction.includes('right')) {
      const newWidth = Math.max(200, startWidth + deltaX);
      textareaWrapper.value.style.width = `${newWidth}px`;
      inputRef.value.style.width = `${newWidth}px`;
    }

    if (direction.includes('left')) {
      const newWidth = Math.max(200, startWidth - deltaX);
      textareaWrapper.value.style.width = `${newWidth}px`;
      inputRef.value.style.width = `${newWidth}px`;
    }

    if (direction.includes('bottom')) {
      const newHeight = Math.max(60, startHeight + deltaY);
      inputRef.value.style.height = `${newHeight}px`;
    }
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

// Sync local color with element
watch(
  () => props.element.fontColor,
  (newColor) => {
    if (newColor) localColor.value = newColor;
  },
  { immediate: true },
);

watch(localColor, (newColor) => {
  props.element.fontColor = newColor;
});

// Handle hex input
const handleHexInput = (e: Event) => {
  const input = e.target as HTMLInputElement;
  let value = input.value.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
  if (value.length > 6) value = value.substring(0, 6);
  if (value.length === 6 || value.length === 3) {
    localColor.value = '#' + value;
  }
};

// Font weights for quick selection
const fontWeights = [
  { value: 300, label: 'Light', short: 'L' },
  { value: 400, label: 'Regular', short: 'R' },
  { value: 600, label: 'Semi Bold', short: 'SB' },
  { value: 700, label: 'Bold', short: 'B' },
];

// Available Google Fonts - organized by category
const availableFonts = [
  // Sans-Serif (Clean, Modern)
  'Inter',
  'Roboto',
  'Open Sans',
  'Montserrat',
  'Lato',
  'Poppins',
  'Nunito',
  'Raleway',
  'Comfortaa',
  // Serif (Classic, Elegant)
  'Playfair Display',
  'Merriweather',
  'Source Sans 3',
  'Abril Fatface',
  // Display/Decorative
  'Oswald',
  'Bebas Neue',
  'Righteous',
  'Fredoka',
  'Bangers',
  'Press Start 2P',
  // Handwriting/Cursive
  'Dancing Script',
  'Pacifico',
  'Caveat',
  'Lobster',
  'Permanent Marker',
  'Great Vibes',
  'Satisfy',
  'Sacramento',
  'Kalam',
  'Indie Flower',
  // Monospace
  'Fira Code',
  'Space Mono',
];

// Computed text styles
const textStyles = computed(() => ({
  fontSize: `${props.element.fontSize || 16}px`,
  color: props.element.fontColor || '#000000',
  fontFamily: `"${props.element.fontFamily || 'Inter'}", sans-serif`,
  fontWeight: props.element.fontWeight || 400,
}));

// Set defaults if not present
watch(
  () => props.element,
  (el) => {
    if (!el.fontSize) el.fontSize = 16;
    if (!el.fontColor) el.fontColor = '#000000';
    if (!el.fontFamily) el.fontFamily = 'Inter';
    if (!el.fontWeight) el.fontWeight = 400;
  },
  { immediate: true },
);

// Auto-focus when editing starts
watch(
  () => props.isEditing,
  (isEditing) => {
    if (isEditing) {
      nextTick(() => {
        inputRef.value?.focus();
        inputRef.value?.select();
        autoResize();
      });
    }
  },
);

// Auto-resize textarea based on content
const autoResize = () => {
  if (!inputRef.value) return;
  inputRef.value.style.height = 'auto';
  inputRef.value.style.height = inputRef.value.scrollHeight + 'px';
};

// Watch for content changes to auto-resize
watch(
  () => props.element.content,
  () => {
    nextTick(() => autoResize());
  },
);
</script>

<style scoped>
.text-element {
  cursor: move;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.15s;
}

.text-element:hover {
  background: rgba(255, 255, 255, 0.1);
}

.editing-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 280px;
}

.textarea-wrapper {
  position: relative;
  width: fit-content;
}

.text-input {
  padding: 8px;
  border: 2px dashed rgba(59, 130, 246, 0.4);
  border-radius: 8px;
  background: transparent;
  resize: none;
  min-width: 200px;
  min-height: 60px;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.text-input:focus {
  border-color: rgba(59, 130, 246, 0.6);
}

/* Resize Handles */
.resize-handle {
  position: absolute;
  background: rgba(59, 130, 246, 0.6);
  border-radius: 50%;
  z-index: 10;
}

.resize-handle:hover {
  background: rgba(59, 130, 246, 0.8);
}

.resize-left {
  width: 8px;
  height: 8px;
  left: -4px;
  top: 50%;
  transform: translateY(-50%);
  cursor: ew-resize;
}

.resize-right {
  width: 8px;
  height: 8px;
  right: -4px;
  top: 50%;
  transform: translateY(-50%);
  cursor: ew-resize;
}

.resize-bottom {
  width: 8px;
  height: 8px;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  cursor: ns-resize;
}

.resize-bottom-right {
  width: 10px;
  height: 10px;
  bottom: -5px;
  right: -5px;
  cursor: nwse-resize;
  background: #10b981;
}

.resize-bottom-right:hover {
  background: #059669;
}

/* Ultra Minimal Toolbar - Freeform Style */
.toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  background: white;
  border-radius: 20px;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  width: fit-content;
  align-self: center;
}

/* Tool Button */
.tool-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}

.tool-btn:hover {
  background: #f3f4f6;
}

.tool-btn.active {
  background: #e5e7eb;
}

.tool-icon {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}

/* Size Input */
.size-input {
  width: 42px;
  height: 36px;
  padding: 0;
  border: none;
  background: transparent;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: #111827;
  outline: none;
  border-radius: 8px;
  transition: background 0.15s;
}

.size-input:hover {
  background: #f3f4f6;
}

.size-input:focus {
  background: #f3f4f6;
}

/* Color Picker Container */
.color-picker-container {
  position: relative;
}

/* Color Button */
.color-btn {
  width: 36px;
  height: 36px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}

.color-btn:hover {
  background: #f3f4f6;
}

.color-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
}

/* Color Picker Popup */
.color-picker-popup {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 8px;
  padding: 12px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 100;
  min-width: 200px;
  min-height: 180px;
}

/* Ensure Nuxt UI ColorPicker styles work in scoped component */
.color-picker-popup :deep(.picker) {
  display: flex !important;
  gap: 16px !important;
}

.color-picker-popup :deep(.selector) {
  min-width: 160px !important;
  min-height: 160px !important;
}

.color-picker-popup :deep(.track) {
  min-height: 160px !important;
}

/* Hex Input Row */
.hex-input-row {
  display: flex;
  align-items: center;
  gap: 3px;
  margin-top: 8px;
  padding: 4px 8px;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.hex-label {
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  font-family: 'SF Mono', Monaco, 'Courier New', monospace;
}

.hex-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 11px;
  font-weight: 500;
  font-family: 'SF Mono', Monaco, 'Courier New', monospace;
  color: #111827;
  text-transform: uppercase;
  outline: none;
  width: 55px;
  letter-spacing: 0.3px;
}

.hex-input::placeholder {
  color: #9ca3af;
  text-transform: uppercase;
}

/* More Options */
.more-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
  padding: 12px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.font-select {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  outline: none;
}

.weight-options {
  display: flex;
  gap: 4px;
}

.weight-option {
  flex: 1;
  padding: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  background: white;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s;
}

.weight-option:hover {
  background: #f9fafb;
}

.weight-option.active {
  border-color: #111827;
  background: #111827;
  color: white;
}
</style>
