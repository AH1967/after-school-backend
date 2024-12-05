const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS
const { MongoClient, ObjectId } = require('mongodb'); // MongoDB driver

const app = express();
const PORT = 3000;

// Connection URI
const MONGO_URI = 'mongodb+srv://abdo97:1234@cluster0.8rva7e3.mongodb.net/after_school?retryWrites=true&w=majority';

// Global variables
let db;

// Middleware for parsing JSON requests
app.use(bodyParser.json()); // Parses incoming JSON requests

// Enable CORS for all requests
app.use(cors()); // Allow all origins
                   // Allow cross-origin requests from the front-end
 


// Middleware for logging requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    // Log raw request body
    let rawBody = '';
    req.on('data', chunk => {
        rawBody += chunk;
    });
    req.on('end', () => {
        console.log('Raw Body:', rawBody);
    });

    console.log('Parsed Body:', req.body); // This will show the parsed JSON body
    next();
});



// Connect to MongoDB
MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to MongoDB');
        db = client.db('after_school'); // Database name
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Routes

// A. GET /lessons - Retrieve all lessons
app.get('/lessons', (req, res) => {
    db.collection('lessons')
        .find()
        .toArray()
        .then(lessons => res.json(lessons))
        .catch(err => res.status(500).json({ error: 'Failed to fetch lessons' }));
});

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

app.put('/lessons/:id', async (req, res) => {
    try {
        const lessonID = req.params.id;

        if (!ObjectId.isValid(lessonID)) {
            return res.status(400).json({ error: 'Invalid lesson ID' });
        }

        const { spaces } = req.body;
        if (spaces === undefined || spaces < 0) {
            return res.status(400).json({ error: 'Invalid spaces value' });
        }

        const result = await db.collection('lessons').updateOne(
            { _id: new ObjectId(lessonID) },
            { $set: { spaces } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: 'Lesson not found or no changes made' });
        }

        res.status(200).json({ message: 'Lesson updated successfully' });
    } catch (error) {
        console.error('Error updating lesson:', error);
        res.status(500).json({ error: 'Failed to update lesson' });
    }
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

