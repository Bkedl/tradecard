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
    let setFilter = req.query.set || '';
    let typeFilter = req.query.type || '';
    let energyTypeFilter = req.query.energy || '';
    let rarityFilter = req.query.rarity || '';
    let stageFilter = req.query.stage || '';
    let seriesFilter = req.query.series || '';
    let sortOption = req.query.sortOption || '';

    let allcards = `SELECT card.*, rarity.rarity, energy_type.energy, \`set\`.set, series.series, card_type.type
                    FROM card
                    JOIN rarity ON card.rarity_id = rarity.rarity_id
                    LEFT JOIN energy_type ON card.energy_type_id = energy_type.energy_type_id
                    JOIN \`set\` ON card.set_id = \`set\`.set_id
                    JOIN series ON card.series_id = series.series_id
                    JOIN card_type ON card.card_type_id = card_type.card_type_id`;

    let queryParams = []; // queryParam Parameterized queriy. security bprevent SQL injection. placeholders ? used in code now in => ? dynamic values in the SQL query (s pplied separately) from SQL command). 
    // passed an array of user tickked  values as  second arg to the connection.query() func to stop or at least make it less vun for sql attacke s (week 7 and additons so refer back)



    if (searchQuery) {
        allcards += ` WHERE card.card_name LIKE ?`;
        queryParams.push(`%${searchQuery}%`);
    }

    if (setFilter) {
        const sets = Array.isArray(setFilter) ? setFilter : [setFilter]; // making it an array rathger than a string of just one objext hence the use for multiqweruting 
        allcards += searchQuery ? ` AND card.set_id IN (${sets.map(set => '?').join(', ')})` : ` WHERE card.set_id IN (${sets.map(set => '?').join(', ')})`; // here is the mapping part, may need asjusted wehn api tested on thunder client tomorrow
        queryParams.push(...sets);  // each push method adds thing to queryParam arry 
    }

    if (typeFilter) {
        const types = Array.isArray(typeFilter) ? typeFilter : [typeFilter];
        allcards += searchQuery || setFilter ? ` AND card.card_type_id IN (${types.map(type => '?').join(', ')})` : ` WHERE card.card_type_id IN (${types.map(type => '?').join(', ')})`;
        queryParams.push(...types); // remeber your pusyuihng the types i.e. the types.map not the actual value in it, got confused before so remeber to look at this again 
    }

    if (energyTypeFilter) {
        const energyTypes = Array.isArray(energyTypeFilter) ? energyTypeFilter : [energyTypeFilter];
        allcards += searchQuery || setFilter || typeFilter ? ` AND card.energy_type_id IN (${energyTypes.map(energyType => '?').join(', ')})` : ` WHERE card.energy_type_id IN (${energyTypes.map(energyType => '?').join(', ')})`;
        queryParams.push(...energyTypes);
    }

    if (rarityFilter) {
        const rarities = Array.isArray(rarityFilter) ? rarityFilter : [rarityFilter];
        allcards += searchQuery || setFilter || typeFilter || energyTypeFilter ? ` AND card.rarity_id IN (${rarities.map(rarity => '?').join(', ')})` : ` WHERE card.rarity_id IN (${rarities.map(rarity => '?').join(', ')})`;
        queryParams.push(...rarities);
    }

    if (seriesFilter) {
        const series = Array.isArray(seriesFilter) ? seriesFilter : [seriesFilter];
        allcards += searchQuery || setFilter || typeFilter || energyTypeFilter || rarityFilter ? ` AND card.series_id IN (${series.map(series => '?').join(', ')})` : ` WHERE card.series_id IN (${series.map(series => '?').join(', ')})`;
        queryParams.push(...series);
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

    connection.query(allcards, queryParams, (err, data) => {
        if (err) {
            console.error('Error fetching collections:', err);
            res.status(500).send('Error fetching collections');
        } else {
            res.json({ data });
        }
    });
});








// think i can leave the card stuff now as dont need to add 




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
