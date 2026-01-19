<template>
  <div v-if="visible" ref="menuRef" class="context-menu-wrapper" :style="adjustedPosition" @click.stop>
    <div class="context-menu-item" @click="$emit('selectBackground')">
      <Icon name="material-symbols:palette-outline" class="context-icon" />
      <span class="context-text">Background</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import type { Position } from '~/types';

interface Props {
  visible: boolean;
  position: Position;
}

const props = defineProps<Props>();
defineEmits<{
  selectBackground: [];
  selectBackgroundImage: [];
}>();

const menuRef = ref<HTMLDivElement | null>(null);
const menuHeight = ref(0);
const menuWidth = ref(0);

const adjustedPosition = computed(() => {
  const padding = 10;
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

  let x = props.position.x;
  let y = props.position.y;

  if (x + menuWidth.value + padding > viewportWidth) {
    x = Math.max(padding, x - menuWidth.value);
  }

  if (y + menuHeight.value + padding > viewportHeight) {
    y = Math.max(padding, y - menuHeight.value);
  }

  return {
    left: `${x}px`,
    top: `${y}px`,
  };
});

watch(
  () => props.visible,
  async (visible) => {
    if (visible) {
      await nextTick();
      if (menuRef.value) {
        menuHeight.value = menuRef.value.offsetHeight;
        menuWidth.value = menuRef.value.offsetWidth;
      }
    }
  },
);
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

.context-chevron {
  font-size: 18px;
  color: #9ca3af;
  flex-shrink: 0;
  margin-left: auto;
}
</style>
