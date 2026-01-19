<template>
  <!-- Display Mode -->
  <div v-if="!isEditing" class="link-display" @click.stop>
    <a :href="element.url" target="_blank" class="link-content">
      <span class="link-text">{{ element.content || element.url || 'Empty link' }}</span>
      <img v-if="element.icon" :src="element.icon" class="link-icon" alt="icon" />
      <span v-else class="link-arrow">→</span>
    </a>
  </div>

  <!-- Edit Mode -->
  <div v-else class="link-editor" @click.stop>
    <div class="editor-header">
      <span class="editor-label">Edit Link</span>
    </div>

    <div class="editor-content">
      <!-- Link Text Input -->
      <div class="input-group">
        <label class="input-label">Display Text</label>
        <input v-model="element.content" ref="inputRef" class="input-field" placeholder="Link text..." />
      </div>

      <!-- URL Input -->
      <div class="input-group">
        <label class="input-label">URL</label>
        <input v-model="element.url" class="input-field" placeholder="https://..." />
      </div>

      <!-- Icon Upload -->
      <div class="input-group">
        <label class="input-label">Icon (optional)</label>
        <div class="icon-upload-area">
          <div v-if="element.icon" class="icon-preview">
            <img :src="element.icon" alt="icon" class="preview-image" />
            <button @click="removeIcon" class="remove-icon-btn" type="button">×</button>
          </div>
          <label v-else class="icon-upload-btn">
            <input type="file" accept="image/*" @change="handleIconUpload" class="hidden-input" />
            <span class="upload-icon">+</span>
            <span class="upload-text">Upload</span>
          </label>
        </div>
      </div>
    </div>

    <div class="editor-footer">
      <button @click="$emit('stopEdit')" class="done-btn" type="button">Done</button>
    </div>
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
  },
);

// Handle icon upload
const handleIconUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      props.element.icon = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

// Remove icon
const removeIcon = () => {
  props.element.icon = undefined;
};
</script>

<style scoped>
/* Display Mode */
.link-display {
  display: inline-block;
}

.link-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  text-decoration: none;
  color: #111827;
  font-weight: 500;
  font-size: 15px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.link-content:hover {
  border-color: #d1d5db;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.link-text {
  flex: 1;
}

.link-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  border-radius: 4px;
}

.link-arrow {
  color: #9ca3af;
  font-size: 16px;
  transition: transform 0.2s;
}

.link-content:hover .link-arrow {
  transform: translateX(2px);
  color: #6b7280;
}

/* Edit Mode */
.link-editor {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  min-width: 320px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.editor-header {
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  background: #fafafa;
}

.editor-label {
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.editor-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.input-field {
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
  background: #fafafa;
}

.input-field:focus {
  border-color: #111827;
  background: white;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
}

.input-field::placeholder {
  color: #9ca3af;
}

/* Icon Upload */
.icon-upload-area {
  display: flex;
  align-items: center;
}

.icon-preview {
  position: relative;
  display: inline-flex;
}

.preview-image {
  width: 48px;
  height: 48px;
  object-fit: contain;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 4px;
  background: white;
}

.remove-icon-btn {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  border: none;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: background 0.2s;
}

.remove-icon-btn:hover {
  background: #dc2626;
}

.icon-upload-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 1px dashed #d1d5db;
  border-radius: 10px;
  background: #fafafa;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-upload-btn:hover {
  border-color: #9ca3af;
  background: #f3f4f6;
}

.hidden-input {
  display: none;
}

.upload-icon {
  font-size: 18px;
  color: #9ca3af;
  font-weight: 300;
}

.upload-text {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

/* Footer */
.editor-footer {
  padding: 12px 16px;
  border-top: 1px solid #f3f4f6;
  background: #fafafa;
  display: flex;
  justify-content: flex-end;
}

.done-btn {
  padding: 8px 20px;
  background: #111827;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.done-btn:hover {
  background: #1f2937;
}
</style>
