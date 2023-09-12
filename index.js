const PaytmChecksum = require("paytmchecksum");
const sqlite3 = require("sqlite3").verbose();
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const express = require("express");
const dotenv = require("dotenv");
const https = require("https");
const cors = require("cors");

dotenv.config();

const PORT = process.env.PORT || 8000;
const allowedOrigins = ["http://localhost:5173"];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
  
const db = new sqlite3.Database("./db.sqlite3", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    connErr = true;
    console.log("Connected to the database");
  }
});

const fromEmail = process.env.EMAIL_USER;
const emailTransporter = nodemailer.createTransport({
  // secure: true,
  // port: process.env.EMAIL_PORT,
  // host: process.env.EMAIL_HOST,
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: fromEmail,
    pass: process.env.EMAIL_PASS,
  },
});

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

//PayTm
app.post("/initiateTransaction", async (req, res) => {
  const { id, type, events } = req.body;
  let innerClg = false;
  let user = {};
  let price = {};
  console.log(id, type, events);

  db.get("SELECT * FROM users WHERE id=?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ message: "Error fetching user" });
    } else {
      user = row;
      console.log(user);
      innerClg = isInnerCollege(user.email);

      db.get("SELECT * FROM fees", [], (err, row) => {
        let amount = 0;
        if (err) {
          console.log(err);
        } else {
          // -----------------------------
          // -----------------------------

          price = row;
          console.log(price);
          if (type == 1) {
            amount += price.ETHEREAL;
          } else if (type == 2) {
            if (innerClg) {
              amount += price.IC_CONCERT;
            } else {
              amount += price.OC_CONCERT;
            }
          } else if (type == 3) {
            amount += price.ETHEREAL;
            if (innerClg) {
              amount += price.IC_CONCERT;
            } else {
              amount += price.OC_CONCERT;
            }
          }

          console.log(amount);

          // -----------------------------
          // -----------------------------
        }
      });
    }
  });

  // const paytmParams = {
  //   body: {
  //     requestType: "Payment",
  //     mid: "YOUR_MID_HERE",
  //     websiteName: "YOUR_WEBSITE_NAME",
  //     orderId: "ORDERID_98765",
  //     callbackUrl: "https://<callback URL to be used by merchant>",
  //     txnAmount: {
  //       value: "1.00",
  //       currency: "INR",
  //     },
  //     userInfo: {
  //       custId: "CUST_001",
  //     },
  //   },
  // };

  // try {
  //   const checksum = await PaytmChecksum.generateSignature(
  //     JSON.stringify(paytmParams.body),
  //     "YOUR_MERCHANT_KEY"
  //   );

  //   paytmParams.head = {
  //     signature: checksum,
  //   };

  //   const post_data = JSON.stringify(paytmParams);

  // const options = {
  //   /* for Staging */
  //   // hostname: "securegw-stage.paytm.in",

  //   /* for Production */
  //   // hostname: 'securegw.paytm.in',

  //   port: 443,
  //   path: "/theia/api/v1/initiateTransaction?mid=YOUR_MID_HERE&orderId=ORDERID_98765",
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "Content-Length": post_data.length,
  //   },
  // };

  // let response = "";
  // const post_req = https.request(options, (post_res) => {
  //   post_res.on("data", (chunk) => {
  //     response += chunk;
  //   });

  //   post_res.on("end", () => {
  //     console.log("Response: ", response);
  //     res.status(200).json({ response });
  //   });
  // });

  // post_req.write(post_data);
  // post_req.end();
  // } catch (error) {
  //   console.error("Error:", error);
  //   res.status(500).json({ error: "Internal Server Error" });
  // }
});

