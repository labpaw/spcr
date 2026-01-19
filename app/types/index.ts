/**
 * Application Types
 */

export type ElementType = 'text' | 'link' | 'image' | 'shape';

export type ShapeType = 'circle' | 'square';

export interface Position {
  x: number;
  y: number;
}

export interface BaseElement {
  id: number;
  type: ElementType;
  x: number; // Percentage of canvas width (0-100)
  y: number; // Percentage of canvas height (0-100)
}

export interface TextElement extends BaseElement {
  type: 'text';
  content: string;
  fontSize?: number; // Font size in pixels (default: 16)
  fontColor?: string; // Hex color (default: #000000)
  fontFamily?: string; // Google Font name (default: Inter)
  fontWeight?: number; // Font weight (default: 400)
}

export interface LinkElement extends BaseElement {
  type: 'link';
  content: string;
  url: string;
  icon?: string; // Icon URL/data URL
}

export interface ImageElement extends BaseElement {
  type: 'image';
  url: string;
  width?: number;
  height?: number;
  borderRadius?: number; // 0 = square, 50 = circle
  locked?: boolean;
}

export interface ShapeElement extends BaseElement {
  type: 'shape';
  shapeType: ShapeType;
  width: number;
  height: number;
  color: string;
  coverImage?: string;
}

export type SpacerElement = TextElement | LinkElement | ImageElement | ShapeElement;

export interface DragState {
  isDragging: boolean;
  element: SpacerElement | null;
  startX: number;
  startY: number;
  elementStartX: number;
  elementStartY: number;
}

export interface ResizeState {
  isResizing: boolean;
  element: ImageElement | null;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  aspectRatio?: number;
}

export interface BackgroundTheme {
  name: string;
  value: string;
}
