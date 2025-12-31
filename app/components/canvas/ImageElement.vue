<template>
  <div class="relative">
    <img
      v-if="element.url"
      ref="imageRef"
      :src="element.url"
      alt="Image"
      :style="{
        width: element.width ? `${element.width}px` : 'auto',
        height: element.height ? `${element.height}px` : 'auto',
        borderRadius: element.borderRadius !== undefined ? `${element.borderRadius}%` : '8px',
      }"
      class="max-w-none max-h-none block pointer-events-none"
    />
    <div
      v-else
      class="py-10 px-[60px] bg-white rounded-lg border-2 border-dashed border-gray-300 text-gray-400 text-center cursor-pointer hover:border-blue-500 hover:text-blue-500"
      @click.stop="$emit('startEdit')"
    >
      Click to add image URL
    </div>
    <input
      v-if="isEditing && !element.url"
      v-model="element.url"
      @blur="$emit('stopEdit')"
      @click.stop
      ref="inputRef"
      class="mt-2 px-3 py-2 border border-blue-500 rounded-md font-inherit text-sm outline-none w-full"
      placeholder="Image URL..."
    />
    <!-- Resize handle -->
    <div
      v-if="element.url && !isEditing"
      class="absolute -bottom-[10px] -right-[10px] w-6 h-6 bg-blue-500 border-2 border-white rounded-full cursor-nwse-resize opacity-0 hover:opacity-100 hover:scale-110 hover:bg-blue-700 transition-all duration-200 shadow-md z-10 group-hover:opacity-100 flex items-center justify-center text-white text-xs leading-none"
      @mousedown.stop="handleResizeStart"
      title="Drag to resize"
    >
      ⋰
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import type { ImageElement } from '~/types';

interface Props {
  element: ImageElement;
  isEditing: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  startEdit: [];
  stopEdit: [];
  resize: [event: MouseEvent, imageEl: HTMLImageElement];
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const imageRef = ref<HTMLImageElement | null>(null);

// Auto-focus when editing starts
watch(
  () => props.isEditing,
  (isEditing) => {
    if (isEditing) {
      nextTick(() => {
        inputRef.value?.focus();
      });
    }
  }
);

const handleResizeStart = (event: MouseEvent) => {
  if (imageRef.value) {
    emit('resize', event, imageRef.value);
  }
};
</script>
