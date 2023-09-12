const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./db.sqlite3", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    connErr = true;
    console.log("Connected to the database");
  }
});

const QUERY_create_table = `
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(15) NOT NULL,
  ethereal VARCHAR(50),
  concert VARCHAR(50),
  combo_eligible BOOLEAN,
  logged_in BOOLEAN,
  otp VARCHAR(10),
  logs TEXT
);`;

const QUERY_create_table_fees = `
CREATE TABLE fees (
  ETHEREAL INT,
  IC_COMBO_CONCERT INT,
  OC_COMBO_CONCERT INT,
  IC_CONCERT INT,
  OC_CONCERT INT
);`;

function runQuery(QUERY) {
  db.all(QUERY, [], (err, res) => {
    if (err) {
      console.error("Error executing query:", err.message);
    } else {
      console.log(res);
    }
  });
}

function selectQuery() {
  db.get(
    "select * from users where email=?",
    ["dharunsivakumar002@gmail.com"],
    (err, row) => {
      console.log(err);
      console.log(row);
    }
  );
}

// runQuery(QUERY_create_table_fees);
// runQuery(QUERY_create_table);
// runQuery("DROP TABLE fees");
// selectQuery();

// db.run(
//   "INSERT INTO fees (ETHEREAL, IC_COMBO_CONCERT, OC_COMBO_CONCERT, IC_CONCERT, OC_CONCERT) VALUES (?, ?, ?, ?, ?)",
//   [350, 550, 849, 900, 1099]
// );
