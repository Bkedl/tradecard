const express = require('express');
const app = express();
const path = require('path');
const PORT = 5500;
const axios = require('axios');
const bcrypt = require('bcrypt');
app.use(express.urlencoded({ extended: true }));









// reagrding the session thinsga nd user authetnication here is the code 
// ref index.js for  route to get the query from the db from thie api 
const { authenticateUser, getUserById, registerUser, deleteCardAdmin, deleteAccount, addCardAdmin, myCollectionData, createCollection, getCardsInaCollection, getAllCollections, getAllCards, deleteCollection, addCardToCollection, addToWishlist, getWishlistItems, removeCardFromWishlist, insertRating, getAverageRating } = require('./apitradecard/index.js');

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
    console.log(`User visited at ${visitTime.toLocaleString()} - using ${req.get('User-Agent')}`); // made this one line as too much going on inn colsole 


    next();

};


const browser_lang = (req, res, next) => {
    console.log(`Client language:::::${req.header('accept-language')}`);

    next();

};








// routes


// the titles (except 404) are not connected to anything, so may be worthwhile changing them all)
// took the borswer stuff out of rest as only tracking index and 404 errors now, but can be added to all if needed 
app.get('/', log_data, browser_lang, (req, res) => {
    res.render("index", { title: 'Pokécard Palace' })
});

app.get('/signin', (req, res) => {
    res.render("signin")
});

