const express = require("express");
const path = require("path");
const env = require("dotenv").config({ path: "./.env" });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const bodyParser = require("body-parser");

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

app.post("/getCustomerByEmail", (req, res) => {
    stripe.customers.list({ limit: 1, email: req.body.email }, (err, customers) => res.send(customers));
});

app.get("/publicKey", (req, res) => {
    res.send({ publicKey: process.env.STRIPE_PUBLIC_KEY });
  });

app.post("/createPaymentIntent", async (req, res) => {
    const body = req.body;
    const productDetails = getProductDetails();
  
    const options = {
      ...body,
      amount: productDetails.amount,
      currency: productDetails.currency
    };
  
    try {
      const paymentIntent = await stripe.paymentIntents.create(options);
      res.json(paymentIntent);
    } catch (err) {
      res.json(err);
    }
  });

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Password generator listening on ${port}`);
