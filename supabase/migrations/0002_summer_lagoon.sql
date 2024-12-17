/*
  # Layout Storage Schema

  1. New Tables
    - `layouts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `name` (text)
      - `description` (text)
      - `widgets` (jsonb)
      - `is_default` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on layouts table
    - Add policies for CRUD operations
    - Only allow users to manage their own layouts
*/

CREATE TABLE IF NOT EXISTS layouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  widgets jsonb NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure valid JSON structure for widgets
  CONSTRAINT valid_widgets_json CHECK (
    jsonb_typeof(widgets) = 'array'
  )
);

-- Enable RLS
ALTER TABLE layouts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own layouts"
  ON layouts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create layouts"
  ON layouts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own layouts"
  ON layouts
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own layouts"
  ON layouts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Updated at trigger
CREATE TRIGGER update_layouts_updated_at
  BEFORE UPDATE ON layouts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Ensure only one default layout per user
CREATE UNIQUE INDEX one_default_layout_per_user 
  ON layouts (user_id) 
  WHERE is_default = true;