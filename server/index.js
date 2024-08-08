const express = require('express')
const mongoose = require('mongoose')
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser')
const multer = require('multer')
const xlsx = require('xlsx');
const Student = require('./model');
const path = require('path');

const PORT = 5000 || 8080
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
// app.use(UserRoute);

app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static("uploads"))

mongoose.connect('mongodb://localhost:27017/excel_upload',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Database Connected...'));

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
});

// upload excel
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploadExcel = multer({ storage: storage });

//route post upload
app.post('/api/upload', uploadExcel.single('file'), (req, res) => {

    try {
        const file = req.file;
        const workbook = xlsx.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);

        for(const item of data) {

            const student = new Student({
                name: item.NAME,
                email: item.EMAIL,
                age: item.AGE,
                class: item.CLASS
            })
            
            student.save();
        }
        console.log(`Data has success saved`)
        res.send('File uploaded successfully!');
      } catch (err) {
        console.log('Error uploading file:', err);
        res.status(500).send('Error uploading file!');
      }


    console.log('Received file:');

    res.status(200).json({ message: 'Data received successfully' });
});

app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log('Server listening on PORT', PORT);
});