const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express().use(bodyParser.json());
const { WebhookClient } = require("dialogflow-fulfillment");
const dbUri = process.env.DBuri;

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch((err) => {
        console.log("error occured", err);
    });
mongoose.connection.on("error", function (err) {
    //any error
    console.log("Mongoose connection error: ", err);
    process.exit(1);
});
mongoose.connection.on("connected", () => {
    console.log("Connected with database");
});

mongoose.connection.on("disconnected", () => {
    console.log("Disconnected with database.");
    process.exit(1);
});

var userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model("SurveyRecords", userSchema);


app.get("/", (request, response) => {
    response.send("Hello!");
});

app.post("/webhook", (request, response) => {
    const _agent = new WebhookClient({ request, response });
    console.log("Dialogflow Request body: " + JSON.stringify(request.body));

    function qbNo(agent) {
        agent.context.set({
            name: "answers",
            lifespan: 5,
            parameters: {
                Ans_Of_QB: "No",
                Ans_Of_QC: "",
                Ans_Of_QD: "",
            },
        });
        agent.add(
            "Do you have any other comments about on-demand video streaming services?"
        );
    }

    function qbComments(agent) {
        agent.context.set({
            name: "answers",
            lifespan: 5,
            parameters: {
                Ans_Of_QB: agent.parameters.any,
                Ans_Of_QC: "",
                Ans_Of_QD: "",
            },
        });
        agent.add("Are you satisfied with their service?");
    }

    function qcNo(agent) {
        let context = agent.context.get("answers").parameters;
        agent.context.set({
            name: "answers",
            lifespan: 5,
            parameters: {
                Ans_Of_QB: context.Ans_Of_QB,
                Ans_Of_QC: "No",
                Ans_Of_QD: "",
            },
        });
        agent.add("What are you dissatisfied with?");
    }

    function qcComments(agent) {
        let context = agent.context.get("answers").parameters;
        agent.context.set({
            name: "answers",
            lifespan: 5,
            parameters: {
                Ans_Of_QB: context.Ans_Of_QB,
                Ans_Of_QC: agent.parameters.any,
                Ans_Of_QD: "",
            },
        });
        agent.add(
            "Do you have any other comments about on-demand video streaming services?"
        );
    }

    function qdComments(agent) {
        let context = agent.context.get("answers").parameters;
        agent.context.set({
            name: "answers",
            lifespan: 5,
            parameters: {
                Ans_Of_QB: context.Ans_Of_QB,
                Ans_Of_QC: context.Ans_Of_QC,
                Ans_Of_QD: agent.parameters.any,
            },
        });
        agent.add(
            "Do you have any other comments about on-demand video streaming services?"
        );
    }

    async function qeNo(agent) {
        let context = agent.context.get("answers").parameters;
        let info = {
            Ans_Of_QB: context.Ans_Of_QB,
            Ans_Of_QC: context.Ans_Of_QC,
            Ans_Of_QD: context.Ans_Of_QD,
            Ans_Of_QE: "No"
        }
        let saveData = new User(info);
        await saveData.save((err, data) => {
            if (err) console.log("err is : ", err)
            else console.log("data is  : ", data)
        })
        agent.add("Thanks for filling out this survey");
    }

    async function qeComments(agent) {
        let context = agent.context.get("answers").parameters;
        let info = {
            Ans_Of_QB: context.Ans_Of_QB,
            Ans_Of_QC: context.Ans_Of_QC,
            Ans_Of_QD: context.Ans_Of_QD,
            Ans_Of_QE: agent.parameters.any
        }
        let saveData = new User(info);
        await saveData.save((err, data) => {
            if (err) console.log("err is : ", err)
            else console.log("data is  : ", data)
        })
        agent.add("Thanks for filling out this survey");
    }

    let intents = new Map();
    intents.set("QB - no", qbNo);
    intents.set("QB - comments", qbComments);
    intents.set("QC - no", qcNo);
    intents.set("QC - comments", qcComments);
    intents.set("QD - comments", qdComments);
    intents.set("QE1 - no", qeNo);
    intents.set("QE1 - comments", qeComments);
    intents.set("QE0 - no", qeNo);
    intents.set("QE0 - comments", qeComments);
    intents.set("QE2 - no", qeNo);
    intents.set("QE2a - comments", qeComments);

    _agent.handleRequest(intents);
});

app.listen(3000, () => {
    console.log("server running on port " + 3000);
});