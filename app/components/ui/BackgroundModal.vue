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

        <!-- Tab Switcher -->
        <div class="tab-switcher">
          <button class="tab-button" :class="{ active: activeTab === 'color' }" @click="activeTab = 'color'">
            <Icon name="material-symbols:palette-outline" />
            <span>Color</span>
          </button>
          <button class="tab-button" :class="{ active: activeTab === 'image' }" @click="activeTab = 'image'">
            <Icon name="material-symbols:image-outline" />
            <span>Image</span>
          </button>
        </div>

        <!-- Color Tab -->
        <div v-if="activeTab === 'color'" class="tab-content">
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

        <!-- Image Tab -->
        <div v-if="activeTab === 'image'" class="tab-content">
          <div
            class="image-upload-area"
            :class="{ 'is-dragging': isDragging }"
            @dragover.prevent="isDragging = true"
            @dragleave="isDragging = false"
            @drop.prevent="handleImageDrop"
          >
            <input type="file" ref="fileInput" class="file-input" accept="image/*" @change="handleImageUpload" />

            <div v-if="!imagePreview" class="upload-prompt" @click="fileInput?.click()">
              <Icon name="material-symbols:upload" class="upload-icon" />
              <p class="upload-text">Click to upload or drag and drop</p>
              <p class="upload-hint">JPG, PNG, GIF up to 10MB</p>
            </div>

            <div v-else class="image-preview-container">
              <img :src="imagePreview" alt="Background preview" class="image-preview" />
              <button class="remove-image-button" @click.stop="removeImage" title="Remove image">
                <Icon name="material-symbols:close" />
              </button>
            </div>
          </div>

          <!-- Blur Toggle -->
          <div class="blur-toggle" v-if="currentBackground.startsWith('url(') || imagePreview">
            <label class="toggle-label">
              <span class="toggle-text">Blur Background</span>
              <button class="toggle-switch" :class="{ active: localBlur }" @click="toggleBlur">
                <span class="toggle-knob"></span>
              </button>
            </label>

            <!-- Blur Amount Slider -->
            <div v-if="localBlur" class="blur-slider-wrapper">
              <label class="slider-label">
                <span class="slider-text">Blur Amount</span>
                <span class="slider-value">{{ localBlurAmount }}px</span>
              </label>
              <input
                type="range"
                min="1"
                max="30"
                :value="localBlurAmount"
                @input="updateBlurAmount(Number(($event.target as HTMLInputElement).value))"
                class="blur-slider"
              />
            </div>
          </div>

          <button v-if="imagePreview" class="apply-button" @click="selectImage" :disabled="isUploading">
            <span v-if="isUploading">Uploading...</span>
            <span v-else>Apply Image</span>
          </button>
          <button v-if="currentBackground.startsWith('url(')" class="remove-button" @click="removeBackgroundImage">
            Remove Background Image
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { BackgroundTheme } from '~/types';
import { uploadBackgroundImage } from '~/utils/imageOptimizer';

interface Props {
  visible: boolean;
  themes: BackgroundTheme[];
  currentBackground: string;
  blur: boolean;
  blurAmount: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  select: [value: string];
  'update:blur': [value: boolean];
  'update:blurAmount': [value: number];
}>();

const localBlur = ref(props.blur);
const localBlurAmount = ref(props.blurAmount);

// Watch for external blur changes
watch(
  () => props.blur,
  (newVal) => {
    localBlur.value = newVal;
  },
);

// Watch for external blur amount changes
watch(
  () => props.blurAmount,
  (newVal) => {
    localBlurAmount.value = newVal;
  },
);

// Emit blur changes
const toggleBlur = () => {
  localBlur.value = !localBlur.value;
  emit('update:blur', localBlur.value);
};

// Emit blur amount changes
const updateBlurAmount = (value: number) => {
  localBlurAmount.value = value;
  emit('update:blurAmount', value);
};

