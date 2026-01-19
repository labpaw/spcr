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

    <!-- Minimalist Toolbar -->
    <div class="toolbar">
      <div class="toolbar-section">
        <input
          type="number"
          v-model.number="element.fontSize"
          min="8"
          max="200"
          class="size-control"
          title="Font size"
        />
        <input
          type="color"
          :value="element.fontColor || '#000000'"
          @input="element.fontColor = ($event.target as HTMLInputElement).value"
          class="color-control"
          title="Text color"
        />
      </div>

      <div class="toolbar-section">
        <select v-model="element.fontFamily" class="font-control">
          <option v-for="font in availableFonts" :key="font" :value="font">
            {{ font }}
          </option>
        </select>
      </div>

      <div class="toolbar-section">
        <button
          v-for="weight in fontWeights"
          :key="weight.value"
          @click="element.fontWeight = weight.value"
          :class="['weight-btn', { active: element.fontWeight === weight.value }]"
          :title="weight.label"
        >
          {{ weight.short }}
        </button>
      </div>

      <button class="done-btn" @click="$emit('stopEdit')">
        <Icon name="material-symbols:check" />
      </button>
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
  border: none;
  border-radius: 8px;
  background: transparent;
  resize: both;
  min-width: 200px;
  min-height: 60px;
  outline: none;
}

/* Minimalist Toolbar */
.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  width: fit-content;
}

.toolbar-section {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px;
  border-right: 1px solid #e5e7eb;
}

.toolbar-section:last-of-type {
  border-right: none;
}

/* Size Control */
.size-control {
  width: 50px;
  padding: 4px 8px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  outline: none;
  transition: all 0.15s;
}

.size-control:focus {
  border-color: #3b82f6;
  background: #eff6ff;
}

/* Color Control */
.color-control {
  width: 32px;
  height: 32px;
  padding: 0;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.color-control:hover {
  border-color: #3b82f6;
  transform: scale(1.05);
}

/* Font Control */
.font-control {
  padding: 4px 8px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  background: white;
  cursor: pointer;
  outline: none;
  transition: all 0.15s;
  min-width: 100px;
}

.font-control:focus {
  border-color: #3b82f6;
  background: #eff6ff;
}

/* Weight Buttons */
.weight-btn {
  padding: 4px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  background: white;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s;
  min-width: 32px;
}

.weight-btn:hover {
  border-color: #d1d5db;
  background: #f9fafb;
}

.weight-btn.active {
  border-color: #3b82f6;
  background: #eff6ff;
  color: #3b82f6;
}

/* Done Button */
.done-btn {
  padding: 6px 12px;
  background: #111827;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 4px;
}

.done-btn:hover {
  background: #1f2937;
  transform: scale(1.05);
}

.done-btn:active {
  transform: scale(0.95);
}
</style>
