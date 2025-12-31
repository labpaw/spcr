<template>
  <div v-if="!isEditing" class="px-4 py-3 bg-white rounded-lg border border-gray-200">
    <a :href="element.url" target="_blank" @click.stop class="text-blue-500 no-underline font-medium hover:underline">
      {{ element.content || element.url || 'Empty link' }}
    </a>
  </div>
  <div v-else class="bg-white rounded-lg border-2 border-blue-500 p-3 flex flex-col gap-2 min-w-[250px]" @click.stop>
    <input
      v-model="element.content"
      @blur="$emit('stopEdit')"
      ref="inputRef"
      class="px-3 py-2 border border-gray-200 rounded-md font-inherit text-sm outline-none focus:border-blue-500"
      placeholder="Link text..."
    />
    <input
      v-model="element.url"
      class="px-3 py-2 border border-gray-200 rounded-md font-inherit text-sm outline-none focus:border-blue-500"
      placeholder="https://..."
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import type { LinkElement } from '~/types';

interface Props {
  element: LinkElement;
  isEditing: boolean;
}

const props = defineProps<Props>();
defineEmits<{
  stopEdit: [];
}>();

const inputRef = ref<HTMLInputElement | null>(null);

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
