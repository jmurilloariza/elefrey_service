const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors({
    limit: '500mb',
    extended: true,
    origin: ["http://localhost"],
    exposedHeaders: ['Authorization'],
    methods: ['GET', 'PUT', 'POST', 'DELETE']
}));

app.use((req, res, next) => {
    console.log(`Service ${req.protocol}://${req.get('host')}${req.originalUrl} method: ${req.method} ip: ${req.ip} usercodeId: ${req.headers.usercodeid}`);
    next();
});

app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ extended: true }))

//routes
app.use("/Elefrey/v1/user", require("./Router/userRouter"));
app.use("/Elefrey/v1/material", require("./Router/materialRouter"));

module.exports = app;