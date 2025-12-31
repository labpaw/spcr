<template>
  <button
    class="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-white border border-gray-200 cursor-pointer flex items-center justify-center text-2xl shadow-md transition-all z-[999] hover:bg-gray-50 hover:scale-105"
    @click.stop="togglePanel"
    title="About Spacer"
  >
    <Icon name="material-symbols:info-outline" />
  </button>

  <div
    v-if="isOpen"
    class="fixed bottom-20 right-6 w-80 bg-white rounded-xl shadow-xl p-6 z-[1000] animate-fade-in"
    @click.stop
  >
    <button
      class="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-50 border-none cursor-pointer text-2xl leading-none flex items-center justify-center transition-colors hover:bg-gray-200"
      @click="togglePanel"
    >
      ×
    </button>
    <h2 class="m-0 mb-3 text-2xl font-semibold">Spacer</h2>
    <p class="m-0 mb-4 text-gray-500 leading-relaxed text-sm">
      A simple place on the internet to collect and share whatever matters to you, exactly how you want it to look.
    </p>
    <ul class="list-none m-0 p-0">
      <li
        class="py-1.5 text-gray-500 text-sm leading-relaxed before:content-['→_'] before:text-blue-500 before:font-bold before:mr-1"
      >
        Click anywhere to add text, links, or images
      </li>
      <li
        class="py-1.5 text-gray-500 text-sm leading-relaxed before:content-['→_'] before:text-blue-500 before:font-bold before:mr-1"
      >
        Drag elements anywhere to move them around
      </li>
      <li
        class="py-1.5 text-gray-500 text-sm leading-relaxed before:content-['→_'] before:text-blue-500 before:font-bold before:mr-1"
      >
        Click elements to edit them
      </li>
      <li
        class="py-1.5 text-gray-500 text-sm leading-relaxed before:content-['→_'] before:text-blue-500 before:font-bold before:mr-1"
      >
        Drag corner to resize (hold Shift for aspect ratio)
      </li>
      <li
        class="py-1.5 text-gray-500 text-sm leading-relaxed before:content-['→_'] before:text-blue-500 before:font-bold before:mr-1"
      >
        Right-click to change background color
      </li>
      <li
        class="py-1.5 text-gray-500 text-sm leading-relaxed before:content-['→_'] before:text-blue-500 before:font-bold before:mr-1"
      >
        Click the × to delete elements
      </li>
      <li
        class="py-1.5 text-gray-500 text-sm leading-relaxed before:content-['→_'] before:text-blue-500 before:font-bold before:mr-1"
      >
        Everything saves automatically
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isOpen = ref(false);

const togglePanel = () => {
  isOpen.value = !isOpen.value;
};

defineExpose({
  isOpen,
  togglePanel,
});
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}
</style>
