'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

async function migrateAndSeed() {
  try {
    await sequelize.sync({ force: false });
    console.log('Database synchronized successfully.');

    const movies = [
      {
        title: "Doraemon: Nobita's Dinosaur - 2006",
        synopsis: "Doraemon - Nobita's Dinosaur 2006...",
        trailerUrl: "https://www.youtube.com/embed/1udlBviHgzQ",
        imgUrl: "https://ik.imagekit.io/77pzczg37zw/doraemon-poster-1.jpg",
        rating: 5,
        status: "active"
      },
      {
        title: "Harry Potter",
        synopsis: "A house-elf warns Harry against returning to Hogwarts...",
        trailerUrl: "https://www.youtube.com/embed/VyHV0BRtdxo",
        imgUrl: "https://ik.imagekit.io/77pzczg37zw/HP.jpg",
        rating: 4,
        status: "active"
      },
      {
        title: "Love Story (1970)",
        synopsis: "Love Story is a 1970 American romantic drama...",
        trailerUrl: "https://www.youtube.com/embed/JASEIR8hjzk",
        imgUrl: "https://ik.imagekit.io/77pzczg37zw/love-story-1970-poster.jfif",
        rating: 4,
        status: "active"
      },
      {
        title: "Titanic",
        synopsis: "Titanic is a 1997 American epic romance and disaster film...",
        trailerUrl: "https://www.youtube.com/embed/cIJ8ma0kKtY",
        imgUrl: "https://ik.imagekit.io/77pzczg37zw/titanic-poster.jpg",
        rating: 5,
        status: "active"
      }
    ];

    for (const movie of movies) {
      await db.Movie.findOrCreate({
        where: { title: movie.title },
        defaults: movie
      });
    }

    console.log('Database seeding completed.');
  } catch (error) {
    console.error('Error during database migration and seeding:', error);
  }
}

db.migrateAndSeed = migrateAndSeed;

module.exports = db;


db.migrateAndSeed = migrateAndSeed;

module.exports = db;

