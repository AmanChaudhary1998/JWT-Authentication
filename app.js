const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const randomstring = require('randomstring');

// Set Storage 
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'./uploads/')
    },
    filename: function(req,file,cb){
        cb(null, file.fieldname + Date.now()+ path.extname(file.originalname));
    }
});


// Init Upload
const upload = multer({
    storage:storage
}).single('myImage');

// Init app
const app = express();

// EJS
app.set('view engine', 'ejs');

//Public Folder
app.use(express.static('./public'));


app.get('/',(req,res)=>{
    res.render('register');
})

app.post('/data',(req,res)=>{
    upload(req,res,(err)=>{
        if(err){
            console.error(err.message)
        }else{
            console.log(req.file);
            res.send("Image granted");
        }
    })
})

//PORT
const PORT = process.env.PORT|| 3000;

app.listen(PORT,()=>{
    console.log(`Server running at the port ${PORT}`);
})