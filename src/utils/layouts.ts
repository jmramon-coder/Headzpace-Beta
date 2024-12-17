import type { Widget } from '../types';

const GRID_GAP = 20;
const CONTAINER_PADDING = 40;
const CONTAINER_WIDTH = 1200;
const COLUMN_COUNT = 12;
const USABLE_WIDTH = CONTAINER_WIDTH - (2 * CONTAINER_PADDING);
const COLUMN_WIDTH = Math.floor((USABLE_WIDTH - (GRID_GAP * (COLUMN_COUNT - 1))) / COLUMN_COUNT);

const calculateWidth = (columns: number) => COLUMN_WIDTH * columns + (GRID_GAP * (columns - 1));

interface WidgetSizes {
  [key: string]: { width: number; height: number };
}

const BASE_SIZES: WidgetSizes = {
  chat: { width: calculateWidth(6), height: 320 },
  media: { width: calculateWidth(6), height: 200 },
  clock: { width: calculateWidth(3), height: 160 },
  radio: { width: calculateWidth(3), height: 160 },
  tasks: { width: calculateWidth(6), height: 200 }
};

const getColumnPosition = (column: number): number => {
  return CONTAINER_PADDING + (column * COLUMN_WIDTH) + (column * GRID_GAP);
};

// Layout 1: Standard Grid
const standardLayout = (widget: Widget, index: number): Widget => {
  const size = { ...BASE_SIZES[widget.type] };
  let x = getColumnPosition(0), y = CONTAINER_PADDING;

  switch (index) {
    case 0: // Chat (left column)
      x = getColumnPosition(0);
      break;
    case 1: // Media 1 (right column)
      x = getColumnPosition(6);
      break;
    case 2: // Media 2 (left column)
      x = getColumnPosition(0);
      y += size.height + GRID_GAP;
      break;
    case 3: // Clock (right column)
      x = getColumnPosition(6);
      y += size.height + GRID_GAP;
      break;
    case 4: // Music (right column)
      x = getColumnPosition(6);
      y += BASE_SIZES.media.height + GRID_GAP;
      size.width = calculateWidth(3);
      size.height = 180;
      break;
    case 5: // Tasks (right column)
      x = getColumnPosition(6);
      y += BASE_SIZES.media.height + GRID_GAP * 3;
      break;
  }

  return { ...widget, position: { x, y }, size };
};

// Layout 2: Three Column Grid
const threeColumnLayout = (widget: Widget, index: number): Widget => {
  const size = { ...BASE_SIZES[widget.type] };
  let x = getColumnPosition(0);
  let y = CONTAINER_PADDING;

  switch (index) {
    case 0: // Chat (center, full width)
      x = getColumnPosition(3);
      size.width = calculateWidth(6);
      size.height = 280;
      break;
    case 1: // Media 1 (left)
      x = getColumnPosition(0);
      y += BASE_SIZES.chat.height + GRID_GAP;
      size.width = calculateWidth(3);
      break;
    case 2: // Media 2 (center)
      x = getColumnPosition(3);
      y += BASE_SIZES.chat.height + GRID_GAP;
      size.width = calculateWidth(6);
      break;
    case 3: // Clock (right)
      x = getColumnPosition(9);
      y += BASE_SIZES.chat.height + GRID_GAP;
      size.width = calculateWidth(3);
      break;
    case 4: // Music (left)
      x = getColumnPosition(0);
      y += BASE_SIZES.chat.height + BASE_SIZES.media.height + GRID_GAP * 2;
      break;
    case 5: // Tasks (right)
      x = getColumnPosition(9);
      y += BASE_SIZES.chat.height + BASE_SIZES.clock.height + GRID_GAP * 2;
      size.width = calculateWidth(3);
      break;
  }

  return { ...widget, position: { x, y }, size };
};

// Layout 3: Balanced Grid
const balancedLayout = (widget: Widget, index: number): Widget => {
  const size = { ...BASE_SIZES[widget.type] };
  let x = getColumnPosition(0);
  let y = CONTAINER_PADDING;

  switch (index) {
    case 0: // Chat (left top)
      size.width = calculateWidth(6);
      size.height = 280;
      break;
    case 1: // Media 1 (right top)
      x = getColumnPosition(6);
      size.width = calculateWidth(6);
      break;
    case 2: // Media 2 (left middle)
      y += BASE_SIZES.chat.height + GRID_GAP;
      size.width = calculateWidth(6);
      break;
    case 3: // Clock (left bottom)
      y += BASE_SIZES.chat.height + BASE_SIZES.media.height + GRID_GAP * 2;
      size.width = calculateWidth(4);
      break;
    case 4: // Music (middle bottom)
      x = getColumnPosition(4);
      y += BASE_SIZES.chat.height + BASE_SIZES.media.height + GRID_GAP * 2;
      break;
    case 5: // Tasks (right bottom)
      x = getColumnPosition(8);
      y += BASE_SIZES.chat.height + BASE_SIZES.media.height + GRID_GAP * 2;
      size.width = calculateWidth(4);
      break;
  }

  return { ...widget, position: { x, y }, size };
};

