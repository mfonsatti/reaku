import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

const Checkout = () => {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const onChangeEmailHandler = event => {
        setEmail(event.target.value);
    };

    const onChangePhoneHandler = event => {
        setPhone(event.target.value);
    };

    const onSubmitHandler = async event => {
        event.preventDefault();
        const customer = await axios.post("/getCustomerByEmail", { email: email }).then(response => response.data.data);
        if (customer.length) {
            console.log('customer', customer)
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
                    type="text"
                    placeholder="Telephone"
                />
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    );
};

export default Checkout;
