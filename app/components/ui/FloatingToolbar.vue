<template>
  <div class="floating-toolbar" :class="{ collapsed: !isExpanded }">
    <!-- Toggle Button -->
    <button class="toggle-btn" @click="isExpanded = !isExpanded">
      <Icon
        :name="isExpanded ? 'material-symbols:chevron-right' : 'material-symbols:chevron-left'"
        class="toggle-icon"
      />
    </button>

    <!-- Toolbar Content -->
    <div v-if="isExpanded" class="toolbar-content">
      <div class="toolbar-header">
        <span class="toolbar-title">Align</span>
      </div>

      <div class="toolbar-section">
        <div class="section-label">Horizontal</div>
        <div class="toolbar-row">
          <button class="toolbar-btn" title="Align Left" @click="$emit('align', 'left')">
            <Icon name="material-symbols:align-horizontal-left" class="toolbar-icon" />
          </button>
          <button class="toolbar-btn" title="Align Center" @click="$emit('align', 'center')">
            <Icon name="material-symbols:align-horizontal-center" class="toolbar-icon" />
          </button>
          <button class="toolbar-btn" title="Align Right" @click="$emit('align', 'right')">
            <Icon name="material-symbols:align-horizontal-right" class="toolbar-icon" />
          </button>
        </div>
      </div>

      <div class="toolbar-section">
        <div class="section-label">Vertical</div>
        <div class="toolbar-row">
          <button class="toolbar-btn" title="Align Top" @click="$emit('align', 'top')">
            <Icon name="material-symbols:align-vertical-top" class="toolbar-icon" />
          </button>
          <button class="toolbar-btn" title="Align Middle" @click="$emit('align', 'middle')">
            <Icon name="material-symbols:align-vertical-center" class="toolbar-icon" />
          </button>
          <button class="toolbar-btn" title="Align Bottom" @click="$emit('align', 'bottom')">
            <Icon name="material-symbols:align-vertical-bottom" class="toolbar-icon" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

export type AlignmentType = 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom';

const isExpanded = ref(false);

defineEmits<{
  align: [type: AlignmentType];
}>();
</script>

<style scoped>
.floating-toolbar {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  z-index: 9999;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.floating-toolbar.collapsed {
  transform: translateY(-50%) translateX(0);
}

.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 56px;
  background: white;
  border: 1px solid #d1d5db;
  border-right: none;
  border-radius: 10px 0 0 10px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.1);
}

.toggle-btn:hover {
  background: #f9fafb;
}

.toggle-icon {
  font-size: 16px;
  color: #6b7280;
}

.toolbar-content {
  background: white;
  border: 1px solid #e5e7eb;
  border-right: none;
  border-radius: 12px 0 0 12px;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  animation: slide-in 0.2s ease-out;
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.toolbar-header {
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  background: #fafafa;
}

.toolbar-title {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.toolbar-section {
  padding: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.toolbar-section:last-child {
  border-bottom: none;
}

.section-label {
  font-size: 11px;
  font-weight: 500;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.toolbar-row {
  display: flex;
  gap: 6px;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.toolbar-btn:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.toolbar-btn:active {
  transform: scale(0.95);
}

.toolbar-icon {
  font-size: 18px;
  color: #6b7280;
}

.toolbar-btn:hover .toolbar-icon {
  color: #374151;
}
</style>
