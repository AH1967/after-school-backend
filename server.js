const express = require('express');
const app = express();

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/after-school', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});




app.listen(3000, () => console.log('Server running on port 3000'));
