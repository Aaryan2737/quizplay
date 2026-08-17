CREATE TABLE settings (
  id INT PRIMARY KEY DEFAULT 1,
  is_quiz_active BOOLEAN DEFAULT false,
  show_leaderboard BOOLEAN DEFAULT false
);

INSERT INTO settings (id, is_quiz_active, show_leaderboard) VALUES (1, false, false);
