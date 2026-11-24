import { db } from "./database";

export const migrate = () => {
  db.serialize(() => {
    // 1. New databases get the full table, including email
    db.run(
      `
      CREATE TABLE IF NOT EXISTS pins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pin_value TEXT NOT NULL,
        email TEXT,
        active BOOLEAN NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `,
      (err: Error | null) => {
        if (err) {
          console.error("Failed to create pins table:", err.message);
          return;
        }
        console.log("pins table ready.");
      },
    );

    // 2. Existing databases: add email only if the column is missing.
    //    CREATE TABLE IF NOT EXISTS skips tables that already exist, and SQLite
    //    has no "ADD COLUMN IF NOT EXISTS", so we check the table's columns first.
    db.all(
      "PRAGMA table_info(pins)",
      (err: Error | null, columns: { name: string }[]) => {
        if (err) {
          console.error("Failed to read pins columns:", err.message);
          return;
        }
        if (columns.some((c) => c.name === "email")) {
          createActivePinIndex();
          return;
        }

        db.run(
          "ALTER TABLE pins ADD COLUMN email TEXT",
          (alterErr: Error | null) => {
            if (alterErr) {
              console.error("Failed to add email column:", alterErr.message);
              return;
            }
            console.log("email column added to pins.");
            createActivePinIndex();
          },
        );
      },
    );

    /**
 * Enforces "at most one active PIN per email".
 * Safe to run repeatedly.
 */
const createActivePinIndex = () => {
    db.serialize(() => {
        // The old rule allowed one active PIN in the WHOLE table. Left in place,
        // it would stop a second person from ever having an active PIN.
        db.run("DROP INDEX IF EXISTS idx_one_active_pin", (err: Error | null) => {
            if (err) console.error("Failed to drop old index:", err.message);
        });

        // Clean up existing duplicates first, or creating the index fails.
        // For each email, the newest active PIN stays active and older ones are deactivated.
        db.run(
            `
      UPDATE pins SET active = 0
      WHERE active = 1
        AND email IS NOT NULL
        AND id NOT IN (
          SELECT MAX(id) FROM pins
          WHERE active = 1 AND email IS NOT NULL
          GROUP BY lower(email)
        );
      `,
            (err: Error | null) => {
                if (err) console.error("Failed to deactivate duplicates:", err.message);
            }
        );

        // Unique only among ACTIVE rows, compared case-insensitively.
        // Inactive rows (old rotated PINs) can repeat the same email freely.
        db.run(
            `
      CREATE UNIQUE INDEX IF NOT EXISTS idx_one_active_pin_per_email
        ON pins (lower(email))
        WHERE active = 1 AND email IS NOT NULL;
      `,
            (err: Error | null) => {
                if (err) {
                    console.error("Failed to create per-email index:", err.message);
                    return;
                }
                console.log("one-active-pin-per-email index ready.");
            }
        );
    });
};
  });
};

migrate();
