import path from "path";
import sqlite3 from "sqlite3";

const dbPath = path.join(process.cwd(), "tasks.db");
export const db = new sqlite3.Database(
    dbPath,
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log("Connected to the database.");
    }
);

db.serialize(() => {
    db.run(
        `
        CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        entered_id TEXT NOT NULL,
        stage TEXT NOT NULL,
        recieved DATETIME,
        finished DATETIME,
        quantity INT
      );
    `,
        (err: Error) => {
            if (err) {
                console.error(err.message);
            }
            console.log("tasks table created successfully.");
        }
    );
});

export const apiGet = async (query: string) => {
    return await new Promise((resolve, reject) => {
        db.all(query, (err: Error, row) => {
            if (err) {
                console.log(err);
                return reject(err);
            }
            return resolve(row);
        });
    });
};

export const apiPost = async (query: string, values: string[]) => {
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

export const apiDelete = async (query: string, values: string[]) => {
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

export const apiPut = async (query: string, values: string[]) => {
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