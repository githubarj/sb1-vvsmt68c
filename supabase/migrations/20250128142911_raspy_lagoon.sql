/*
  # Energy Tracking System Database Schema

  1. New Tables
    - `energy_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `date` (timestamptz)
      - `energy_level` (integer)
      - `notes` (text)
      - `created_at` (timestamptz)
    
    - `symptoms`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `created_at` (timestamptz)
    
    - `positive_factors`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `created_at` (timestamptz)
    
    - `activities`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `category` (text)
      - `created_at` (timestamptz)
    
    - Junction tables for many-to-many relationships:
      - `energy_log_symptoms`
      - `energy_log_positive_factors`
      - `energy_log_activities`

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to:
      - Read their own data
      - Create new logs
      - Update their own logs
      - Delete their own logs
*/

-- Create energy_logs table
CREATE TABLE IF NOT EXISTS energy_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  date timestamptz NOT NULL DEFAULT now(),
  energy_level integer NOT NULL CHECK (energy_level >= 1 AND energy_level <= 10),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create symptoms table
CREATE TABLE IF NOT EXISTS symptoms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create positive_factors table
CREATE TABLE IF NOT EXISTS positive_factors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  category text NOT NULL CHECK (category IN ('work', 'break', 'social')),
  created_at timestamptz DEFAULT now()
);

-- Create junction tables
CREATE TABLE IF NOT EXISTS energy_log_symptoms (
  energy_log_id uuid REFERENCES energy_logs ON DELETE CASCADE,
  symptom_id uuid REFERENCES symptoms ON DELETE CASCADE,
  PRIMARY KEY (energy_log_id, symptom_id)
);

CREATE TABLE IF NOT EXISTS energy_log_positive_factors (
  energy_log_id uuid REFERENCES energy_logs ON DELETE CASCADE,
  positive_factor_id uuid REFERENCES positive_factors ON DELETE CASCADE,
  PRIMARY KEY (energy_log_id, positive_factor_id)
);

CREATE TABLE IF NOT EXISTS energy_log_activities (
  energy_log_id uuid REFERENCES energy_logs ON DELETE CASCADE,
  activity_id uuid REFERENCES activities ON DELETE CASCADE,
  PRIMARY KEY (energy_log_id, activity_id)
);

-- Enable Row Level Security
ALTER TABLE energy_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE positive_factors ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE energy_log_symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE energy_log_positive_factors ENABLE ROW LEVEL SECURITY;
ALTER TABLE energy_log_activities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own energy logs"
  ON energy_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own energy logs"
  ON energy_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own energy logs"
  ON energy_logs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own energy logs"
  ON energy_logs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for reference tables
CREATE POLICY "Everyone can read reference data"
  ON symptoms
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Everyone can read reference data"
  ON positive_factors
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Everyone can read reference data"
  ON activities
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for junction tables
CREATE POLICY "Users can read their own energy log relations"
  ON energy_log_symptoms
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM energy_logs
    WHERE energy_logs.id = energy_log_symptoms.energy_log_id
    AND energy_logs.user_id = auth.uid()
  ));

CREATE POLICY "Users can read their own energy log relations"
  ON energy_log_positive_factors
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM energy_logs
    WHERE energy_logs.id = energy_log_positive_factors.energy_log_id
    AND energy_logs.user_id = auth.uid()
  ));

CREATE POLICY "Users can read their own energy log relations"
  ON energy_log_activities
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM energy_logs
    WHERE energy_logs.id = energy_log_activities.energy_log_id
    AND energy_logs.user_id = auth.uid()
  ));

-- Insert initial reference data
INSERT INTO symptoms (name) VALUES
  ('Fatigue'),
  ('Stress'),
  ('Poor Sleep'),
  ('Dehydration'),
  ('Hunger'),
  ('Screen Fatigue'),
  ('Physical Tension'),
  ('Mental Fog'),
  ('Overwhelm'),
  ('Low Motivation')
ON CONFLICT (name) DO NOTHING;

INSERT INTO positive_factors (name) VALUES
  ('Good Sleep'),
  ('Exercise'),
  ('Healthy Meal'),
  ('Meditation'),
  ('Social Time'),
  ('Nature Walk'),
  ('Deep Work'),
  ('Reading'),
  ('Creative Activity'),
  ('Short Break')
ON CONFLICT (name) DO NOTHING;

INSERT INTO activities (name, category) VALUES
  ('Exercise', 'work'),
  ('Deep work session', 'work'),
  ('Learning new skills', 'work'),
  ('Important presentations', 'work'),
  ('Morning meditation', 'break'),
  ('Stretching routine', 'break'),
  ('Quick walk', 'break'),
  ('Healthy breakfast break', 'break'),
  ('Team check-in', 'social'),
  ('Collaborative planning', 'social'),
  ('Mentoring session', 'social'),
  ('Knowledge sharing', 'social')
ON CONFLICT (name) DO NOTHING;