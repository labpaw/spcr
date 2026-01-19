<template>
  <div v-if="!isEditing" class="text-element whitespace-pre-wrap min-w-[50px]" :style="textStyles">
    {{ element.content || 'Click to edit' }}
  </div>
  <div v-else class="editing-container" @click.stop>
    <textarea
      v-model="element.content"
      ref="inputRef"
      class="text-input"
      :style="textStyles"
      placeholder="Type something..."
      @keydown.escape="$emit('stopEdit')"
    />

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

      <label class="color-btn" title="Text color">
        <input
          type="color"
          :value="element.fontColor || '#000000'"
          @input="element.fontColor = ($event.target as HTMLInputElement).value"
          class="color-input-native"
        />
        <div class="color-circle" :style="{ background: element.fontColor || '#000000' }"></div>
      </label>

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
const showMore = ref(false);
const showColorPicker = ref(false);

// Font weights for quick selection
const fontWeights = [
  { value: 300, label: 'Light', short: 'L' },
  { value: 400, label: 'Regular', short: 'R' },
  { value: 600, label: 'Semi Bold', short: 'SB' },
  { value: 700, label: 'Bold', short: 'B' },
];

// Available Google Fonts
const availableFonts = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Montserrat',
  'Lato',
  'Poppins',
  'Playfair Display',
  'Merriweather',
  'Source Sans Pro',
  'Nunito',
  'Raleway',
  'Oswald',
  'Dancing Script',
  'Pacifico',
  'Permanent Marker',
  'Bebas Neue',
  'Caveat',
  'Abril Fatface',
  'Lobster',
  'Comfortaa',
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
      });
    }
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

.text-input {
  padding: 8px;
  border: 2px dashed rgba(59, 130, 246, 0.4);
  border-radius: 8px;
  background: transparent;
  resize: both;
  min-width: 200px;
  min-height: 60px;
  outline: none;
  transition: border-color 0.2s;
}

.text-input:focus {
  border-color: rgba(59, 130, 246, 0.6);
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

.color-input-native {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}

.color-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
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
