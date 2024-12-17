/*
  # Widget Storage Schema

  1. New Tables
    - `widgets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `type` (text)
      - `position_x` (integer)
      - `position_y` (integer)
      - `width` (integer)
      - `height` (integer)
      - `settings` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on widgets table
    - Add policies for CRUD operations
    - Only allow users to manage their own widgets
*/

CREATE TABLE IF NOT EXISTS widgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  position_x integer NOT NULL,
  position_y integer NOT NULL,
  width integer NOT NULL,
  height integer NOT NULL,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Validate widget type
  CONSTRAINT valid_widget_type CHECK (
    type IN ('notes', 'clock', 'tasks', 'media', 'chat', 'radio')
  ),
  
  -- Ensure reasonable dimensions
  CONSTRAINT valid_dimensions CHECK (
    width > 0 AND height > 0 AND
    position_x >= 0 AND position_y >= 0
  )
);

-- Enable RLS
ALTER TABLE widgets ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own widgets"
  ON widgets
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create widgets"
  ON widgets
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own widgets"
  ON widgets
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own widgets"
  ON widgets
  FOR DELETE
  USING (auth.uid() = user_id);

-- Updated at trigger
CREATE TRIGGER update_widgets_updated_at
  BEFORE UPDATE ON widgets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();