// Layout 4: Focus Mode
const focusLayout = (widget: Widget, index: number): Widget => {
  const size = { ...BASE_SIZES[widget.type] };
  let x = getColumnPosition(0), y = CONTAINER_PADDING;

  if (index === 0) { // Main chat widget
    return {
      ...widget,
      position: { x: getColumnPosition(1), y: CONTAINER_PADDING },
      size: { width: calculateWidth(10), height: 300 }
    };
  }

  // Small widgets in a row below
  x = getColumnPosition(1 + ((index - 1) * 2));
  y += 320;
  size.width = calculateWidth(2);
  size.height = 160;
  
  return { ...widget, position: { x, y }, size };
};

// Layout 5: Dashboard
const dashboardLayout = (widget: Widget, index: number): Widget => {
  const size = { ...BASE_SIZES[widget.type] };
  let x = getColumnPosition(0), y = CONTAINER_PADDING;

  switch (index) {
    case 0: // Chat (center, larger)
      x = getColumnPosition(3);
      size.width = calculateWidth(6);
      size.height = 280;
      break;
    case 1: // Media 1 (top left)
      size.width = calculateWidth(3);
      break;
    case 2: // Media 2 (bottom left)
      y += BASE_SIZES.media.height + GRID_GAP;
      size.width = calculateWidth(3);
      break;
    case 3: // Clock (top right)
      x = getColumnPosition(9);
      size.width = calculateWidth(3);
      break;
    case 4: // Music (middle right)
      x = getColumnPosition(9);
      y += BASE_SIZES.clock.height + GRID_GAP;
      break;
    case 5: // Tasks (bottom right)
      x = getColumnPosition(9);
      y += BASE_SIZES.radio.height + GRID_GAP * 2;
      size.width = calculateWidth(3);
      break;
  }

  return { ...widget, position: { x, y }, size };
};

const layouts = [
  standardLayout,
  threeColumnLayout,
  balancedLayout,
  focusLayout,
  dashboardLayout
];

export const getNextLayout = (widgets: Widget[], currentLayout: number): Widget[] => {
  const nextLayout = (currentLayout + 1) % layouts.length;
  return widgets.map((widget, index) => layouts[nextLayout](widget, index));
};

import { GRID_SIZE } from './grid';
import type { CustomLayout } from '../types';

export const DEFAULT_LAYOUT: CustomLayout = {
  id: 'default',
  name: 'Default',
  widgets: [
    {
      id: 'default-chat',
      type: 'chat',
      position: { x: GRID_SIZE * 24, y: GRID_SIZE * 12 },
      size: { width: GRID_SIZE * 40, height: GRID_SIZE * 32 }
    },
    {
      id: 'default-tasks',
      type: 'tasks',
      position: { x: GRID_SIZE * 66, y: GRID_SIZE * 12 },
      size: { width: GRID_SIZE * 32, height: GRID_SIZE * 32 }
    },
    {
      id: 'default-media-1',
      type: 'media',
      position: { x: GRID_SIZE * 24, y: GRID_SIZE * 46 },
      size: { width: GRID_SIZE * 36, height: GRID_SIZE * 28 },
      defaultImages: [
        'https://res.cloudinary.com/dpfbkeapy/image/upload/v1733940233/maza2019_surrealistic_linocut_black__white_art_of_a_guyanese_bl_5b4f758b-b775-40d0-979e-7a75b5482ae9_foh91l.png',
        'https://res.cloudinary.com/dpfbkeapy/image/upload/v1733940237/joekr_engineer_armor_--v_6.1_e3b1abe8-412f-4fd4-96f1-1018efb9877f_b2mbnz.png'
      ]
    },
    {
      id: 'default-media-2',
      type: 'media',
      position: { x: GRID_SIZE * 62, y: GRID_SIZE * 46 },
      size: { width: GRID_SIZE * 36, height: GRID_SIZE * 28 },
      defaultImages: [
        'https://res.cloudinary.com/dpfbkeapy/image/upload/v1733947883/creatorstuart_Red_balloons_float_on_a_misty_street_in_1920s_Der_d5c5aeac-c3f4-4335-a199-f60beb9e6064_b7q3di.png',
        'https://res.cloudinary.com/dpfbkeapy/image/upload/v1733947880/s3chek_92897_real_image_of_wooden_bench_in_nature_on_top_of_a_h_cf577a48-3c31-4ee5-85fa-4ea849a8bc24_fvirjt.png'
      ]
    },
    {
      id: 'default-clock',
      type: 'clock',
      position: { x: GRID_SIZE * 100, y: GRID_SIZE * 12 },
      size: { width: GRID_SIZE * 24, height: GRID_SIZE * 15 }
    },
    {
      id: 'default-radio',
      type: 'radio',
      position: { x: GRID_SIZE * 100, y: GRID_SIZE * 29 },
      size: { width: GRID_SIZE * 24, height: GRID_SIZE * 45 }
    }
  ],
  createdAt: 0
};