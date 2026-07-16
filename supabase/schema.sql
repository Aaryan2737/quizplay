CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  current_question_index INT DEFAULT 0,
  score INT DEFAULT 0,
  total_time_spent FLOAT DEFAULT 0,
  question_started_at TIMESTAMPTZ,
  q10_response TEXT DEFAULT NULL,
  completed BOOLEAN DEFAULT false
);

-- Ensure lowercase username constraint
ALTER TABLE participants ADD CONSTRAINT lowercase_username CHECK (username = lower(username));

-- Composite index for extremely fast leaderboard querying
CREATE INDEX idx_leaderboard ON participants (score DESC, total_time_spent ASC);
