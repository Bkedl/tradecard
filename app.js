const express = require('express');
const app = express();
const path = require('path');
const PORT = 5500;


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

app.get('/', log_data, browser_lang, (req, res) => {
    res.render("index", { title: 'home' })
});

// use remainder of code below as a baseline for project, delete and reconfigure if needed
// bsically a guide for the next pages to make

// maybe better being account? adjust when made
app.get('/signup', log_data, browser_lang, (req, res) => {
    res.render("signup", { title: 'sign-up' })
});

app.get('/contact', log_data, browser_lang, (req, res) => {
    res.render("contact", { title: 'contact us' })
});

// route for contact form post? Do I need this? 
app.post('/contact', (req, res) => {
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
