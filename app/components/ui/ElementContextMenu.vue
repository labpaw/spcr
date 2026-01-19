<template>
  <BaseContextMenu v-if="visible" :visible="visible" :position="position">
    <button class="context-menu-item" @click="$emit('edit')">
      <Icon name="material-symbols:edit-outline" class="context-icon" />
      <span class="context-text">Edit</span>
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
}

defineProps<Props>();
defineEmits<{
  edit: [];
  delete: [];
}>();
</script>
