<template>
  <div v-if="visible" ref="menuRef" class="context-menu" :style="menuStyle" @click.stop @contextmenu.prevent.stop>
    <slot />
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

const menuRef = ref<HTMLDivElement | null>(null);
const menuHeight = ref(0);
const menuWidth = ref(0);

/**
 * Computed style for menu positioning
 * Adjusts position to keep menu within viewport
 */
const menuStyle = computed(() => {
  const padding = 10;
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

  let x = props.position.x;
  let y = props.position.y;

  // Prevent overflow on right edge
  if (x + menuWidth.value + padding > viewportWidth) {
    x = Math.max(padding, x - menuWidth.value);
  }

  // Prevent overflow on bottom edge
  if (y + menuHeight.value + padding > viewportHeight) {
    y = Math.max(padding, y - menuHeight.value);
  }

  return {
    left: `${x}px`,
    top: `${y}px`,
  };
});

// Update menu dimensions when visible
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
@keyframes context-menu-fade-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.context-menu {
  position: absolute;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
  padding: 8px;
  z-index: 1001;
  min-width: 220px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  animation: context-menu-fade-in 0.15s ease-out;
}
</style>
