const fs = require('fs');
const express = require("express");
const Razorpay = require('razorpay');

const credentials = {
    key_id: "rzp_test_4V6xkGFsNGx3bJ",
    key_secret: ""
}

const app = express();
const rzr = new Razorpay(credentials); //initialization

app.use(express.static('./public'));
app.use(express.json());

//route for generating order_id
app.post('/order', async (req, res) => {

    const order = await rzr.orders.create({
        amount: req.body.amount * 100,
        currency: "INR"
    });

    res.send(order.id);
})

//route for saving the data after successfull payment
app.post('/success', ({ body }, res) => {
    fs.writeFile(`./payments/${body.order_id}.json`, JSON.stringify(body), () => { });
    res.send(200);
})

app.listen(4000, () => {
    console.log("Server up and running!");
})

