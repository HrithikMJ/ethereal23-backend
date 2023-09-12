// const express = require("express");
// const https = require("https");
// const bodyParser = require("body-parser");
// const PaytmChecksum = require("./PaytmChecksum");

// const app = express();
// app.use(bodyParser.json());

// app.post("/initiateTransaction", async (req, res) => {
//   const paytmParams = {
//     body: {
//       requestType: "Payment",
//       mid: "YOUR_MID_HERE",
//       websiteName: "YOUR_WEBSITE_NAME",
//       orderId: "ORDERID_98765",
//       callbackUrl: "https://<callback URL to be used by merchant>",
//       txnAmount: {
//         value: "1.00",
//         currency: "INR",
//       },
//       userInfo: {
//         custId: "CUST_001",
//       },
//     },
//   };

//   try {
//     const checksum = await PaytmChecksum.generateSignature(
//       JSON.stringify(paytmParams.body),
//       "YOUR_MERCHANT_KEY"
//     );

//     paytmParams.head = {
//       signature: checksum,
//     };

//     const post_data = JSON.stringify(paytmParams);

//     const options = {
//       /* for Staging */
//       hostname: "securegw-stage.paytm.in",

//       /* for Production */
//       // hostname: 'securegw.paytm.in',

//       port: 443,
//       path: "/theia/api/v1/initiateTransaction?mid=YOUR_MID_HERE&orderId=ORDERID_98765",
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Content-Length": post_data.length,
//       },
//     };

//     let response = "";
//     const post_req = https.request(options, (post_res) => {
//       post_res.on("data", (chunk) => {
//         response += chunk;
//       });

//       post_res.on("end", () => {
//         console.log("Response: ", response);
//         res.status(200).json({ response });
//       });
//     });

//     post_req.write(post_data);
//     post_req.end();
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------

// const { URLSearchParams } = require("url");
// const fetch = require("node-fetch");
// const encodedParams = new URLSearchParams();
// encodedParams.set("key", "");
// encodedParams.set("command", "");
// encodedParams.set("var1", "");
// encodedParams.set("var2", "");
// encodedParams.set("var3", "");
// encodedParams.set("var4", "");
// encodedParams.set("var5", "");
// encodedParams.set("var6", "");
// encodedParams.set("var7", "");
// encodedParams.set("var8", "");
// encodedParams.set("var9", "");
// encodedParams.set("hash", "");
// const url = "https://test.payu.in/merchant/postservice?form=2";
// const options = {
//   method: "POST",
//   headers: {
//     Accept: "application/json",
//     "Content-Type": "application/x-www-form-urlencoded",
//   },
//   body: encodedParams,
// };
// fetch(url, options)
//   .then((res) => res.json())
//   .then((json) => console.log(json))
//   .catch((err) => console.error("error:" + err));

// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------

const { URLSearchParams } = require("url");
const fetch = require("node-fetch");
const encodedParams = new URLSearchParams();
encodedParams.set("key", "JP***g");
encodedParams.set("amount", "10.00");
encodedParams.set("txnid", "txnid97701601344");
encodedParams.set("firstname", "PayU User");
encodedParams.set("email", "test@gmail.com");
encodedParams.set("phone", "9876543210");
encodedParams.set("productinfo", "iPhone");
encodedParams.set(
  "surl",
  "https://test-payment-middleware.payu.in/simulatorResponse"
);
encodedParams.set(
  "furl",
  "https://test-payment-middleware.payu.in/simulatorResponse"
);
encodedParams.set("pg", "");
encodedParams.set("bankcode", "");
encodedParams.set("ccnum", "");
encodedParams.set("ccexpmon", "");
encodedParams.set("ccexpyr", "");
encodedParams.set("ccvv", "");
encodedParams.set("ccname", "");
encodedParams.set("txn_s2s_flow", "");
encodedParams.set(
  "hash",
  "2ac92e0ca85d8f0ca0dd2914b025b01d46f46b181271a4ad7014e084d104b40117ac23d39307d41c83010069f2895d6e59a3b146a467d99501db9b42c09f9e1d"
);
const url = "https://test.payu.in/merchant/_payment";
const options = {
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: encodedParams,
};
fetch(url, options)
  .then((res) => res.json())
  .then((json) => console.log(json))
  .catch((err) => console.error("error:" + err));
