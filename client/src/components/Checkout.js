import React from "react";
import { Elements } from "react-stripe-elements";
import InjectedCheckoutForm from './CheckoutForm';

import axios from "axios";

const Checkout = () => {
  return (
    <Elements>
      <InjectedCheckoutForm/>
    </Elements>
  );
};

export default injectStripe(Checkout);
