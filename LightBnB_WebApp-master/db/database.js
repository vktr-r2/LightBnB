const properties = require("./json/properties.json");
const users = require("./json/users.json");

const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});



/// Users

//Get a single user from the database given their email.

const getUserWithEmail = function (email) {
  return pool
    .query(`SELECT * FROM users WHERE email = $1`, [email])
    .then((result) => {
      return(result.rows[0]);
    })
    .catch((err) => {
      return null;
    });
};

const getUserWithId = function (id) {
  return pool
    .query(`SELECT * FROM users WHERE id = $1`, [id])
    .then((result) => {
      return(result.rows[0]);
    })
    .catch((err) => {
      return null;
    });
};


// Add a new user to the database.

const addUser = function (user) {
  return pool
    .query(`
    INSERT INTO users (name, password, email)
    VALUES ($1, $2, $3)
    RETURNING *;
    `, [user.name, user.password, user.email])
    .then((result) => {
      return(result.rows[0]);
    })
    .catch((err) => {
      return null;
    });
};

/// Reservations

const getAllReservations = function (guest_id, limit = 10) {
  return pool
    .query(`
    SELECT reservations.*, properties.*, avg(rating) as average_rating
    FROM reservations
    JOIN properties ON reservations.property_id = properties.id
    JOIN property_reviews ON properties.id = property_reviews.property_id
      WHERE reservations.guest_id = $1
        GROUP BY properties.id, reservations.id
        ORDER BY reservations.start_date DESC
        LIMIT 10; 
    `, [guest_id])
    .then((result) => {
      return(result.rows);
    })
    .catch((err) => {
      return null;
    });
};

/// Properties

// pool.query(`SELECT title FROM properties LIMIT 10;`).then(response => {console.log(response)})

const getAllProperties = (options, limit = 10) => {
  return pool
    .query(`SELECT * FROM properties LIMIT $1`, [limit])
    .then((result) => {
      return(result.rows);
    })
    .catch((err) => {
      console.log(err.message);
    });
};




const addProperty = function (property) {
  return pool
  .query(`
  INSERT INTO properties (
  owner_id,
  title,
  description,
  thumbnail_photo_url,
  cover_photo_url,
  cost_per_night,
  street,
  city,
  province,
  post_code,
  country,
  parking_spaces,
  number_of_bathrooms,
  number_of_bedrooms)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *;
  `, [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.street,
    property.city,
    property.province,
    property.post_code,
    property.country,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms
  ])
  .then((result) => {
    console.log(result);
    console.log(result.rows);
    console.log(result.rows[0])
    return(result.rows[0]);
  })
  .catch((err) => {
    return null;
  });
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
