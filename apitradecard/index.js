require('dotenv').config();
const express = require("express");
const app = express();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

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
    console.log("Hello from inex.js");
});



// Getting Cards from Database, and applying multi-query filters

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

    let queryParams = [];

    if (searchQuery) {
        allcards += ` WHERE card.card_name LIKE ?`;
        queryParams.push(`%${searchQuery}%`);
    }

    if (setFilter) {
        const sets = Array.isArray(setFilter) ? setFilter : [setFilter];
        allcards += searchQuery ? ` AND card.set_id IN (${sets.map(set => '?').join(', ')})` : ` WHERE card.set_id IN (${sets.map(set => '?').join(', ')})`;
        queryParams.push(...sets);
    }

    if (typeFilter) {
        const types = Array.isArray(typeFilter) ? typeFilter : [typeFilter];
        allcards += searchQuery || setFilter ? ` AND card.card_type_id IN (${types.map(type => '?').join(', ')})` : ` WHERE card.card_type_id IN (${types.map(type => '?').join(', ')})`;
        queryParams.push(...types);
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


// Individual card route, with card information displayed via FK links 

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


// Sessions :

// Callback for Authentication & Bcrypt 
const authenticateUser = (email, password, callback) => {
    const getEmail = `SELECT * FROM user WHERE email = ?`;
    connection.query(getEmail, [email], async (err, rows) => {
        if (err) {
            callback(err, null);
        } else {
            console.log(rows);
            if (rows.length === 0) {
                callback(err)
                return;
            }
            const hashedPassword = rows[0].password;
            const passwordMatch = await bcrypt.compare(password, hashedPassword);
            console.log(passwordMatch);
            if (passwordMatch) {
                callback(null, rows);
            } else {
                callback(new Error("Error, invalid user anem or password"));
            }
        }
    })
}


// Callback to get a user by their by user_id
const getUserById = (uid, callback) => {
    const getUserQuery = `SELECT * FROM user WHERE user_id = ?`;
    connection.query(getUserQuery, [uid], (err, rows) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, rows);
        }
    });
};


// Callback to register a new user
const registerUser = (email, username, password, callback) => {
    const createUserQuery = `INSERT INTO user (email, user_name, password) VALUES (?, ?, ?)`;
    connection.query(createUserQuery, [email, username, password], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
};


// Callback to delete a card if user has admin status (within dashboard.ejs if-statement)
// Layered if statements to ensure all card data is deleted from all tables the card_id is linked to 
const deleteCardAdmin = (cname, setID, callback) => {
    const deleteCollectionCardsQuery = `DELETE FROM collection_card WHERE card_id IN (SELECT card_id FROM card WHERE card_name = ? AND set_id = ?)`;
    connection.query(deleteCollectionCardsQuery, [cname, setID], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            const deleteWishlistItemsQuery = `DELETE FROM wishlist WHERE card_id IN (SELECT card_id FROM card WHERE card_name = ? AND set_id = ?)`;
            connection.query(deleteWishlistItemsQuery, [cname, setID], (err, result) => {
                if (err) {
                    callback(err, null);
                } else {
                    const deleteCardQuery = `DELETE FROM card WHERE card_name = ? AND set_id = ?`;
                    connection.query(deleteCardQuery, [cname, setID], (err, result) => {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, result);
                        }
                    });
                }
            });
        }
    });
};


