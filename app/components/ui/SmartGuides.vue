<template>
  <div class="smart-guides-container">
    <!-- Vertical guides (left-right lines) -->
    <div
      v-for="(guide, index) in verticalGuides"
      :key="`v-${index}`"
      class="guide-line vertical"
      :style="{ left: `${guide.position}%` }"
    >
      <span v-if="guide.label" class="guide-label">{{ guide.label }}</span>
    </div>

    <!-- Horizontal guides (top-bottom lines) -->
    <div
      v-for="(guide, index) in horizontalGuides"
      :key="`h-${index}`"
      class="guide-line horizontal"
      :style="{ top: `${guide.position}%` }"
    >
      <span v-if="guide.label" class="guide-label">{{ guide.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface GuideLine {
  type: 'horizontal' | 'vertical';
  position: number;
  label?: string;
}

interface Props {
  guides: GuideLine[];
}

const props = defineProps<Props>();

const verticalGuides = computed(() => props.guides.filter((g) => g.type === 'vertical'));
const horizontalGuides = computed(() => props.guides.filter((g) => g.type === 'horizontal'));
</script>

<style scoped>
.smart-guides-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 9998;
}

.guide-line {
  position: absolute;
  background: #f43f5e;
  opacity: 0.8;
}

.guide-line.vertical {
  width: 1px;
  top: 0;
  bottom: 0;
  transform: translateX(-50%);
}

.guide-line.horizontal {
  height: 1px;
  left: 0;
  right: 0;
  transform: translateY(-50%);
}

.guide-label {
  position: absolute;
  background: #f43f5e;
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
}

.vertical .guide-label {
  top: 50%;
  left: 4px;
  transform: translateY(-50%);
}

.horizontal .guide-label {
  left: 50%;
  top: 4px;
  transform: translateX(-50%);
}
</style>
