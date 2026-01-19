<template>
  <BaseContextMenu v-if="visible" :visible="visible" :position="position">
    <button class="context-menu-item" :class="{ disabled: !canUndo }" :disabled="!canUndo" @click="$emit('undo')">
      <Icon name="material-symbols:undo" class="context-icon" />
      <span class="context-text">Undo</span>
      <span class="context-shortcut">⌘Z</span>
    </button>
    <button class="context-menu-item" :class="{ disabled: !canRedo }" :disabled="!canRedo" @click="$emit('redo')">
      <Icon name="material-symbols:redo" class="context-icon" />
      <span class="context-text">Redo</span>
      <span class="context-shortcut">⌘⇧Z</span>
    </button>
    <div class="context-menu-divider" />
    <button class="context-menu-item" @click="$emit('selectBackground')">
      <Icon name="material-symbols:palette-outline" class="context-icon" />
      <span class="context-text">Background</span>
    </button>
  </BaseContextMenu>
</template>

<script setup lang="ts">
import type { Position } from '~/types';
import BaseContextMenu from '~/components/ui/BaseContextMenu.vue';

interface Props {
  visible: boolean;
  position: Position;
  canUndo?: boolean;
  canRedo?: boolean;
}

defineProps<Props>();
defineEmits<{
  selectBackground: [];
  undo: [];
  redo: [];
}>();
</script>

<style scoped>
.context-shortcut {
  font-size: 12px;
  color: #9ca3af;
  margin-left: auto;
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
}

.context-menu-item.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.context-menu-item.disabled:hover {
  background-color: transparent;
}
</style>
