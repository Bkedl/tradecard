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
    let searchQuery = req.query.name || '';
    let expansionFilter = req.query.expansion || '';
    let typeFilter = req.query.type || '';
    let energyTypeFilter = req.query.energy || '';
    let rarityFilter = req.query.rarity || '';
    let stageFilter = req.query.stage || '';
    let seriesFilter = req.query.series || '';
    let sortOption = req.query.sortOption || '';

    // / set as it is a reserved word so this is the only work around i can find 
    let allcards = `SELECT card.*, rarity.rarity, energy_type.energy, \`set\`.set, series.series, card_type.type
    FROM card
    JOIN rarity ON card.rarity_id = rarity.rarity_id
    LEFT JOIN energy_type ON card.energy_type_id = energy_type.energy_type_id
    JOIN \`set\` ON card.set_id = \`set\`.set_id
    JOIN series ON card.series_id = series.series_id
    JOIN card_type ON card.card_type_id = card_type.card_type_id`;




    if (searchQuery) {
        allcards += ` WHERE card.card_name LIKE '%${searchQuery}%'`;
    }

    if (expansionFilter) {
        allcards += searchQuery ? ` AND card.set_id='${expansionFilter}'` : ` WHERE card.set_id='${expansionFilter}'`;
    }

    if (typeFilter) {
        allcards += searchQuery || expansionFilter ? ` AND card.card_type_id='${typeFilter}'` : ` WHERE card.card_type_id='${typeFilter}'`;
    }

    if (energyTypeFilter) {
        allcards += searchQuery || expansionFilter || typeFilter ? ` AND card.energy_type_id='${energyTypeFilter}'` : ` WHERE card.energy_type_id='${energyTypeFilter}'`;
    }

    if (rarityFilter) {
        allcards += searchQuery || expansionFilter || typeFilter || energyTypeFilter ? ` AND card.rarity_id='${rarityFilter}'` : ` WHERE card.rarity_id='${rarityFilter}'`;
    }

    if (seriesFilter) {
        allcards += searchQuery || expansionFilter || typeFilter || energyTypeFilter || rarityFilter ? ` AND card.series_id='${seriesFilter}'` : ` WHERE card.series_id='${seriesFilter}'`;
    }

    if (sortOption === 'asc') {
        allcards += ` ORDER BY price ASC`;
    } else if (sortOption === 'desc') {
        allcards += ` ORDER BY price DESC`;
    } else if (sortOption === 'alpha_asc') {
        allcards += ` ORDER BY card_name ASC`;
    } else if (sortOption === 'alpha_desc') {
        allcards += ` ORDER BY card_name DESC`;
    }


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
    let getcard = `SELECT card.*, rarity.rarity, energy_type.energy, \`set\`.set, series.series, card_type.type
    FROM card
    JOIN rarity ON card.rarity_id = rarity.rarity_id
    LEFT JOIN energy_type ON card.energy_type_id = energy_type.energy_type_id
    JOIN \`set\` ON card.set_id = \`set\`.set_id
    JOIN series ON card.series_id = series.series_id
    JOIN card_type ON card.card_type_id = card_type.card_type_id WHERE card_id=${r_id}`;
    connection.query(getcard, (err, data) => {
        if (err) throw err;
        res.json({ data });
    });

});

const server = app.listen(PORT, () => {
    console.log(`API started on port ${server.address().port}`);
});
