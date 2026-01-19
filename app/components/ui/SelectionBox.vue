<template>
  <div v-if="visible && rect" class="selection-box" :style="boxStyle" />
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface SelectionRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface Props {
  visible: boolean;
  rect: SelectionRect | null;
}

const props = defineProps<Props>();

const boxStyle = computed(() => {
  if (!props.rect) return {};

  return {
    left: `${props.rect.left}px`,
    top: `${props.rect.top}px`,
    width: `${props.rect.width}px`,
    height: `${props.rect.height}px`,
  };
});
</script>

<style scoped>
.selection-box {
  position: absolute;
  background: rgba(59, 130, 246, 0.08);
  border: 1.5px dashed rgba(59, 130, 246, 0.5);
  border-radius: 4px;
  pointer-events: none;
  z-index: 999;
  /* Subtle animation for the dashed border */
  animation: marching-ants 0.5s linear infinite;
}

@keyframes marching-ants {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 16;
  }
}
</style>
