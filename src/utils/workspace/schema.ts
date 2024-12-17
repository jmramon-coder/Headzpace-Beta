import { z } from 'zod';

// Widget position schema
const PositionSchema = z.object({
  x: z.number(),
  y: z.number()
});

// Widget size schema
const SizeSchema = z.object({
  width: z.number(),
  height: z.number()
});

// Widget schema
export const WidgetSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['notes', 'clock', 'tasks', 'media', 'chat', 'radio']),
  position: PositionSchema,
  size: SizeSchema,
  defaultImages: z.array(z.string().url()).optional()
});

// Preferences schema
export const PreferencesSchema = z.object({
  theme: z.enum(['light', 'dark']).optional(),
  autoSave: z.boolean().optional()
});

// Complete workspace schema
export const WorkspaceSchema = z.object({
  version: z.string(),
  widgets: z.array(WidgetSchema),
  preferences: PreferencesSchema.optional(),
  mediaFiles: z.record(z.string(), z.string()).optional()
});

// Type inference
export type WorkspaceSchemaType = z.infer<typeof WorkspaceSchema>;