const express = require('express');
const app = express();

const express = require('express');
const router = express.Router();

module.exports = (err, req, res, next) => {
    res.status(500).json({ message: err.message });
};

module.exports = (req, res, next) => {
    if (!req.body.name) {
        return res.status(400).json({ message: 'Name is required' });
    }
    next();
};


router.get('/', (req, res) => {
    res.send('Get all lessons');
});

module.exports = router;

router.post('/', (req, res) => {
    res.send('Order created');
});

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/after-school', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});




app.listen(3000, () => console.log('Server running on port 3000'));
