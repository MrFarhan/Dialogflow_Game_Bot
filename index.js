const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express().use(bodyParser.json());
const { WebhookClient } = require("dialogflow-fulfillment");

app.get("/", (request, response) => {
    response.send("Hello!");
});

app.post("/webhook", (request, response) => {
    const _agent = new WebhookClient({ request, response });
    console.log("Dialogflow Request body: " + JSON.stringify(request.body));

    function welcome(agent) {
        agent.add(
            "Do you have any other comments about on-demand video streaming services?"
        );
    }

    let intents = new Map();
    intents.set("Default Welcome Intent", Welcome);

    _agent.handleRequest(intents);
});

app.listen(3000, () => {
    console.log("server running on port " + 3000);
});