app.get('/contact', (req, res) => {
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



// al the res.505 things are only because i had it in the first one from labs, take out and replace with actual message s
// also, title are in here too as redning pages etc andf objects before ejs so just take them out when reviewing final code if added munally to ejs 


// COLLECTIONS 




app.get('/mycollection', isLoggedIn, (req, res) => {
    const userId = req.session.authen; // get user id from sess

    myCollectionData(userId, (err, collectionData) => {
        if (err) {
            console.error('Error fetching user collection data:', err);
            res.status(500).send('Error fetching user collection data');
        } else {
            // usngi this function again wherei can get the user by there id 
            getUserById(userId, (userErr, userData) => {
                if (userErr) {
                    console.error('Error fetching user data:', userErr);
                    res.status(500).send('Error fetching user data');
                } else {

                    res.render("mycollection", { title: 'My Collection', collectionData, userdata: userData[0] });
                    console.log('Collection Data: ', collectionData);
                }

            });
        }
    });
});

app.post('/mycollection', isLoggedIn, (req, res) => {
    const userId = req.session.authen;
    const { collectionName, collectionDescription } = req.body; // extract colection data from req 

    createCollection(userId, collectionName, collectionDescription, (err, result) => { // now instering into db 
        if (err) {
            console.error('Error creating collection:', err);
            res.status(500).send('Error creating collection');
        } else {

            res.redirect('/mycollection');
        }
    });
});

app.get('/collection/:collectionId', isLoggedIn, (req, res) => {
    const collectionId = req.params.collectionId;

    // q db to get all card  in col
    getCardsInaCollection(collectionId, (err, cards) => {
        if (err) {
            console.error('Error fetching cards in collection:', err);
            return res.status(500).send('Error fetching cards in collection');
        }

        // query db to get all available cards 
        getAllCards((err, allCards) => {
            if (err) {
                console.error('Error fetching all cards:', err);
                return res.status(500).send('Error fetching all cards');
            }

            // dont reall yneed titles here, only for testing of rderning 
            res.render("collectioncards", { title: 'Collection Cards', cards, allCards, collectionId });
        });
    });
});






// gets all collections 

app.get('/collection/:collectionId/cards', isLoggedIn, (req, res) => {
    const collectionId = req.params.collectionId;

    // here is ave rating implementation 
    getAverageRating(collectionId, (err, averageRating) => {
        if (err) {
            console.error('Error fetching average rating:', err);
            return res.status(500).send('Error fetching average rating');
        }


        getCardsInaCollection(collectionId, (err, cards) => {
            if (err) {
                console.error('Error fetching cards in collection:', err);
                return res.status(500).send('Error fetching cards in collection');
            }

            // also now added ave rating to the redner 
            res.render("viewonlycards", { title: 'Cards in Collection', cards, collectionId, averageRating });
        });
    });
});


app.get('/collections', isLoggedIn, (req, res) => {

    getAllCollections((err, collections) => {
        if (err) {
            console.error('Error fetching collections:', err);
            res.status(500).send('Error fetching collections');
        } else {

            res.render("allcollections", { title: 'All Collections', collections });
        }
    });
});


app.post('/collection/delete/:collectionId', isLoggedIn, (req, res) => {
    const collectionId = req.params.collectionId;

    deleteCollection(collectionId, (err, result) => {
        if (err) {
            console.error('Error deleting collection:', err);
            res.status(500).send('Error deleting collection');
        } else {

            res.redirect('/mycollection');
        }
    });
});




// ad cards to collect 
app.post('/collection/:collectionId/addcard', isLoggedIn, (req, res) => {
    const collectionId = req.params.collectionId;
    const cardId = req.body.cardId;

    // adding card func 
    addCardToCollection(collectionId, cardId, (err, result) => {
        if (err) {
            console.error('Error adding card to collection:', err);
            return res.status(500).send(`Error adding card to collection: ${err.message}`);
        }
        console.log('Card added to collection successfully');
        res.redirect(`/collection/${collectionId}`); // just keep on same page here as no need ot redirect 
    });
});






// wishlist attempt


// routing wishlist from index.js with the adding and getting the wishlist below 
app.post('/wishlist/add', isLoggedIn, (req, res) => {
    const userId = req.session.authen; // Retrieve the logged-in user's ID from the session
    const cardId = req.body.cardId;
    addToWishlist(userId, cardId, (err) => {
        if (err) {
            console.error("Error adding card to wishlist:", error);
            res.status(500).send("Error adding card to wishlist.");
            // have an else here to render a message saying 'added tonwish list" 
        }
    });
});

//route to render wishlist page

app.get('/wishlist', isLoggedIn, (req, res) => {
    const userId = req.session.authen; // nmeed user sesiosn data for user id here 

    // get the user data first? 
    getUserById(userId, (err, userData) => {
        if (err) {
            console.error("Error fetching user data:", err);
            res.status(500).send("Error fetching user data.");
        } else {

            getWishlistItems(userId, (err, wishlistItems) => {
                if (err) {
                    console.error("Error fetching wishlist items:", err);
                    res.status(500).send("Error fetching wishlist items.");
                } else {

                    res.render('wishlist', { wishlistItems, userdata: userData[0] });
                }
            });
        }
    });
});


app.post('/wishlist/remove/:cardId', isLoggedIn, (req, res) => {
    const userId = req.session.authen;
    const cardId = req.params.cardId;

    removeCardFromWishlist(userId, cardId, (err, result) => {
        if (err) {
            console.error("Error removing card from wishlist:", err);
            res.status(500).send("Error removing card from wishlist.");
        } else {
            res.redirect('/wishlist');
        }
    });
});



// RATING 


app.post('/collection/:collectionId/rate', isLoggedIn, (req, res) => {
    const collectionId = req.params.collectionId;
    const userId = req.session.authen;
    const ratingValue = req.body.rating;




    insertRating(collectionId, userId, ratingValue, (err, result) => {
        if (err) {
            console.error('Error submitting rating:', err);
            res.redirect(`/collection/${collectionId}/cards`);
        } else {
            res.redirect(`/collection/${collectionId}/cards`);
        }
    });
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
// deleeting account only if email matches with the logged in user's email
app.post('/deleteAccount', (req, res) => {
    const emailToDelete = req.body.delEmail;
    const sessionUserId = req.session.authen; // Retrieve the logged-in user's ID from the session

    console.log(emailToDelete);
    console.log('hello', sessionUserId);

    // First, check if the logged-in user exists
    if (!sessionUserId) {
        res.redirect('/signin'); // Redirect to sign-in if no user is logged in
        return;
    }

    // Get the user's email from the database using their ID
    getUserById(sessionUserId, (err, user) => {
        if (err) {
            console.error('Error occurred while fetching user data:', err);
            res.status(500).send('Internal Server Error');
            return;
        }


        // check if the user exists and if the provided email matches the usr email
        if (user && user.length > 0 && user[0].email === emailToDelete) {
            // / if emails match then delete the acc
            console.log('Hello!!!!')
            deleteAccount(emailToDelete, (deleteErr, result) => {
                if (deleteErr) {
                    console.error('Error occurred when deleting account:', deleteErr);
                    res.status(500).send('Error occurred when deleting account');
                } else {
                    // End the session
                    req.session.destroy((sessionErr) => {
                        if (sessionErr) {
                            console.error('Error occurred during logout:', sessionErr);
                        }
                        res.redirect('/signin?deleteaccount=true'); // redirect still there 
                    });
                }
            });
        } else {
            // If the user doesn't exist or the emails don't match, redirect back with an error message
            res.redirect('/dashboard?deleteerror=true');
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