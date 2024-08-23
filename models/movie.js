'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    static associate(models) {
    }
  }
  Movie.init({
    title: DataTypes.STRING,
    synopsis: DataTypes.TEXT,
    trailerUrl: DataTypes.STRING,
    imgUrl: DataTypes.STRING,
    rating: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Movie',
  });
  return Movie;
};