import { db } from "./database";

export const migrate = () => {
    db.serialize(() => {
        db.run(
            `
      CREATE TABLE IF NOT EXISTS pins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pin_value TEXT NOT NULL,
        active BOOLEAN NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `,
            (err: Error) => {
                if (err) {
                    console.error(err.message);
                }
                console.log("pins table created successfully.");
            }
        );
        db.run(
            `
      CREATE UNIQUE INDEX IF NOT EXISTS idx_one_active_pin
        ON pins (active) WHERE active = 1;
      `,
            (err: Error | null) => {
                if (err) {
                    console.error("Failed to create unique index:", err.message);
                    return;
                }
                console.log("one-active-pin index ready.");
            }
        );
    });
}

migrate()