// Callback to add card, based on admin status (within dashboard.ejs if-statement)
const addCardAdmin = (name, hitpoints, price, img, descr, type, set, series, energy, rarity, callback) => {
    const addcardQuery = `INSERT INTO card (card_name, hit_points, price, image_url, card_description, card_type_id, set_id, series_id, energy_type_id, rarity_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    connection.query(addcardQuery, [name, hitpoints, price, img, descr, type, set, series, energy, rarity], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
};


// Callback to delete user account. Declared all SQL at beginning to better readability. SQL statements ensure user_id has no dependencies if userr is deleted, ensure FK parent row error avoided. Final query (deleteAccQuery) executed after all FK links deleted.
const deleteAccount = (userEmail, callback) => {
    const deleteRatingsQuery = `DELETE FROM ratings WHERE collection_id IN (SELECT collection_id FROM collection WHERE user_id = (SELECT user_id FROM user WHERE email = ?))`;
    const deleteCollectionCardsQuery = `DELETE FROM collection_card WHERE collection_id IN (SELECT collection_id FROM collection WHERE user_id = (SELECT user_id FROM user WHERE email = ?))`;
    const deleteCollectionsQuery = `DELETE FROM collection WHERE user_id = (SELECT user_id FROM user WHERE email = ?)`;
    const deleteWishlistQuery = `DELETE FROM wishlist WHERE user_id = (SELECT user_id FROM user WHERE email = ?)`;
    connection.query(deleteRatingsQuery, [userEmail], (ratingsErr, ratingsResult) => {
        if (ratingsErr) {
            callback(ratingsErr, null);
            return;
        }
        connection.query(deleteCollectionCardsQuery, [userEmail], (collectionCardsErr, collectionCardsResult) => {
            if (collectionCardsErr) {
                callback(collectionCardsErr, null);
                return;
            }
            connection.query(deleteCollectionsQuery, [userEmail], (collectionsErr, collectionsResult) => {
                if (collectionsErr) {
                    callback(collectionsErr, null);
                    return;
                }
                connection.query(deleteWishlistQuery, [userEmail], (wishlistErr, wishlistResult) => {
                    if (wishlistErr) {
                        callback(wishlistErr, null);
                        return;
                    }
                    const deleteAccQuery = `DELETE FROM user WHERE email = ?`;
                    connection.query(deleteAccQuery, [userEmail], (deleteErr, result) => {
                        if (deleteErr) {
                            callback(deleteErr, null);
                        } else {
                            callback(null, result);
                        }
                    });
                });
            });
        });
    });
};



// Callback to update a user's email 
const updateEmail = (oldEmail, newEmail, userId, callback) => {
    const updateQuery = `UPDATE user SET email = ? WHERE email = ? AND user_id = ?`;
    connection.query(updateQuery, [newEmail, oldEmail, userId], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
};


// Collections :

// Callback that gets all of the colection data for a user who is logge din 
const myCollectionData = (userId, callback) => {
    const getMyCollectionQuery = `
        SELECT collection.*
        FROM collection
        WHERE collection.user_id = ?
    `;
    connection.query(getMyCollectionQuery, [userId], (err, rows) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, rows);
        }
    });
};


// Callback to create a collection 
const createCollection = (userId, collectionName, collectionDescription, callback) => {
    const createCollectionQuery = `INSERT INTO collection (collection_name, collection_description, user_id) VALUES (?, ?, ?)`;
    connection.query(createCollectionQuery, [collectionName, collectionDescription, userId], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
};


// Callback to list all cards within a user's colection 
const getCardsInaCollection = (collectionId, callback) => {
    const getCardsQuery = `
        SELECT card.*
        FROM collection_card
        INNER JOIN card ON collection_card.card_id = card.card_id
        WHERE collection_card.collection_id = ?
    `;
    connection.query(getCardsQuery, [collectionId], (err, rows) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, rows);
        }
    });
};


// Callback that just gets all user collections
const getAllCollections = (callback) => {
    const query = `
        SELECT *
        FROM collection
    `;
    connection.query(query, (err, rows) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, rows);
        }
    });
};


// Callback that gets all of the cards, to populate values in  drop-down list
const getAllCards = (callback) => {
    const getAllCardsQuery = `SELECT card.*, rarity.rarity, energy_type.energy, \`set\`.set, series.series, card_type.type
    FROM card
    JOIN rarity ON card.rarity_id = rarity.rarity_id
    LEFT JOIN energy_type ON card.energy_type_id = energy_type.energy_type_id
    JOIN \`set\` ON card.set_id = \`set\`.set_id
    JOIN series ON card.series_id = series.series_id
    JOIN card_type ON card.card_type_id = card_type.card_type_id`;;
    connection.query(getAllCardsQuery, (err, rows) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, rows);
        }
    });
};


