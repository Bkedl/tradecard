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


app.get('/collections', (req, res) => {

    let ep = `http://localhost:4000/collections/`;

    axios.get(ep).then((response) => {
        let cdata = response.data;
        res.render('collections', { title: 'Collections', cdata });

    });
});

app.get('/card', (req, res) => {

    let item_id = req.query.details;
    let endp = `http://localhost:4000/collections/${item_id}`;

    axios.get(endp).then((response) => {
        res.send(response.data);
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