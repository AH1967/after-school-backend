const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const express = require('express');
const router = express.Router();

const cors = require('cors');
app.use(cors());


module.exports = (err, req, res, next) => {
    res.status(500).json({ message: err.message });
};

module.exports = (req, res, next) => {
    if (!req.body.name) {
        return res.status(400).json({ message: 'Name is required' });
    }
    next();
};


// A. GET /lessons - Retrieve all lessons
app.get('/lessons', (req, res) => {
    db.collection('lessons')
        .find()
        .toArray()
        .then(lessons => res.json(lessons))
        .catch(err => res.status(500).json({ error: 'Failed to fetch lessons' }));
});


module.exports = router;

router.post('/', (req, res) => {
    res.send('Order created');
});

// Connecting Mongodb
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/after-school', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});



// Start the server
app.listen(3000, () => console.log('Server running on port 3000'));
