<template>
  <BaseContextMenu v-if="visible" :visible="visible" :position="position">
    <button class="context-menu-item" @click="$emit('selectShape')">
      <Icon name="material-symbols:shapes" class="context-icon" />
      <span class="context-text">Shape</span>
    </button>
    <button class="context-menu-item" @click="$emit('toggleLock')">
      <Icon
        :name="isLocked ? 'material-symbols:lock-open-outline' : 'material-symbols:lock-outline'"
        class="context-icon"
      />
      <span class="context-text">{{ isLocked ? 'Unlock' : 'Lock' }}</span>
    </button>
    <div class="context-menu-divider" />
    <button class="context-menu-item danger" @click="$emit('delete')">
      <Icon name="material-symbols:delete-outline" class="context-icon" />
      <span class="context-text">Delete</span>
    </button>
  </BaseContextMenu>
</template>

<script setup lang="ts">
import type { Position } from '~/types';
import BaseContextMenu from '~/components/ui/BaseContextMenu.vue';

interface Props {
  visible: boolean;
  position: Position;
  isLocked?: boolean;
}

defineProps<Props>();
defineEmits<{
  selectShape: [];
  toggleLock: [];
  delete: [];
}>();
</script>
