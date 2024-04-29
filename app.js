const express = require('express');
const app = express();
const path = require('path');
const PORT = 5500;
const axios = require('axios');
const bcrypt = require('bcrypt');
app.use(express.urlencoded({ extended: true }));


// Acquiring exported modules from index.js to be use in app.js (current file) 
const { authenticateUser, getUserById, registerUser, deleteCardAdmin, deleteAccount, addCardAdmin, myCollectionData, createCollection, getCardsInaCollection, getAllCollections, getAllCards, deleteCollection, addCardToCollection, addToWishlist, getWishlistItems, removeCardFromWishlist, insertRating, getAverageRating, updateEmail } = require('./apitradecard/index.js');


// Sessions + Cookie parser :
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


// Setting view engine to ejs 
app.set('view engine', 'ejs');

// To serve static files 
app.use(express.static(path.join(__dirname, "./public")));

// Language and date and time printed to console (week07 lecture slides) (middleware) 
const log_data = (req, res, next) => {
    const visitTime = new Date();
    console.log(`User visited at ${visitTime.toLocaleString()} - using ${req.get('User-Agent')}`);
    next();
};

const browser_lang = (req, res, next) => {
    console.log(`Client language:::::${req.header('accept-language')}`);

    next();
};



// Routes :

// Home Page 
app.get('/', log_data, browser_lang, (req, res) => {
    res.render("index", { title: 'Pokécard Palace' })
});

// Sign in page 
app.get('/signin', (req, res) => {
    res.render("signin")
});

// Contact Page 
app.get('/contact', (req, res) => {
    res.render("contact")
});


// Using API here :

// Cards route to display all cards, using the query from index.js with API endpoint etc
app.get('/cards', (req, res) => {
    let ep = `http://localhost:4000/cards/`;
    let searchQuery = req.query.name || '';
    let setFilter = req.query.set || '';
    let typeFilter = req.query.type || '';
    let energyTypeFilter = req.query.energy || '';
    let rarityFilter = req.query.rarity || '';
    let stageFilter = req.query.stage || '';
    let seriesFilter = req.query.series || '';
    let sortOption = req.query.sortOption || '';

    let params = {
        name: searchQuery,
        sortOption: sortOption
    };

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

// Single card details route using API from index.js and the endpoint etc 
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


// Sessions : 

// Route for sigin up, using the authenticateUser function from index.js, via post
app.post('/signin', (req, res) => {
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    try {
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
                    res.redirect('/signin?error=true');
                }
            }
        });
    } catch {
        res.redirect('/')
    }
});

// Dashboard route using getUserById function from index.js 
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

// Function for middelware to check if user is logged in (DRY Approach) When placed in route, a user who is logged in can visit these pages, otherwise a user will be presented with the denied.ejs 
const isLoggedIn = (req, res, nextthing) => {
    if (req.session.authen) {
        nextthing();
    } else {
        res.render('denied');
    }
};


// Collections :

// Route to show user's collections, using is logged in middleware, and ,yCollectionData + getUserById functions from index.js 
app.get('/mycollection', isLoggedIn, (req, res) => {
    const userId = req.session.authen;
    myCollectionData(userId, (err, collectionData) => {
        if (err) {
            console.error('Error fetching user collection data:', err);
            res.status(500).send('Error fetching user collection data');
        } else {
            getUserById(userId, (userErr, userData) => {
                if (userErr) {
                    console.error('Error fetching user data:', userErr);
                    res.status(500).send('Error fetching user data');
                } else {

                    res.render("mycollection", { collectionData, userdata: userData[0] });
                    console.log('Collection Data: ', collectionData);
                }

            });
        }
    });
});


// Route to create a collection, linked to that user's id, via post 
app.post('/mycollection', isLoggedIn, (req, res) => {
    const userId = req.session.authen;
    const collectionName = req.body.collectionName;
    const collectionDescription = req.body.collectionDescription;
    createCollection(userId, collectionName, collectionDescription, (err, result) => {
        if (err) {
            console.error('Error creating collection:', err);
            res.status(500).send('Error creating collection');
        } else {
            res.redirect('/mycollection');
        }
    });
});


// Route to get all cards in a collection and also get all cards in database so user can add to collection 
app.get('/collection/:collectionId', isLoggedIn, (req, res) => {
    const collectionId = req.params.collectionId;
    getCardsInaCollection(collectionId, (err, cards) => {
        if (err) {
            console.error('Error fetching cards in collection:', err);
            return res.status(500).send('Error fetching cards in collection');
        }
        getAllCards((err, allCards) => {
            if (err) {
                console.error('Error fetching all cards:', err);
                return res.status(500).send('Error fetching all cards');
            }
            res.render("collectioncards", { cards, allCards, collectionId });
        });
    });
});


// Route to display the cards in the other members colelction, and average rating to be rendered in ejs 
app.get('/collection/:collectionId/cards', isLoggedIn, (req, res) => {
    const collectionId = req.params.collectionId;
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
            res.render("viewonlycards", { cards, collectionId, averageRating });
        });
    });
});


