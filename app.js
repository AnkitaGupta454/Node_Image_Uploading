const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

//set storage engine
const storage = multer.diskStorage({
    destination : './public/uploads',
    filename : function(res,file,cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname) );
    }
})

//check File type
function checkFileType(file,cb){
    //allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    //check ext
    const exttype = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if(mimetype && exttype){
        return cb(null,true);
    }
    else{
        cb('Error : Images only!');
    }
}

//Init uploads
const uplaods = multer({
    storage:storage,
    limits:{fileSize:100000000},
    fileFilter : function(req,file,cb){
        checkFileType(file,cb);
    }
}).single('myImage');

// Init App
const app = express();

//set ejs
app.set('view engine','ejs');

//public folder
app.use(express.static('./public'));

app.get('/',(req,res)=>res.render('index'));

app.post('/upload',(req,res)=>{
    uplaods(req,res, (err)=>{
        if(err){
            res.render('index',{
                msg : err
            })
        }else{
            if(req.file==undefined){
                res.render('index',{
                    msg : 'Error : No file Selected!'
                })
            }
            else{
                res.render('index',{
                    msg : ' File uploded',
                    file: `uploads/${req.file.filename}`
                })
            }
        }
    })
})

const port = process.env.port||5000;
app.listen(port,()=>{
    console.log(`server started on port ${port}`)
})