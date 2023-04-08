// modules
const express = require('express');
const fs = require('fs');
const readline = require ('readline');


const app = express();
const port = 3000;
app.listen(port);
console.log(`Server started at http://localhost:${port}`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Default route:
app.get('/', (req, res) => {

    console.log('Starting program...');
    res.send('Successful Start!');

});

// Route to get all tickets:
app.get('/rest/list', (req, res) => {

    fs.readFile("ticketList.json", "utf8", (err, data) => {
        
        if (err) {
            console.log(err);
            res.send(`There was an error: "${err}"`);
        } else {

            try {

                data = JSON.parse(data);
                ticketList = data.ticketList;
                const ticketArr = [];

                for(i = 0; i < ticketList.length; i++) {
                    ticketArr.push(ticketList[i]);
                }

                console.log(ticketArr);

                if(ticketArr.length == 0){
                    res.send("No tickets available.");
                } else {
                    res.send(ticketArr);
                }

            } catch (err) {
                console.log(err);
                res.send(`There was an error: "${err}"`);
            }

        }
    
    });

});

// Route to get a ticket by ID:
app.get('/rest/ticket/:id', function(req, res) {

    const ticketID = req.params.id;
    
    fs.readFile("ticketList.json", "utf8", (err, data) => {

        if (err) {
            console.log(err);
            res.send(`There was an error: "${err}"`);
        } else {

            try {

                data = JSON.parse(data);
                ticketList = data.ticketList;

                qTicket = ticketList.find(x => x.id == ticketID);

                if(qTicket) {
                    qTicket = JSON.stringify(qTicket);
                    res.send("Found this ticket: " + qTicket);
                } else {
                    console.log(`Could not find ticket with id ${ticketID}`);
                    res.send(`Could not find ticket with id ${ticketID}`);
                }
                

            } catch (err) {
                console.log(err);
                res.send(`There was an error: "${err}"`);
            }

        }

    });

});

// Route to create a ticket:
app.post('/rest/ticket/', (req, res) => {

    const ticket = req.body;
    console.log(ticket);

    incompleteForm = false;

    if( ticket.id &&
        ticket.created_at &&
        ticket.type &&
        ticket.subject &&
        ticket.description &&
        ticket.priority &&
        ticket.status &&
        ticket.recipient &&
        ticket.submitter &&
        ticket.assignee_id &&
        ticket.follower_ids &&
        ticket.tags)
    {

        fs.readFile("ticketList.json", "utf8", (err, data) => {

            if (err) {
                console.log(err);
                res.send(`There was an error: "${err}"`);
            } else {
    
                try {
    
                    data = JSON.parse(data);
                    data.ticketList.push(ticket);
    
                    data = JSON.stringify(data, null, 2);
    
                    fs.writeFile("ticketList.json", data, "utf8", (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            res.send("ticket created successfully");
                        }
                    });
    
                } catch (err) {
                    console.log(err);
                    res.send(`There was an error: "${err}"`);
                }
    
            }
    
        });

    } else {
        console.log("Ticket creation failed: empty fields.")
        res.send("Ticket creation failed.\nFields cannot be empty");
    }

});

// for testing purposes, resets ticketList json file
app.get('/rest/list/reset', (req, res) => {

    const ticketListJSON = {
        ticketList : [

        ]
    }

    fs.writeFile("ticketList.json", JSON.stringify(ticketListJSON, null, 2), "utf8", (err) => {

        if (err) {
            console.log(err);
            res.send(`There was an error: "${err}"`);
        }

    });

    res.send();

});