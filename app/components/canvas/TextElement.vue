<template>
  <div v-if="!isEditing" class="px-4 py-3 bg-white rounded-lg whitespace-pre-wrap min-w-[100px] max-w-[400px]">
    {{ element.content || 'Empty text' }}
  </div>
  <textarea
    v-else
    v-model="element.content"
    @blur="$emit('stopEdit')"
    @click.stop
    ref="inputRef"
    class="px-4 py-3 bg-white rounded-lg border-2 border-blue-500 font-inherit text-sm resize min-w-[200px] min-h-[80px] outline-none"
    placeholder="Type something..."
  />
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import type { TextElement } from '~/types';

interface Props {
  element: TextElement;
  isEditing: boolean;
}

const props = defineProps<Props>();
defineEmits<{
  stopEdit: [];
}>();

const inputRef = ref<HTMLTextAreaElement | null>(null);

// Auto-focus when editing starts
watch(
  () => props.isEditing,
  (isEditing) => {
    if (isEditing) {
      nextTick(() => {
        inputRef.value?.focus();
      });
    }
  }
);
</script>
