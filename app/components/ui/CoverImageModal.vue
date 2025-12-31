<template>
  <!-- Modal Backdrop -->
  <div v-if="visible" class="modal-backdrop" @click="$emit('close')" @click.stop>
    <!-- Modal Content -->
    <div class="modal-content" @click.stop>
      <button class="modal-close" @click="$emit('close')" title="Close">
        <Icon name="material-symbols:close" />
      </button>

      <div class="modal-body">
        <h3 class="modal-title">Cover Image</h3>

        <div class="input-wrapper">
          <input
            type="text"
            v-model="imageUrl"
            class="url-input"
            placeholder="Enter image URL..."
            @keyup.enter="applyImage"
          />
        </div>

        <div class="button-row">
          <button class="apply-button" @click="applyImage" :disabled="!imageUrl.trim()">Apply</button>
          <button v-if="currentImage" class="remove-button" @click="removeImage">Remove</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  visible: boolean;
  currentImage?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  apply: [url: string];
  remove: [];
}>();

const imageUrl = ref(props.currentImage || '');

watch(
  () => props.visible,
  (isVisible) => {
    if (isVisible) {
      imageUrl.value = props.currentImage || '';
    }
  }
);

const applyImage = () => {
  if (imageUrl.value.trim()) {
    emit('apply', imageUrl.value.trim());
    emit('close');
  }
};

const removeImage = () => {
  emit('remove');
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
  max-width: 400px;
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

.input-wrapper {
  margin-bottom: 16px;
}

.url-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.15s;
  outline: none;
  color: #374151;
}

.url-input:focus {
  border-color: #3b82f6;
}

.button-row {
  display: flex;
  gap: 8px;
}

.apply-button {
  flex: 1;
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

.apply-button:hover:not(:disabled) {
  background: #1f2937;
}

.apply-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.remove-button {
  padding: 10px 20px;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.remove-button:hover {
  background: #fecaca;
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
