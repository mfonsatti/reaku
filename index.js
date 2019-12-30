const express = require("express");
const path = require("path");
const stripe = require("stripe")("sk_test_O5gM792YabwAKmO8d9l6xzT800KCQuCrYE");
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

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Password generator listening on ${port}`);
