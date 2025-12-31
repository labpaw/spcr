<template>
  <div
    v-if="visible"
    class="absolute bg-white rounded-xl shadow-xl p-4 z-[1000] animate-fade-in min-w-[240px]"
    :style="{
      left: `${position.x}px`,
      top: `${position.y}px`,
    }"
    @click.stop
  >
    <div class="text-sm font-semibold mb-3 text-gray-800">Background Color</div>
    <div class="grid grid-cols-3 gap-2">
      <button
        v-for="theme in themes"
        :key="theme.value"
        class="w-[60px] h-[60px] rounded-lg border-2 border-gray-200 cursor-pointer transition-all relative flex items-center justify-center hover:border-blue-500 hover:scale-105"
        :style="{ background: theme.value }"
        :title="theme.name"
        @click="$emit('select', theme.value)"
      >
        <Icon
          v-if="currentBackground === theme.value"
          name="material-symbols:check"
          class="text-2xl text-white drop-shadow-md"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Position, BackgroundTheme } from '~/types';

interface Props {
  visible: boolean;
  position: Position;
  themes: BackgroundTheme[];
  currentBackground: string;
}

defineProps<Props>();
defineEmits<{
  select: [value: string];
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

.animate-fade-in {
  animation: fade-in 0.15s ease-out;
}
</style>
