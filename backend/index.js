const express = require('express');
const sequelize = require('./config/db')
const bodyParser = require('body-parser');
const cors = require('cors');
const carRoutes = require('./routes/vehicle.routes');
const userRoutes = require('./routes/user.routes.js');
const { PORT } = require('./config/constants');
const app = express();

app.use(cors());
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', "Access-Control-Allow-Origin", "Access-Control-Allow-Headers", "Access-Control-Allow-Methods", "Access-Control-Allow-Credentials", "Origin", "X-Requested-With", "Accept", "authorization"],
  })
);

app.use(bodyParser.json());
app.use('/api', carRoutes);
app.use('/api', userRoutes);

sequelize.sync().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });

module.exports = app;
