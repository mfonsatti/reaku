import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import Checkout from "./components/Checkout";
import axios from "axios";

export default function App() {
    const [stripe, setStripe] = useState(null);

    useEffect(() => {
        if (window.Stripe && !stripe) {
            getStripePublicKey().then(response => setStripe(window.Stripe(response)));
        }
    });

    const getStripePublicKey = async () => {
        const response = await axios.get("/getStripePublicKey");
        return response.data.stripePublicKey;
    };

    return (
        <Elements stripe={stripe}>
            <Checkout />
        </Elements>
    );
}
