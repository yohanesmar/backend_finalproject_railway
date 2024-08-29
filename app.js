const express = require('express');
const authRoutes = require('./routers');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(authRoutes);

app.listen(PORT, () => {
    console.log(`Running on PORT ${PORT}`);
});
