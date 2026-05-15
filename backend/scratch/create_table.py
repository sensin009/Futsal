import sqlite3
import os

db_path = 'backend/dev.db'
if not os.path.exists(db_path):
    print(f"DB not found at {db_path}")
    exit(1)

conn = sqlite3.connect(db_path)
curr = conn.cursor()
curr.execute("""
CREATE TABLE IF NOT EXISTS match_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    match_id INTEGER NOT NULL, 
    player_id INTEGER, 
    team_id INTEGER NOT NULL, 
    event_type VARCHAR(20) NOT NULL, 
    minute INTEGER NOT NULL, 
    description VARCHAR(255), 
    created_at DATETIME DEFAULT (datetime('now','localtime')), 
    FOREIGN KEY(match_id) REFERENCES matches(id), 
    FOREIGN KEY(player_id) REFERENCES users(id), 
    FOREIGN KEY(team_id) REFERENCES teams(id)
)
""")
conn.commit()
conn.close()
print("Table created successfully")
