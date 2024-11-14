const express = require('express');
const sequelize = require('./config/db')
const bodyParser = require('body-parser');
const carRoutes = require('./routes/vehicle.routes');
const userRoutes = require('./routes/user.routes.js');
const { PORT } = require('./config/constants');
const app = express();

app.use(bodyParser.json());
app.use('/api', carRoutes);
app.use('/api', userRoutes);

sequelize.sync().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });

module.exports = app;
