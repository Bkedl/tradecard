const express = require('express');
const app = express();
const path = require('path');
const PORT = 5500;
const axios = require("axios");
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');


app.use(express.static(path.join(__dirname, "./public")));

// Language and date and time printed to console (week07 lecture slides)

const log_data = (req, res, next) => {
    const visitTime = new Date();
    console.log(`User visited at ${visitTime.toLocaleString()} \n
                using ${req.get('User-Agent')}`);

    next();

};


const browser_lang = (req, res, next) => {
    console.log(`client language:::::${req.header('accept-language')}`);

    next();

};

// routes


// the titles (except 404) are not connected to anything, so may be worthwhile changing them all)
app.get('/', log_data, browser_lang, (req, res) => {
    res.render("index", { title: 'Pokécard Palace' })
});

app.get('/signup', log_data, browser_lang, (req, res) => {
    res.render("signup")
});

app.get('/contact', log_data, browser_lang, (req, res) => {
    res.render("contact")
});







// USING API HERE 

app.get('/cards', (req, res) => {
    let ep = `http://localhost:4000/cards/`;
    let searchQuery = req.query.name || ''; // Extract search query from request first of all 
    let expansionFilter = req.query.expansion || '';
    let typeFilter = req.query.type || '';
    let energyTypeFilter = req.query.energy || '';
    let rarityFilter = req.query.rarity || '';
    let stageFilter = req.query.stage || '';
    let seriesFilter = req.query.series || '';
    let sortOption = req.query.sortOption || '';


    axios.get(ep, { params: { name: searchQuery, expansion: expansionFilter, type: typeFilter, energy: energyTypeFilter, rarity: rarityFilter, stage: stageFilter, series: seriesFilter, sortOption: sortOption } })
        .then((response) => {
            let cdata = response.data;
            res.render('cards', { title: 'Cards', cdata, searchQuery, expansionFilter, typeFilter, energyTypeFilter, rarityFilter, stageFilter, seriesFilter, sortOption });


        })
        .catch((error) => {
            console.error('Error fetching cards:', error);
            res.status(500).send('Error fetching cards');
        });
});







app.get('/card', (req, res) => {
    let item_id = req.query.details;
    let endp = `http://localhost:4000/cards/${item_id}`;

    axios.get(endp)
        .then((response) => {
            let card = response.data;
            console.log(card);
            res.render('card', { cdata: card });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Internal Server Error');
        });
});



// 404 Route: Must be last route here
app.get('*', log_data, browser_lang, (req, res) => {
    res.render("404", { title: '404 Error' })
});


// i defined an if else in this one to handle errors here 
app.listen(PORT, (err) => {
    if (err) {
        console.error('Error occurred while starting the server:', err);
    } else {
        console.log(`Server is running on http://localhost:${PORT}`);
    }
});