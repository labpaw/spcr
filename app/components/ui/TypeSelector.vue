<template>
  <div
    v-if="visible"
    class="menu-container"
    :style="{
      left: `${position.x}px`,
      top: `${position.y}px`,
    }"
    @click.stop
  >
    <button @click="$emit('select', 'text')" class="menu-button">
      <Icon name="material-symbols:text-fields" class="menu-icon" />
      <span>Text</span>
    </button>
    <button @click="$emit('select', 'link')" class="menu-button">
      <Icon name="material-symbols:link" class="menu-icon" />
      <span>Link</span>
    </button>
    <button @click="$emit('select', 'image')" class="menu-button">
      <Icon name="material-symbols:image-outline" class="menu-icon" />
      <span>Image</span>
    </button>
    <div class="menu-divider"></div>
    <button @click="$emit('selectShape', 'circle')" class="menu-button">
      <Icon name="material-symbols:circle-outline" class="menu-icon" />
      <span>Circle</span>
    </button>
    <button @click="$emit('selectShape', 'square')" class="menu-button">
      <Icon name="material-symbols:square-outline" class="menu-icon" />
      <span>Square</span>
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
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.menu-container {
  position: absolute;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 1000;
  animation: fade-in 0.15s ease-out;
  min-width: 140px;
}

.menu-button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  transition: all 0.15s ease;
  white-space: nowrap;
  text-align: left;
  width: 100%;
}

.menu-button:hover {
  background: #f3f4f6;
  color: #111827;
}

.menu-button:active {
  transform: scale(0.98);
}

.menu-icon {
  font-size: 18px;
  color: #6b7280;
  flex-shrink: 0;
}

.menu-button:hover .menu-icon {
  color: #3b82f6;
}

.menu-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 4px 0;
}
</style>