// Callback to add cards to a collection 
const addCardToCollection = (collectionId, cardId, callback) => {
    const addCardQuery = `
        INSERT INTO collection_card (collection_id, card_id)
        VALUES (?, ?)
    `;
    connection.query(addCardQuery, [collectionId, cardId], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
};


// Callback to delete ca collection, using multiple SQL queries in a sequntial order to ensure no FK parent row error 
const deleteCollection = (collectionId, callback) => {
    const deleteRatingsQuery = `DELETE FROM ratings WHERE collection_id = ?`;
    connection.query(deleteRatingsQuery, [collectionId], (err, result) => {
        if (err) {
            callback(err, null);
            return;
        }
        const deleteCardsQuery = `DELETE FROM collection_card WHERE collection_id = ?`;
        connection.query(deleteCardsQuery, [collectionId], (err, result) => {
            if (err) {
                callback(err, null);
                return;
            }
            const deleteCollectionQuery = `DELETE FROM collection WHERE collection_id = ?`;
            connection.query(deleteCollectionQuery, [collectionId], (err, result) => {
                if (err) {
                    callback(err, null);
                    return;
                }
                callback(null, result);
            });
        });
    });
};


// Wishlist :

// Callback to add a card to a wishlist 
const addToWishlist = (userId, cardId, callback) => {
    const addToWishlistQuery = `INSERT INTO wishlist (user_id, card_id) VALUES (?, ?)`;
    connection.query(addToWishlistQuery, [userId, cardId], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
};


// Callback to get a wishlist for a user
const getWishlistItems = (userId, callback) => {
    const getWishlistItemsQuery = `
        SELECT card.*
        FROM wishlist
        INNER JOIN card ON wishlist.card_id = card.card_id
        WHERE wishlist.user_id = ?
    `;
    connection.query(getWishlistItemsQuery, [userId], (err, rows) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, rows);
        }
    });
};

// Callback to remove a card from a wishlist 
const removeCardFromWishlist = (userId, cardId, callback) => {
    const removeCardQuery = `
        DELETE FROM wishlist
        WHERE user_id = ? AND card_id = ?
    `;
    connection.query(removeCardQuery, [userId, cardId], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
};



// Ratings : 

// Callback to insert a rating to a database relating to a speicific collection 
const insertRating = (collectionId, userId, ratingValue, callback) => {
    const insertRatingQuery = 'INSERT INTO ratings (collection_id, user_id, rating_value) VALUES (?, ?, ?)';
    connection.query(insertRatingQuery, [collectionId, userId, ratingValue], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
};


// Callback to get average rating, using round function within SQL so average ratings for a collection can be dsiplayed 
const getAverageRating = (collectionId, callback) => {
    const query = 'SELECT ROUND(AVG(rating_value), 1) AS averageRating FROM ratings WHERE collection_id = ?';
    connection.query(query, [collectionId], (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }
        const averageRating = results[0].averageRating || 0;
        callback(null, averageRating);
    });
};



// Exports modules to be aquired in app.js 
module.exports = {
    authenticateUser,
    getUserById, registerUser, deleteCardAdmin, deleteAccount, addCardAdmin, myCollectionData, createCollection, getCardsInaCollection, getAllCollections, deleteCollection, getAllCards, addCardToCollection, addToWishlist, getWishlistItems, removeCardFromWishlist, insertRating, getAverageRating, updateEmail
};
























const server = app.listen(PORT, () => {
    console.log(`API started on port ${server.address().port}`);
});
