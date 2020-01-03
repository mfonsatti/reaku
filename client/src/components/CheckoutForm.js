import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { CardNumberElement, CardCvcElement, CardExpiryElement } from "@stripe/react-stripe-js";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState();

    //Object details
    const amount = 15000;

    const onChangeEmailHandler = event => {
        setEmail(event.target.value);
    };

    const onChangePhoneHandler = event => {
        setPhone(event.target.value);
    };

    const onChangeName = event => {
        setName(event.target.value);
    };

    const onCardElementChangeHandler = event => {
        setError(null);
        if (event.error) {
            console.log("dentro");
            setError(event.error);
        }
    };

    const createPaymentMethod = async () => {
        const cardElement = elements.getElement(CardNumberElement);
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: cardElement,
            billing_details: {
              email,
              name,
              phone
            },
        });

        if (error) {
            console.log("[error]", error);
            setError(error);
        }

        return paymentMethod;
    };

    const createPaymentIntent = async (customer, paymentMethod) => {
        return await axios
            .post("/createPaymentIntent", {
                amount: amount,
                currency: "eur",
                customer: customer.id,
                payment_method: paymentMethod.id,
                receipt_email: customer.email
            })
            .then(response => response.data);
    };

    const createCustomer = async customerData => {
        return await axios.post("/createCustomer", customerData).then(response => response.data);
    };

    const updateCustomer = async customerId => {
        return await axios
            .post("/updateCustomer", { customerId: customerId, phone: phone })
            .then(response => console.log(response.data) || response.data);
    };

    const onSubmitHandler = async event => {
        event.preventDefault();
        const paymentMethod = await createPaymentMethod();
        console.log("paymentMethod", paymentMethod);
        if (paymentMethod) {
            let [customer] = await axios
                .post("/getCustomerByEmail", { email: email })
                .then(response => response.data.data);
            console.log("customer", customer);
            if (customer) {
                if (customer.phone !== phone) {
                    customer = await updateCustomer(customer.id);
                }
                console.log("updatedCustomer", customer);
            } else {
                customer = await createCustomer({
                    name,
                    email,
                    phone
                });
                console.log("new customer", customer);
            }
            const paymentIntent = await createPaymentIntent(customer, paymentMethod);
            console.log("paymentIntent", paymentIntent);
        }
    };
    return (
        <Form onSubmit={onSubmitHandler}>
            <Form.Group controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                    value={email}
                    onChange={onChangeEmailHandler}
                    required
                    type="email"
                    placeholder="Enter email"
                />
                <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
            </Form.Group>

            <Form.Group controlId="phone">
                <Form.Label>Telephone</Form.Label>
                <Form.Control
                    value={phone}
                    onChange={onChangePhoneHandler}
                    required
                    type="tel"
                    pattern="^[0-9]+$"
                    placeholder="Telephone"
                />
                <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
            </Form.Group>

            <Form.Group controlId="name">
                <Form.Label>Titolare della Carta</Form.Label>
                <Form.Control value={name} onChange={onChangeName} required type="text" placeholder="Nome e Cognome" />
            </Form.Group>

            <Form.Group controlId="cardNumber">
                <Form.Label>Numero Carta di Credito</Form.Label>
                <CardNumberElement className="form-control" onChange={onCardElementChangeHandler} />
            </Form.Group>

            <Form.Group controlId="cardExpiry">
                <Form.Label>Data di scadenza</Form.Label>
                <CardExpiryElement className="form-control" onChange={onCardElementChangeHandler} />
            </Form.Group>

            <Form.Group controlId="cardCvc">
                <Form.Label>Codice di sicurezza</Form.Label>
                <CardCvcElement className="form-control" onChange={onCardElementChangeHandler} />
            </Form.Group>

            {error && <Alert variant="danger">{error.message}</Alert>}
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    );
};

export default CheckoutForm;
