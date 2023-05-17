const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("MINI WHEELS SERVER IS RUNNING")
});

app.listen(port, () => {
    console.log(`MINI WHEELS SERVER IS RUNNING ON PORT: ${port}`);
});