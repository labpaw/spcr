<template>
  <div
    v-if="visible"
    class="absolute bg-white rounded-xl shadow-xl p-2 flex flex-col gap-1 z-[1000] animate-fade-in"
    :style="{
      left: `${position.x}px`,
      top: `${position.y}px`,
    }"
    @click.stop
  >
    <button
      @click="$emit('select', 'text')"
      class="px-5 py-3 bg-white border border-gray-200 rounded-lg cursor-pointer text-sm flex items-center gap-2 transition-all whitespace-nowrap font-medium hover:bg-gray-50 hover:border-blue-500 hover:text-blue-500"
    >
      <Icon name="material-symbols:text-fields" />
      Text
    </button>
    <button
      @click="$emit('select', 'link')"
      class="px-5 py-3 bg-white border border-gray-200 rounded-lg cursor-pointer text-sm flex items-center gap-2 transition-all whitespace-nowrap font-medium hover:bg-gray-50 hover:border-blue-500 hover:text-blue-500"
    >
      <Icon name="material-symbols:link" />
      Link
    </button>
    <button
      @click="$emit('select', 'image')"
      class="px-5 py-3 bg-white border border-gray-200 rounded-lg cursor-pointer text-sm flex items-center gap-2 transition-all whitespace-nowrap font-medium hover:bg-gray-50 hover:border-blue-500 hover:text-blue-500"
    >
      <Icon name="material-symbols:image-outline" />
      Image
    </button>
    <div class="h-px bg-gray-200 my-1"></div>
    <button
      @click="$emit('selectShape', 'circle')"
      class="px-5 py-3 bg-white border border-gray-200 rounded-lg cursor-pointer text-sm flex items-center gap-2 transition-all whitespace-nowrap font-medium hover:bg-gray-50 hover:border-blue-500 hover:text-blue-500"
    >
      <Icon name="material-symbols:circle-outline" />
      Circle
    </button>
    <button
      @click="$emit('selectShape', 'square')"
      class="px-5 py-3 bg-white border border-gray-200 rounded-lg cursor-pointer text-sm flex items-center gap-2 transition-all whitespace-nowrap font-medium hover:bg-gray-50 hover:border-blue-500 hover:text-blue-500"
    >
      <Icon name="material-symbols:square-outline" />
      Square
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Position, ElementType, ShapeType } from '~/types';

interface Props {
  visible: boolean;
  position: Position;
}

defineProps<Props>();
defineEmits<{
  select: [type: ElementType];
  selectShape: [shapeType: ShapeType];
}>();
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.15s ease-out;
}

button {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  padding: 12px 20px !important;
  margin: 0 !important;
  background: white !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 8px !important;
  cursor: pointer !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  color: #374151 !important;
  transition: all 0.15s ease !important;
  white-space: nowrap !important;
  box-sizing: border-box !important;
}

button:hover {
  background: #f9fafb !important;
  border-color: #3b82f6 !important;
  color: #3b82f6 !important;
}
</style>
