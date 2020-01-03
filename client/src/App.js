import React, { useState, useEffect } from "react";
import { StripeProvider } from "react-stripe-elements";
import Checkout from "./components/Checkout";

export default function App() {
  const [stripePublicKey, setStripePublicKey] = useState("");

  useEffect(async () => {
    setStripePublicKey(
      await axios
        .get("/getStripePublicKey")
        .then(() => response.stripePublicKey)
    );
  });
  return (
    <StripeProvider apiKey={stripePublicKey}>
      <Checkout />
    </StripeProvider>
  );
}
