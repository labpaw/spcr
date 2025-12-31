<template>
  <div class="shape-element">
    <div
      class="shape"
      :style="{
        width: `${element.width}px`,
        height: `${element.height}px`,
        backgroundColor: element.coverImage ? 'transparent' : element.color,
        borderRadius: element.shapeType === 'circle' ? '50%' : '0',
        backgroundImage: element.coverImage ? `url(${element.coverImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }"
    ></div>
    <!-- Resize handle -->
    <div
      class="absolute -bottom-[10px] -right-[10px] w-6 h-6 bg-blue-500 border-2 border-white rounded-full cursor-nwse-resize opacity-0 hover:opacity-100 hover:scale-110 hover:bg-blue-700 transition-all duration-200 shadow-md z-10 group-hover:opacity-100 flex items-center justify-center text-white text-xs leading-none"
      @mousedown.stop="handleResizeStart"
      title="Drag to resize"
    >
      ⋰
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ShapeElement } from '~/types';

interface Props {
  element: ShapeElement;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  resize: [event: MouseEvent];
}>();

const handleResizeStart = (event: MouseEvent) => {
  emit('resize', event);
};
</script>

<style scoped>
.shape-element {
  position: relative;
  display: inline-block;
}

.shape {
  transition: all 0.15s ease;
}
</style>
