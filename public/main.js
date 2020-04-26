const checkout = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    //Generates an order_id required to create razorpay pop up
    const id = await (await fetch('http://localhost:4000/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: form.get("amount") })
    })).text();


    const postPaymentProcess = (res) => {
        fetch('http://localhost:4000/success', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: form.get("amount"),
                first_name: form.get("fname"),
                last_name: form.get("lname"),
                payment_id: res.razorpay_payment_id,
                order_id: res.razorpay_order_id,
                signature: res.razorpay_signature
            })
        })
    };//Function for saving the data to database

    const options = {
        key: "rzp_test_4V6xkGFsNGx3bJ",
        amount: form.get("amount"),
        currency: "INR",
        name: "Shaastra",
        description: "Test Transaction",
        order_id: id,
        handler: postPaymentProcess // executed after successfull payment
    }

    //creates and triggers the popup
    const razor = new Razorpay(options);
    razor.open();

}