// Send Login otp
app.post("/send-otp", (req, res) => {
  console.log(req.body);
  const { email } = req.body;

  const otp = randomstring.generate({
    length: 4,
    charset: "numeric",
  });

  db.get("SELECT otp FROM users WHERE email=?", [email], (err, row) => {
    if (row == undefined) {
      const id = uuidv4();
      const { name, phone } = req.body;
      db.run(
        "INSERT INTO users (id, name, email, phone, otp) VALUES (?, ?, ?, ?, ?)",
        [id, name, email, phone, otp],
        (err) => {
          if (err) {
            console.error(err);
            res
              .status(500)
              .json({ message: "Failed to update OTP in database" });
          } else {
            res.json({ message: "OTP Updated in database", ok: true });
            sendMailOTP(email, otp);
          }
        }
      );
    } else {
      db.run(
        "UPDATE users SET otp = ? WHERE email = ?",
        [otp, email],
        (err) => {
          if (err) {
            console.error(err);
            res
              .status(500)
              .json({ message: "Failed to update OTP in database" });
          } else {
            res.json({ message: "OTP Updated in database", ok: true });
            sendMailOTP(email, otp);
          }
        }
      );
    }

    // Send OTP to email
    function sendMailOTP(EMAIL, OTP) {
      const mailOptions = {
        from: { name: "KCG Ethereal", address: fromEmail },
        to: EMAIL,
        subject: "OTP Verification",
        text: `Your OTP for login is: ${OTP}`,
      };

      emailTransporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error(err);
          res.json({ message: "Failed to send OTP via email", sent: false });
        } else {
          console.log(info);
          res.json({ message: "OTP sent to email", sent: true });
        }
      });
    }
  });
});

// Login
app.post("/login", (req, res) => {
  console.log(req.body);
  const { email, otp } = req.body;

  db.get("SELECT id, otp FROM users WHERE email = ?", [email], (err, row) => {
    console.log(row);
    const dbOtp = row.otp != null ? row.otp.toString() : "";

    if (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to retrieve OTP" });
    } else if (!row) {
      res.status(404).json({ message: "User not found" });
    } else if (dbOtp === otp.toString()) {
      db.run(
        "UPDATE users SET otp=NULL, logged_in=TRUE WHERE email = ?",
        [email],
        (err) => {
          if (err) {
            console.error(err);
            res
              .status(500)
              .json({ message: "Failed to update OTP in database" });
          } else {
            res.json({
              message: "Login successful",
              loggedIn: true,
              email: email,
              id: row.id,
            });
          }
        }
      );
    } else {
      res.status(401).json({ message: "Invalid OTP" });
    }
  });
});

//Logout
app.post("/logout", (req, res) => {
  const { id } = req.body;

  db.run(
    "UPDATE users SET otp=NULL, logged_in=FALSE WHERE id = ?",
    [id],
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to logout" });
      } else {
        res.json({
          message: "Logout successful",
          loggedIn: false,
          email: email,
          id: id,
        });
      }
    }
  );
});

// ---------------------- Checker Functions ----------------------

app.post("/check-new", (req, res) => {
  const { email } = req.body;
  console.log(email);

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
    console.log(row);
    if (row == undefined) {
      res.json({ message: "NewUser" });
    } else {
      res.json({ message: "OldUser" });
    }
  });
});

app.post("/check-loggedin", (req, res) => {
  const { id } = req.body;
  console.log(id);

  db.get(
    "SELECT logged_in, combo_eligible FROM users WHERE id = ?",
    [id],
    (err, row) => {
      console.log(row);
      res.json(row);
    }
  );
});

// Base url
app.get("/", (req, res) => {
  res.json({
    name: "ethereal23-backend",
    version: "1.0.0",
    description: "Ethereal23 apis",

    author: "Dharun Sivakumar",
  });
});

// Admin APIS
app.get("/get-fees", (req, res) => {
  db.all("SELECT * FROM fees", [], (err, rows) => {
    console.log(rows);
    res.json(rows);
  });
});

// ---------------------- Helper Functions ----------------------
function isInnerCollege(email) {
  const emailParts = email.split("@");
  if (emailParts[emailParts.length - 1] === "kcgcollege.com") {
    return true;
  }
  return false;
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
