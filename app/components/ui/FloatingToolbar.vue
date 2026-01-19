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
        <span class="toolbar-title">Tools</span>
      </div>

      <div class="toolbar-items">
        <!-- Placeholder items - add more later -->
        <button class="toolbar-btn" title="Coming soon">
          <Icon name="material-symbols:settings-outline" class="toolbar-icon" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isExpanded = ref(false);
</script>

<style scoped>
.floating-toolbar {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  z-index: 100;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.floating-toolbar.collapsed {
  transform: translateY(-50%) translateX(0);
}

.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 48px;
  background: white;
  border: 1px solid #e5e7eb;
  border-right: none;
  border-radius: 8px 0 0 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.05);
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

.toolbar-items {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
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

.toolbar-icon {
  font-size: 20px;
  color: #6b7280;
}

.toolbar-btn:hover .toolbar-icon {
  color: #374151;
}
</style>
