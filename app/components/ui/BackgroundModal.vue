<template>
  <!-- Modal Backdrop -->
  <div v-if="visible" class="modal-backdrop" @click="$emit('close')" @click.stop>
    <!-- Modal Content -->
    <div class="modal-content" @click.stop>
      <button class="modal-close" @click="$emit('close')" title="Close">
        <Icon name="material-symbols:close" />
      </button>

      <div class="modal-body">
        <h3 class="modal-title">Background</h3>

        <div class="color-picker-wrapper">
          <input type="color" v-model="customColor" class="color-picker" @input="updatePreview" />
        </div>

        <div class="color-input-wrapper">
          <input
            type="text"
            v-model="customColor"
            class="color-input"
            placeholder="#FFFFFF"
            @input="updatePreview"
            maxlength="7"
          />
        </div>

        <button class="apply-button" @click="selectColor(customColor)">Apply</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { BackgroundTheme } from '~/types';

interface Props {
  visible: boolean;
  themes: BackgroundTheme[];
  currentBackground: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  select: [value: string];
}>();

const customColor = ref(props.currentBackground || '#ffffff');

const updatePreview = () => {
  // Live preview - could emit preview event if needed
};

const selectColor = (value: string) => {
  emit('select', value);
  emit('close');
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.15s ease-out;
}

.modal-content {
  position: relative;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 320px;
  animation: scaleIn 0.15s ease-out;
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  transition: all 0.15s;
  z-index: 1;
}

.modal-close:hover {
  color: #374151;
}

.modal-body {
  padding: 32px 24px 24px;
  text-align: center;
}

.modal-title {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.color-picker-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.color-picker {
  width: 120px;
  height: 120px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.15s;
}

.color-picker:hover {
  transform: scale(1.02);
}

.color-input-wrapper {
  margin-bottom: 16px;
}

.color-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  font-family: 'SF Mono', 'Monaco', 'Courier New', monospace;
  text-align: center;
  transition: all 0.15s;
  outline: none;
  color: #374151;
}

.color-input:focus {
  border-color: #3b82f6;
}

.apply-button {
  width: 100%;
  padding: 10px 20px;
  background: #111827;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.apply-button:hover {
  background: #1f2937;
}

.apply-button:active {
  transform: scale(0.98);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
