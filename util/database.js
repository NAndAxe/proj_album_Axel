import sqlite from "sqlite3";
const db = new sqlite.Database("./data/database.sqlite");

export function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

export async function initializeDatabase() {
    await dbRun("DROP TABLE IF EXISTS albumok;");
    await dbRun(`
      CREATE TABLE IF NOT EXISTS albumok (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        zenekar TEXT,
        cim TEXT,
        ev INTEGER,
        stilus TEXT
      );
    `);
  
    await dbRun(`
      INSERT INTO albumok (zenekar, cim, ev, stilus) VALUES 
      ('Pokolgép', 'Totális Metál', 1986, 'Heavy Metal'),
      ('Pokolgép', 'Metál az ész', 1990, 'Hard Rock');
    `);
  }
  