// Route to show all collections, created by all members
app.get('/collections', isLoggedIn, (req, res) => {
    getAllCollections((err, collections) => {
        if (err) {
            console.error('Error fetching collections:', err);
            res.status(500).send('Error fetching collections');
        } else {

            res.render("allcollections", { collections });
        }
    });
});


// Route to delete collection via post 
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




// Route to add cards to colection, via post 
app.post('/collection/:collectionId/addcard', isLoggedIn, (req, res) => {
    const collectionId = req.params.collectionId;
    const cardId = req.body.cardId;
    addCardToCollection(collectionId, cardId, (err, result) => {
        if (err) {
            console.error('Error adding card to collection:', err);
            return res.status(500).send(`Error adding card to collection`);
        }
        console.log('Card added to collection successfully');
        res.redirect(`/collection/${collectionId}`);
    });
});


// Wishlist : 

// Route to add to wishlist via post 
app.post('/wishlist/add', isLoggedIn, (req, res) => {
    const userId = req.session.authen;
    const cardId = req.body.cardId;
    addToWishlist(userId, cardId, (err) => {
        if (err) {
            console.error("Error adding card to wishlist:", error);
            res.status(500).send("Error adding card to wishlist.");
        }

    });
});


// Route to display all cards in wishlist via the user id 
app.get('/wishlist', isLoggedIn, (req, res) => {
    const userId = req.session.authen;
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


// Route to remove card from wishlist via post 
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


// Rating :

// Route to add a rating for a collection, via post 
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


// Route to sign up to webiste, using bcrypt, thus async. Login via Week07 Lab
app.post('/signup', async (req, res) => {
    const email = req.body.upemail;
    const username = req.body.username;
    const password = await bcrypt.hash(req.body.uppassword, 10);
    registerUser(email, username, password, (err, result) => {
        if (err) {
            console.error('Error occurred during sign-up:', err);
            res.redirect('/signin');
        } else {
            res.redirect('/signin?registered=true');
        }
    });
});


// Route for user to log out and session to be destoryed  
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


// Route to delete card from database, admin only via ejs, via post 
app.post('/deleteCard', (req, res) => {
    const cname = req.body.cardname;
    const setID = req.body.cardset;
    deleteCardAdmin(cname, setID, (err, result) => {
        if (err) {
            console.error('Error occurred whenn deleting card:', err);
            res.redirect('/dashboard');
        } else {
            res.redirect('/dashboard?deleted=true');
        }
    });
});


// Route to add card to database, admin only via ejs, via post 
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


// Route to delete account, via post, checking if user id logged in and user id of the email enetered is the same, thus allowed to delete account 
app.post('/deleteAccount', (req, res) => {
    const emailToDelete = req.body.delEmail;
    const sessionUserId = req.session.authen;
    if (!sessionUserId) {
        res.redirect('/signin');
        return;
    }
    getUserById(sessionUserId, (err, user) => {
        if (err) {
            console.error('Error occurred while fetching user data:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        if (user && user.length > 0 && user[0].email === emailToDelete) {
            deleteAccount(emailToDelete, (deleteErr, result) => {
                if (deleteErr) {
                    console.error('Error occurred when deleting account:', deleteErr);
                    res.redirect('/dashboard?deleteerror=true');
                } else {
                    req.session.destroy((sessionErr) => {
                        if (sessionErr) {
                            console.error('Error occurred during logout:', sessionErr);
                        }
                        res.redirect('/signin?deleteaccount=true');
                    });
                }
            });
        } else {
            res.redirect('/dashboard?deleteerror=true');
        }
    });
});


// Route to update email, via post, and checks user that is logged in id is the same as the id tof the email that is trying to be changed 
app.post('/updateEmail', (req, res) => {
    const oldEmail = req.body.oldEmail;
    const newEmail = req.body.newEmail;
    const sessionUserId = req.session.authen;

    if (!sessionUserId) {
        res.redirect('/signin');
        return;
    }

    getUserById(sessionUserId, (err, user) => {
        if (err) {
            console.error('Error occurred while fetching user data:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        if (user && user.length > 0 && user[0].email === oldEmail) {
            updateEmail(oldEmail, newEmail, sessionUserId, (updateErr, result) => {
                if (updateErr) {
                    console.error('Error occurred when updating email:', updateErr);
                    res.status(500).send('Error occurred when updating email');
                } else {

                    if (result.affectedRows > 0) {
                        res.redirect('/dashboard?emailupdate=true');
                    } else {

                        res.redirect('/dashboard?emailupdateerror=true');
                    }
                }
            });
        } else {
            res.redirect('/dashboard?emailupdateerror=true');
        }
    });
});

// 404 Route: Must be last route here
app.get('*', log_data, browser_lang, (req, res) => {
    res.render("404", { title: '404 Error' })
});

// Listenign for connection at port 
app.listen(PORT, (err) => {
    if (err) {
        console.error('Error occurred while starting the server:', err);
    } else {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log(`Hello from the app.js`)
    }
});