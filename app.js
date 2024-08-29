const express = require('express');
const { sequelize, migrateAndSeed } = require('./models');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const authRoutes = require('./routers');
app.use(authRoutes);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    await migrateAndSeed();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});

