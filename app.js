const express = require('express');
const authRoutes = require('./routers');
const { sequelize } = require('./models'); 
const { exec } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use(authRoutes);


const runMigrations = () => {
    return new Promise((resolve, reject) => {
        exec('npx sequelize-cli db:migrate --env production', (err, stdout, stderr) => {
            if (err) {
                console.error(`Migration Error: ${stderr}`);
                reject(err);
            } else {
                console.log(`Migration Success: ${stdout}`);
                resolve();
            }
        });
    });
};


const runSeeders = () => {
    return new Promise((resolve, reject) => {
        exec('npx sequelize-cli db:seed:all --env production', (err, stdout, stderr) => {
            if (err) {
                console.error(`Seeding Error: ${stderr}`);
                reject(err);
            } else {
                console.log(`Seeding Success: ${stdout}`);
                resolve();
            }
        });
    });
};


sequelize.sync({ force: false })
    .then(() => runMigrations())
    .then(() => runSeeders())
    .then(() => {
        console.log('Database synced, migrations applied, and seeders executed!');
        app.listen(PORT, () => {
            console.log(`Running on PORT ${PORT}`);
        });
    })
    .catch(error => {
        console.error('Unable to connect to the database:', error);
    });

