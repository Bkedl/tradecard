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

















// suing function s here as '/signin is post and not a get req from databse plsu there is a multitude of things 
// that use these codes e.g. wishlist etc where i can set up middle ware 
// could be good to ref my need for this - i.e. these could be put in front end i.e. app.js but i want all my queries ot be ibn one place 
// or move to front end

// sessions and authenitcaiton stufff here:

// Function to authenticate user by email and password
// const authenticateUser = (email, password, callback) => {
//     const getEmailPassword = `SELECT * FROM user WHERE email = ?`;
//     connection.query(getEmailPassword, [email, password], (err, rows) => {
//         if (err) {
//             callback(err, null);
//         } else {
//             callback(null, rows);
//         }
//     });
// };

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












// Function to get user by user_id
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






// Function to register a new user
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


// func to add cards
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




// make big query here for delete accoutn as need to delet all fk constarinmts too when accoutn deleted 

const deleteAccount = (userEmail, callback) => {

    // all work in database level 
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

                    // add another query for themm all here ie the last step?  like delete from user wherer email ....
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


// update email 
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








// COLLECTIONS 

// Function that gets all of the colection data for a user who is logge din 
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

// creating a coltions,  may need to be tweakes alot more 
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


// listing al cards in an actual collection i.e. the useer colection 
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
// Function that just gets all the collections so i can access collection properites and listt hings for all collections  
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


// Function that gets all of the cards to be used in the things where i want all cards in db to show i.e. drop down etc 

const getAllCards = (callback) => {
    const getAllCardsQuery = `SELECT * FROM card`;
    connection.query(getAllCardsQuery, (err, rows) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, rows);
        }
    });
};

// Func adding cards ot coleciton 
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


// deleting collection func 
const deleteCollection = (collectionId, callback) => {
    // First, delete associated ratings
    const deleteRatingsQuery = `DELETE FROM ratings WHERE collection_id = ?`;
    connection.query(deleteRatingsQuery, [collectionId], (err, result) => {
        if (err) {
            callback(err, null);
            return;
        }

        // Then, delete associated cards
        const deleteCardsQuery = `DELETE FROM collection_card WHERE collection_id = ?`;
        connection.query(deleteCardsQuery, [collectionId], (err, result) => {
            if (err) {
                callback(err, null);
                return;
            }

            // Finally, delete the collection itself
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





// WISH LIST 

// ading card to wish
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


// geting wishlist from user
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




// RATINGS 

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


const getAverageRating = (collectionId, callback) => {
    const query = 'SELECT ROUND(AVG(rating_value), 1) AS averageRating FROM ratings WHERE collection_id = ?'; // query uses the round  so essentially .5 etc rather than 5.000000 (is there another way as this may not be accurate) TEST 
    connection.query(query, [collectionId], (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }
        const averageRating = results[0].averageRating || 0; // default to 0 if not ratings here 
        callback(null, averageRating);
    });
};










module.exports = {
    authenticateUser,
    getUserById, registerUser, deleteCardAdmin, deleteAccount, addCardAdmin, myCollectionData, createCollection, getCardsInaCollection, getAllCollections, deleteCollection, getAllCards, addCardToCollection, addToWishlist, getWishlistItems, removeCardFromWishlist, insertRating, getAverageRating, updateEmail
};
























const server = app.listen(PORT, () => {
    console.log(`API started on port ${server.address().port}`);
});
