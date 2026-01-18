<template>
  <div
    v-if="visible"
    class="context-menu-wrapper"
    :style="{
      left: `${position.x}px`,
      top: `${position.y}px`,
    }"
    @click.stop
  >
    <div class="context-menu-item" @click="$emit('addCoverImage')">
      <Icon name="material-symbols:image-outline" class="context-icon" />
      <span class="context-text">Cover Image</span>
    </div>
    <div class="divider"></div>
    <div class="context-menu-item delete-item" @click="$emit('delete')">
      <Icon name="material-symbols:delete-outline" class="context-icon" />
      <span class="context-text">Delete</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Position } from '~/types';

interface Props {
  visible: boolean;
  position: Position;
}

defineProps<Props>();
defineEmits<{
  addCoverImage: [];
  delete: [];
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

.context-menu-wrapper {
  position: absolute;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
  padding: 8px;
  z-index: 1001;
  animation: fade-in 0.15s ease-out;
  min-width: 220px;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.context-menu-item {
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
  padding: 14px 16px !important;
  margin: 0 !important;
  background: transparent !important;
  border: none !important;
  border-radius: 8px !important;
  cursor: pointer !important;
  transition: background-color 0.15s ease !important;
  width: 100% !important;
  font-size: 15px !important;
  font-weight: 500 !important;
  color: #374151 !important;
  line-height: 1.4 !important;
  box-sizing: border-box !important;
}

.context-menu-item:hover {
  background-color: #f9fafb;
}

.context-icon {
  font-size: 20px;
  color: #6b7280;
  flex-shrink: 0;
}

.context-text {
  flex: 1;
  text-align: left;
  white-space: nowrap;
}

.divider {
  height: 1px;
  background: #e5e7eb;
  margin: 4px 0;
}

.delete-item {
  color: #ef4444 !important;
}

.delete-item:hover {
  background-color: #fee2e2 !important;
}

.delete-item .context-icon {
  color: #ef4444;
}
</style>