const activeTab = ref<'color' | 'image'>('color');
const customColor = ref(props.currentBackground.startsWith('#') ? props.currentBackground : '#ffffff');
const fileInput = ref<HTMLInputElement | null>(null);
const imagePreview = ref<string>('');
const uploadedImageUrl = ref<string>('');
const isDragging = ref(false);
const isUploading = ref(false);
const currentFile = ref<File | null>(null);

// Watch for changes in currentBackground prop
watch(
  () => props.currentBackground,
  (newVal) => {
    if (newVal.startsWith('#')) {
      customColor.value = newVal;
    }
  },
);

const updatePreview = () => {
  // Live preview - could emit preview event if needed
};

const selectColor = (value: string) => {
  emit('select', value);
  emit('close');
};

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    processImage(file);
  }
};

const handleImageDrop = (event: DragEvent) => {
  isDragging.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file && file.type.startsWith('image/')) {
    processImage(file);
  }
};

const processImage = (file: File) => {
  // Check file size (10MB limit)
  if (file.size > 10 * 1024 * 1024) {
    alert('Image size must be less than 10MB');
    return;
  }

  currentFile.value = file;

  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};

const removeImage = () => {
  imagePreview.value = '';
  uploadedImageUrl.value = '';
  currentFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const selectImage = async () => {
  if (!currentFile.value) return;

  try {
    isUploading.value = true;

    // Upload background image - uses fixed path so it OVERWRITES existing
    const publicUrl = await uploadBackgroundImage(currentFile.value);

    // Create CSS url() syntax for background image
    const backgroundValue = `url(${publicUrl})`;
    emit('select', backgroundValue);
    emit('close');

    // Clear state
    removeImage();
  } catch (error: any) {
    console.error('Failed to upload image:', error);
    alert(error.message || 'Failed to upload image. Please try again.');
  } finally {
    isUploading.value = false;
  }
};

const removeBackgroundImage = () => {
  // Simply switch back to color - the file stays in storage but will be overwritten next time
  emit('select', customColor.value);
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

.tab-switcher {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  background: #f3f4f6;
  padding: 4px;
  border-radius: 8px;
}

.tab-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  background: transparent;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s;
}

.tab-button:hover {
  color: #374151;
}

.tab-button.active {
  background: white;
  color: #111827;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tab-content {
  animation: fadeIn 0.2s ease-out;
}

.image-upload-area {
  margin-bottom: 16px;
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
  padding: 32px 16px;
  transition: all 0.15s;
  cursor: pointer;
}

.image-upload-area:hover {
  border-color: #3b82f6;
  background: #f9fafb;
}

.image-upload-area.is-dragging {
  border-color: #3b82f6;
  background: #eff6ff;
}

.file-input {
  display: none;
}

.upload-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.upload-icon {
  font-size: 48px;
  color: #9ca3af;
}

.upload-text {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.upload-hint {
  margin: 0;
  font-size: 12px;
  color: #9ca3af;
}

.image-preview-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.image-preview {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  object-fit: contain;
}

.remove-image-button {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  border: 2px solid white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.remove-image-button:hover {
  background: #dc2626;
  transform: scale(1.1);
}

.remove-button {
  width: 100%;
  padding: 10px 20px;
  background: transparent;
  color: #ef4444;
  border: 1px solid #ef4444;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  margin-top: 8px;
}

.remove-button:hover {
  background: #fef2f2;
}

.remove-button:active {
  transform: scale(0.98);
}

.blur-toggle {
  margin-bottom: 16px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.toggle-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.toggle-text {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.toggle-switch {
  position: relative;
  width: 44px;
  height: 24px;
  background: #d1d5db;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
  padding: 0;
}

.toggle-switch.active {
  background: #3b82f6;
}

.toggle-knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.toggle-switch.active .toggle-knob {
  transform: translateX(20px);
}

.blur-slider-wrapper {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

.slider-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.slider-text {
  font-size: 13px;
  color: #6b7280;
}

.slider-value {
  font-size: 13px;
  font-weight: 500;
  color: #3b82f6;
}

.blur-slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e5e7eb;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
}

.blur-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.15s;
}

.blur-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.blur-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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
