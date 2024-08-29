const express = require('express');
const { sequelize, migrateAndSeed } = require('./models');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
const authRoutes = require('./routers');
app.use(authRoutes);

// Start server and migrate/seed database
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    // Authenticate database connection
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Run migrations and seeding
    await migrateAndSeed();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});

