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

    <!-- Styling Controls -->
    <div class="style-controls">
      <!-- Font Size -->
      <div class="control-group">
        <label>Size</label>
        <input type="number" v-model.number="element.fontSize" min="8" max="200" class="size-input" />
      </div>

      <!-- Font Color -->
      <div class="control-group">
        <label>Color</label>
        <input
          type="color"
          :value="element.fontColor || '#000000'"
          @input="element.fontColor = ($event.target as HTMLInputElement).value"
          class="color-input"
        />
      </div>

      <!-- Font Family -->
      <div class="control-group">
        <label>Font</label>
        <select v-model="element.fontFamily" class="font-select">
          <option v-for="font in availableFonts" :key="font" :value="font">
            {{ font }}
          </option>
        </select>
      </div>

      <!-- Font Weight -->
      <div class="control-group">
        <label>Weight</label>
        <select v-model.number="element.fontWeight" class="weight-select">
          <option :value="300">Light</option>
          <option :value="400">Regular</option>
          <option :value="500">Medium</option>
          <option :value="600">Semi Bold</option>
          <option :value="700">Bold</option>
          <option :value="800">Extra Bold</option>
        </select>
      </div>

      <!-- Done Button -->
      <button class="done-button" @click="$emit('stopEdit')">Done</button>
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

.style-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.control-group label {
  font-size: 11px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.size-input {
  width: 60px;
  padding: 6px 8px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
}

.size-input:focus {
  border-color: #3b82f6;
}

.color-input {
  width: 40px;
  height: 32px;
  padding: 0;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
}

.font-select,
.weight-select {
  padding: 6px 8px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 13px;
  background: white;
  cursor: pointer;
  outline: none;
}

.font-select {
  min-width: 120px;
}

.font-select:focus,
.weight-select:focus {
  border-color: #3b82f6;
}

.done-button {
  padding: 8px 16px;
  background: #111827;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
  margin-left: auto;
  align-self: flex-end;
}

.done-button:hover {
  background: #1f2937;
}
</style>
