require('dotenv').config();
const express = require("express");
const app = express();
const mysql = require('mysql2');

const PORT = process.env.PORT || 4000;
app.set('view engine', 'ejs');

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 10,
    port: process.env.DB_PORT,
    multipleStatements: true
});

connection.getConnection((err) => {
    if (err) return console.log(err.message);
    console.log("connected to local mysql db using .env properties");
});







// using cards and filtering 

app.get('/cards', (req, res) => {
    // add things here to extract from the searc url i have 
    let searchQuery = req.query.name || '';
    let expansionFilter = req.query.expansion || '';
    let typeFilter = req.query.type || '';
    let energyTypeFilter = req.query.energy || '';
    let rarityFilter = req.query.rarity || '';
    let seriesFilter = req.query.series || '';
    let stageFilter = req.query.stage || '';
    let illustratorFilter = req.query.illustrator || '';

    let allcards = `SELECT *
                    FROM card`;

    //WHERE if searchQuery 
    if (searchQuery) {
        allcards += ` WHERE card_name LIKE '%${searchQuery}%'`;
    }

    //AND if expansionFilter
    if (expansionFilter) {
        if (searchQuery) {
            allcards += ` AND expansion='${expansionFilter}'`;
        } else {
            allcards += ` WHERE expansion='${expansionFilter}'`;
        }
    }

    //same as above 
    if (typeFilter) {
        if (searchQuery || expansionFilter) {
            allcards += ` AND card_type='${typeFilter}'`;
        } else {
            allcards += ` WHERE card_type='${typeFilter}'`;
        }
    }

    // same as above 
    if (energyTypeFilter) {
        if (searchQuery || expansionFilter || typeFilter) {
            allcards += ` AND energy_type='${energyTypeFilter}'`;
        } else {
            allcards += ` WHERE energy_type='${energyTypeFilter}'`;
        }
    }

    // connetion for this so this is the  end of the cards page route
    connection.query(allcards, (err, data) => {
        if (err) {
            console.error('Error fetching collections:', err);
            res.status(500).send('Error fetching collections');
        } else {
            res.json({ data });
        }
    });
});












app.get('/cards/:rowid', (req, res) => {
    let r_id = req.params.rowid;
    let getburger = `SELECT *
                       FROM card WHERE card_id=${r_id}`;
    connection.query(getburger, (err, data) => {
        if (err) throw err;
        res.json({ data });
    });

});

const server = app.listen(PORT, () => {
    console.log(`API started on port ${server.address().port}`);
});
