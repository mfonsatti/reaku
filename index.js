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

app.get("/getStripePublicKey", (req, res) => {
    res.send({ stripePublicKey: process.env.STRIPE_PUBLIC_KEY });
});

app.post("/createCustomer", (req, res) => {
  stripe.customers.create(req.body, (err, customers) => {
      if (err) {
          console.log("err", err);
      }
      res.send(customers);
  });
});

app.post("/updateCustomer", (req, res) => {
    stripe.customers.update(req.body.customerId, { phone: req.body.phone }, (err, customers) => {
        if (err) {
            console.log("err", err);
        }
        console.log(customers)
        res.send(customers);
    });
});

app.post("/createPaymentIntent", async (req, res) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create(req.body);
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

console.log(`Server listening on ${port}`);
