import path from "path";
import sqlite3 from "sqlite3";

const dbPath = path.join(process.cwd(), "pin.db");
export const db = new sqlite3.Database(
  dbPath,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error("Failed to open database:", err.message);
      return;
    }
    console.log("Connected to the pin database.");
  },
);

export const apiGet = async (query: string) => {
  return await new Promise((resolve, reject) => {
    db.all(query, (err: Error, row: unknown[]) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(row);
    });
  });
};

export const apiPost = async (query: string, values: (string | number)[]) => {
  return await new Promise((resolve, reject) => {
    db.run(query, values, function (err) {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(null);
    });
  });
};

export type PinRow = {
  id: number;
  pin_value: string;
  active: number;
  email: string | null;
  created_at: string;
  updated_at: string;
};

// fetch active pin from the database
export const fetchPinByValue = async (
  pin_value: string,
): Promise<PinRow | undefined> => {
  return await new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM pins WHERE pin_value = ? AND active = 1",
      [pin_value],
      (err, row) => {
        if (err) {
          console.error("Error fetching pin by value:", err.message);
          reject(err);
        } else {
          resolve(row as PinRow | undefined);
        }
      },
    );
  });
};

export const emailHasActivePin = (email: string): Promise<boolean> =>
  new Promise((resolve, reject) => {
    db.get(
      "SELECT 1 AS found FROM pins WHERE lower(email) = ? AND active = 1 LIMIT 1",
      [email.trim().toLowerCase()],
      (err, row) => (err ? reject(err) : resolve(Boolean(row))),
    );
  });