const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express().use(bodyParser.json());
const { WebhookClient } = require("dialogflow-fulfillment");
const { Payload } = require('dialogflow-fulfillment');

var port = process.env.PORT || 3000;

app.get("/", (request, response) => {
    response.send("Hello!");
});

app.post("/webhook", (request, response) => {
    const _agent = new WebhookClient({ request, response });
    const body = JSON.stringify(request.body);
    console.log("Dialogflow Request body: " + body);

    // function Welcome(agent) {
    //     var payload = {
    //         "facebook": {
    //             "text": "Welcome to my agent!",
    //             "quick_replies": [
    //                 {
    //                     "content_type": "text",
    //                     "payload": "reply1",
    //                     "title": "reply 1"
    //                 }
    //             ]
    //         }
    //     }
    //     agent.add(new Payload(agent.FACEBOOK, payload, { rawPayload: true, sendAsMessage: true }))

    // }


    function Contact_Details(agent) {
        const name = request.body.queryResult.parameters.person.name
        const email = request.body.queryResult.parameters.email
        const number = request.body.queryResult.parameters.number
        agent.add(
            `Thank you ${name}, kindly type any number from 1 to 6 to play the game `
        );
    }

    function Dice(agent) {
        var diceNum = request.body.queryResult.parameters.diceNum
        diceNum = Math.floor(Math.random() * 6) + 1;
        console.log(diceNum, "dice number is")
        if (diceNum === 1) {
            agent.add(
                `Question for number 1 is `
            );
            agent.add(
                `click on below link to watch the video to solve this problem: `
            );


        }
        else if (diceNum === 2) {
            agent.add(
                `Question for number 2 is `
            );
            agent.add(
                `click on below link to watch the video to solve this problem: `
            );
            agent.add(
                `https://www.youtube.com/ `
            );
        }
        else if (diceNum === 3) {
            agent.add(
                `Question for number 3 is `
            );
            agent.add(
                `click on below link to watch the video to solve this problem: `
            );
            agent.add(
                `https://www.youtube.com/ `
            );
        }
        else if (diceNum === 4) {
            agent.add(
                `Question for number 4 is `
            );
            agent.add(
                `click on below link to watch the video to solve this problem: `
            );
            agent.add(
                `https://www.youtube.com/ `
            );
        }
        else if (diceNum === 5) {
            agent.add(
                `Question for number 5 is `
            );
            agent.add(
                `click on below link to watch the video to solve this problem: `
            );
            agent.add(
                `https://www.youtube.com/ `
            );
        }
        else if (diceNum === 6) {
            agent.add(
                `Question for number 6 is `
            );
            agent.add(
                `click on below link to watch the video to solve this problem: `
            );
            agent.add(
                `https://www.youtube.com/ `
            );
        }
        else {
            agent.add(
                `you have selected ${diceNum}, which doesn't come between 1 to 6 :( `
            );

        }
    }


    function fallback(agent) {
        var payload = {
            "facebook": {
                "text": "What would like to do next",
                "quick_replies": [
                    {
                        "content_type": "text",
                        "payload": "reply1",
                        "title": "Continue the game"
                    },
                    {
                        "content_type": "text",
                        "payload": "reply2",
                        "title": "Finish the game"
                    }
                ]
            }
        }
        agent.add(new Payload(agent.FACEBOOK, payload, { rawPayload: true, sendAsMessage: true }))

    }

    function finish(agent) {
        Num = Math.floor(Math.random() * 22) + 1;
        agent.add(
            `Congratulations, you have scored ${Num}  `
        );
    }
    


    let intents = new Map();
    // intents.set("Default Welcome Intent", Welcome);
    intents.set("Contact_Details", Contact_Details);
    intents.set("Dice", Dice);
    intents.set("Default Fallback Intent", fallback);
    intents.set("finish", finish);



    _agent.handleRequest(intents);
});

app.listen(port, () => {
    console.log("server running on port " + port);
});