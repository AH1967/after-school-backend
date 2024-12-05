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

// POST /orders - Save a new order to the orders collection
app.post('/orders', async (req, res) => {
    try {
        const { name, phone, lessonIDs } = req.body;

        // Validate the request body
        if (!name || !phone || !lessonIDs || lessonIDs.length === 0) {
            return res.status(400).json({ error: 'All fields (name, phone, lessonIDs) are required.' });
        }

         // Validate lessonIDs
         if (!lessonIDs.every(id => ObjectId.isValid(id))) {
             return res.status(400).json({ error: 'Invalid lesson IDs' });
        }
        

        // Convert lessonIDs (strings) to ObjectId
        const objectIdLessonIDs = lessonIDs.map(id => new ObjectId(id));

        // Create the new order document
        const newOrder = {
            name,
            phone,
            lessonIDs: objectIdLessonIDs,
            createdAt: new Date(), // Add a timestamp
        };

        // Insert the new order into the orders collection
        const ordersCollection = db.collection('orders');
        await ordersCollection.insertOne(newOrder);

        // Decrement the `spaces` field for each lesson
        const lessonsCollection = db.collection('lessons');
        for (const lessonID of objectIdLessonIDs) {
            await lessonsCollection.updateOne(
                { _id: lessonID },
                { $inc: { spaces: -1 } } // Decrease by 1 per lesson enrolled
            );
        }

        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});



// Connecting Mongodb
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/after-school', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});



// Start the server
app.listen(3000, () => console.log('Server running on port 3000'));
