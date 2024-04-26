const express = require('express');
const app = express();
const path = require('path');
const PORT = 5500;
const axios = require('axios');
const bcrypt = require('bcrypt');
app.use(express.urlencoded({ extended: true }));









// reagrding the session thinsga nd user authetnication here is the code 
// ref index.js for  route to get the query from the db from thie api 
const { authenticateUser, getUserById, registerUser, deleteCardAdmin, deleteAccount, addCardAdmin } = require('./apitradecard/index.js');

const cookieParser = require('cookie-parser');
const sessions = require('express-session');

const oneHour = 1000 * 60 * 60 * 1;

app.use(cookieParser());

app.use(sessions({
    secret: "myshows14385899",
    saveUninitialized: true,
    cookie: { maxAge: oneHour },
    resave: false
}));
















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

app.get('/signin', log_data, browser_lang, (req, res) => {
    res.render("signin")
});

app.get('/contact', log_data, browser_lang, (req, res) => {
    res.render("contact")
});







// USING API HERE 
// expansion -> set as adjusted db 
app.get('/cards', (req, res) => {
    let ep = `http://localhost:4000/cards/`;
    let searchQuery = req.query.name || ''; // Extract search query from request first of all 
    let setFilter = req.query.set || '';
    let typeFilter = req.query.type || '';
    let energyTypeFilter = req.query.energy || '';
    let rarityFilter = req.query.rarity || '';
    let stageFilter = req.query.stage || '';
    let seriesFilter = req.query.series || '';
    let sortOption = req.query.sortOption || '';

    // added for multiquery for thwe one param 
    let params = {
        name: searchQuery,
        sortOption: sortOption
    };

    // adding the multi if s
    if (setFilter) params.expansion = Array.isArray(setFilter) ? setFilter : [setFilter];
    if (typeFilter) params.type = Array.isArray(typeFilter) ? typeFilter : [typeFilter];
    if (energyTypeFilter) params.energy = Array.isArray(energyTypeFilter) ? energyTypeFilter : [energyTypeFilter];
    if (rarityFilter) params.rarity = Array.isArray(rarityFilter) ? rarityFilter : [rarityFilter];
    if (seriesFilter) params.series = Array.isArray(seriesFilter) ? seriesFilter : [seriesFilter];



    axios.get(ep, { params: { name: searchQuery, set: setFilter, type: typeFilter, energy: energyTypeFilter, rarity: rarityFilter, stage: stageFilter, series: seriesFilter, sortOption: sortOption } })
        .then((response) => {
            let cdata = response.data;
            res.render('cards', { title: 'Cards', cdata, searchQuery, setFilter, typeFilter, energyTypeFilter, rarityFilter, stageFilter, seriesFilter, sortOption });


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



















// ATTEMPTING SESSIOSN 

// week 8 lab 08 ui login and sessiosn 
// Route for signing up
app.post('/signin', (req, res) => {
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    try {
        // authenticateUser fun called from index
        authenticateUser(userEmail, userPassword, async (err, rows) => {
            if (err) {
                console.error('Error occurred during authentication:', err);
                res.redirect('/signin');
            } else {
                console.log(rows);
                if (rows != undefined && rows.length > 0) {
                    const sessionobj = req.session;
                    sessionobj.authen = rows[0].user_id;
                    res.redirect('/dashboard');
                } else {
                    res.redirect('/signin?error=true'); // redirect error param 
                }
            }
        });
    } catch {
        res.redirect('/')
    }
});





// Dashboard route
app.get('/dashboard', (req, res) => {
    const sessionobj = req.session;
    if (sessionobj.authen) {
        const uid = sessionobj.authen;
        getUserById(uid, (err, rows) => {
            if (err) {
                console.error('Error occurred while fetching user data:', err);
                res.send('Internal Server Error');
            } else {
                const firstrow = rows[0];
                res.render('dashboard', { userdata: firstrow });
            }
        });
    } else {
        res.render('denied');
    }
});


// NOW ATTEMPTOING COLECTIONAND WISHLIST RESTIRCIOTN WITH MIDDELE ARE
// func middelware to check use rlogged in 
const isLoggedIn = (req, res, nextthing) => {
    if (req.session.authen) { // authentication only work sif user logged in 
        nextthing(); // if use rlogged in goto next thing 
    } else {
        res.render('denied');
    }
};


// isLoggedin midleware to collct and wish
// CODE NOW HERE TO make sure you can just type in url for the collectins etc, it is linked to a user instead
app.get('/collections', isLoggedIn, (req, res) => {
    res.render("collections")
});




// week 07 for post to sql, rest handing in index.js for queryr same as before 
app.post('/signup', async (req, res) => { // BCRYPT added async
    const email = req.body.upemail;
    const username = req.body.username;
    const password = await bcrypt.hash(req.body.uppassword, 10); // BCRYPT added await and done the hqash to 10 (salt)

    console.log(password);

    registerUser(email, username, password, (err, result) => {
        if (err) {
            console.error('Error occurred during sign-up:', err);
            res.redirect('/signin');

        } else {

            res.redirect('/signin?registered=true'); // redirect error prama 

        }
    });
});



// lougout route (ripped off)
app.get('/logout', (req, res) => {
    // destory sessio n
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error occurred during logout');
        } else {

            res.redirect('/');
        }
    });
});



// deleeting  card via admin stayus 
app.post('/deleteCard', (req, res) => {
    const cname = req.body.cardname;
    const setID = req.body.cardset;

    deleteCardAdmin(cname, setID, (err, result) => {
        if (err) {
            console.error('Error occurred whenn deleting card:', err);
            res.redirect('/dashboard');
        } else {

            res.redirect('/dashboard?deleted=true'); // redirect  prama success

        }
    });
});


// add a card 
app.post('/addCard', (req, res) => {
    const name = req.body.name;
    const hitpoints = req.body.hp;
    const price = req.body.price;
    const img = req.body.image;
    const descr = req.body.desc;
    const type = req.body.type;
    const set = req.body.set;
    const series = req.body.series;
    const energy = req.body.energy;
    const rarity = req.body.rarity;


    addCardAdmin(name, hitpoints, price, img, descr, type, set, series, energy, rarity, (err, result) => {
        if (err) {
            console.error('Error adding card', err);
            res.redirect('/dashboard');
        } else {

            res.redirect('/dashboard?added=true'); // redirect error prama 

        }
    });
});


// deleeting  card via admin stayus 
app.post('/deleteAccount', (req, res) => {
    const email = req.body.delEmail;

    deleteAccount(email, (err, result) => {

        if (err) {
            console.error('Error occurred when deleting account:', err);
            //  error feedback to user 
            res.redirect('/dashboard'); // redirect again with no messag e
        } else {
            // End the session
            req.session.destroy((err) => {
                if (err) {
                    console.error('Error occurred during logout:', err);
                    // Handle error appropriately
                }
                // redirect Sigin with error message
                res.redirect('/signin?deleteaccount=true');
            });
        }
    });
});



// need to implement password bcrypt and doing it and also put it in so like you can check a password when session is there 

// also need an admin role to add cards to database i.e. automatically added as admin or not and if admin staius given then whe  log in they have access to anotherthing indashboard to add cards or remove cards 
// i could do it so if role = 2 (admin) then render dashboardAdmin.ejs that is the same but has a button that takes to a card post page




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
        console.log(`Hello from the app.js`)
    }
});