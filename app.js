const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const ejs = require('ejs');
const { subscribe } = require('diagnostics_channel');



// Connect to MongoDB
mongoose.connect('mongodb+srv://mshawnlouw:Mzw%40m%40d0d%400402@cluster0.gvv0jdf.mongodb.net/');
const db = mongoose.connection;

const mongoURI = 'mongodb+srv://mshawnlouw:Mzw%40m%40d0d%400402@cluster0.gvv0jdf.mongodb.net/test';
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

db.on('error', console.error.bind(console, 'MongoDB connection error:'));



// Define a subscriber schema
const subscriberSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  surname: { type: String, required: true,},
  address: { type: String, required: true },
  tel: { type: Number, required: true },
  gender: { type: String, required: true },
  dateofbirth: { type: String, required: true },
  zipcode: { type: Number, required: true },
  course: { type: String, required: true },
  email: { type: String, required: true }

});
// Create a Subscriber model based on the schema
const Subscriber = mongoose.model('Enrollment', subscriberSchema);

// Set EJS as the view engine

app.set('view engine', 'ejs');

// Serve static files from the public directory
app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({extended: true}))
// Routes
app.get('/', (req, res) => {
  res.render('home', { title: 'home' });
});

app.get('/about', (req, res) => {
  res.render('About', { title: 'about' });
});


app.get('/course', (req, res) => {
  res.render('Course', { title: 'course' });
});

app.get('/programs', (req, res) => {
  res.render('Programs', { title: 'programs' });
});

app.get('/cohort1-2', (req, res) => {
  res.render('Cohort1-2', { title: 'cohort1-2' });
});
app.get('/cohort3-4', (req, res) => {
  res.render('Cohort3-4', { title: 'cohort3-4' });
});
app.get('/cohort5', (req, res) => {
  res.render('Cohort5', { title: 'cohort5' });
});
app.get('/blog', (req, res) => {
  res.render('Blog', { title: 'blog' });
});
app.get('/contact', (req, res) => {
  res.render('Contact', { title: 'contact' });
});

app.get('/donate', (req, res) => {
  res.render('Donate', { title: 'donate' });
});
app.get('/branches', (req, res) => {
  res.render('Branches', { title: 'branches' });
});
app.get('/blog', (req, res) => {
  res.render('Blog ', { title: 'blog' });
});
app.get('/contact', (req, res) => {
  res.render('Contact ', { title: 'contact' });
});

app.get('/enroll', (req, res) => {
  res.render('Enroll', { title: 'enroll' });
});
// Handle form submission
app.post('/enrolled', (req, res) => {
  const name = req.body.name;
  console.log(name)

  const surname = req.body.surname;
  console.log(surname)

  const address = req.body.address;
  const tel = req.body.tel;
  const gender = req.body.gender;
  const dateofbirth = req.body.dateofbirth;
  const zipcode = req.body.zipcode;
  const course = req.body.course;
  const email = req.body.email;

  // Create a new Subscriber document
  const subscriber = new Subscriber({ name, surname, address, tel, gender, dateofbirth, zipcode, email, course });

  // Save the subscriber to the database
  subscriber.save()
    .then(() => {
      console.log('New subscriber added:', name + " " + surname);
      res.send('Thank you for enrolling! Your email has been added to our Enrollment list.');
    })
    .catch((err) => {
      console.error(err);
      res.send('An error occurred while saving the Enrollment.');
    });

});

app.get('/enrolled-students', async (req, res) => {
  try {
    await client.connect();
    const collection = client.db('test').collection('enrollments');

    const data = await collection.find({}).toArray();

    res.render('newlyEnrolled', { data: data });
  } catch (err) {
    console.error('Failed to retrieve data from MongoDB:', err);
    res.status(500).send('Failed to retrieve data from MongoDB');
  } finally {
    await client.close();
  }
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});


// Start the server
app.listen(3030, () => {
  console.log('Server is running on http://localhost:3030');
});
