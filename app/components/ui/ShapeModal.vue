<template>
  <!-- Modal Backdrop -->
  <div v-if="visible" class="modal-backdrop" @click="$emit('close')" @click.stop>
    <!-- Modal Content -->
    <div class="modal-content" @click.stop>
      <button class="modal-close" @click="$emit('close')" title="Close">
        <Icon name="material-symbols:close" />
      </button>

      <div class="modal-body">
        <h3 class="modal-title">Shape</h3>

        <div class="shape-options">
          <button class="shape-btn" :class="{ active: borderRadius === 0 }" @click="selectShape(0)" title="Square">
            <div class="shape-preview square"></div>
            <span>Square</span>
          </button>

          <button class="shape-btn" :class="{ active: borderRadius === 8 }" @click="selectShape(8)" title="Rounded">
            <div class="shape-preview rounded"></div>
            <span>Rounded</span>
          </button>

          <button class="shape-btn" :class="{ active: borderRadius === 50 }" @click="selectShape(50)" title="Circle">
            <div class="shape-preview circle"></div>
            <span>Circle</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  visible: boolean;
  currentBorderRadius: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  select: [value: number];
}>();

const borderRadius = ref(props.currentBorderRadius || 0);

const selectShape = (value: number) => {
  borderRadius.value = value;
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

.shape-options {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.shape-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.15s;
  flex: 1;
}

.shape-btn:hover {
  border-color: #3b82f6;
  background: #f9fafb;
}

.shape-btn.active {
  border-color: #3b82f6;
  background: #eff6ff;
}

.shape-btn span {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.shape-preview {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.shape-preview.square {
  border-radius: 0;
}

.shape-preview.rounded {
  border-radius: 8px;
}

.shape-preview.circle {
  border-radius: 50%;
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
