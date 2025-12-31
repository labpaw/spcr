/**
 * Application Constants
 */

import type { BackgroundTheme } from '~/types';
import { colors } from './design-tokens';

export const BACKGROUND_THEMES: BackgroundTheme[] = [
  { name: 'Light Gray', value: colors.background.lightGray },
  { name: 'White', value: colors.background.white },
  { name: 'Warm Beige', value: colors.background.warmBeige },
  { name: 'Soft Blue', value: colors.background.softBlue },
  { name: 'Mint Green', value: colors.background.mintGreen },
  { name: 'Lavender', value: colors.background.lavender },
  { name: 'Peach', value: colors.background.peach },
  { name: 'Dark Mode', value: colors.background.darkMode },
  { name: 'Navy', value: colors.background.navy },
];

export const DEFAULT_BACKGROUND = colors.background.lightGray;

export const STORAGE_KEYS = {
  ELEMENTS: 'spacer-elements',
  BACKGROUND: 'spacer-background',
} as const;

export const ELEMENT_CONSTRAINTS = {
  MIN_SIZE: 30,
  MIN_TEXT_WIDTH: 100,
  MIN_TEXT_HEIGHT: 80,
  MIN_LINK_WIDTH: 250,
} as const;
