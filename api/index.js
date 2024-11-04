const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
const User=require('./models/User.js');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const CookieParser=require('cookie-parser');
const cookieParser = require('cookie-parser');
const imageDownloader=require('image-downloader');
const multer=require('multer');
const fs=require('fs');
require('dotenv').config();
const app=express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtsecret= 'fasefraw4r5r3wq45wdfgw34twdfg';

app.use(express.json());
app.use(cookieParser());
app.use('/uploads',express.static(__dirname+'/uploads'));
app.use(cors({
   credentials:true,
   origin: 'http://localhost:5173',
}));

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));;

app.get('/test',(req,res)=>{
    res.json('test ok');
});

app.post('/register',async(req,res)=>{

    const {name,email,password}=req.body;
    console.log("received data:",{name,email,password}); // Log received data
    try {
        const userDoc= await User.create({
            name,
            email,
            password:bcrypt.hashSync(password, bcryptSalt),
        });
        // console.log("User Document Created:", userDoc); // Log successful creation
        res.json(userDoc);
    } catch (e) {
        res.status(422).json(e);
    }
});

app.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    const userDoc=await User.findOne({email});
    
    if(userDoc){
        const passok=bcrypt.compareSync(password,userDoc.password);
        if(passok){
            jwt.sign({
                email:userDoc.email,
                id:userDoc._id,
                name:userDoc.name   //optional remove afterward
            },jwtsecret,{},(err,token)=>{
                if(err)throw err;
                res.cookie('token',token).json(userDoc);
            })
        }else{
            res.status(422).json('pass not ok');
        }
    }
    else {
        res.json('not found');
    }
})

app.get('/profile',(req,res)=>{
    // mongoose.connect(process.env.MONGO_URL);
    const {token}=req.cookies;
    if(token){
        jwt.verify(token,jwtsecret,{},async(err,userData)=>{
            if(err)throw err;
            const {name,email,_id}=await User.findById(userData.id);
            res.json({name,email,_id});
        });
    }
    else{
        res.json(null);
    }
});

app.post('/logout',(req,res)=>{
    res.cookie('token','').json(true);
});

console.log({__dirname});   //optional for now
app.post('/upload-by-link',async(req,res)=>{
    const {link}=req.body;
    const newName='photo'+Date.now()+'.jpg';
    await imageDownloader.image({
        url:link,
        dest:__dirname+'/uploads/ '+newName,
    });
    res.json(newName); 
});

const photoMiddleware=multer({dest:'/uploads'});
app.post('/uploads',photoMiddleware.array('photos',100),(req,res)=>{
    const uploadedFiles=[];
    for(let i=0;i<req.files.length;i++){
        const {path,originalname}=req.files[i];
        const parts=originalname.split('.');
        const ext= parts[parts.length-1];
        const newpath=path + '.' + ext;
        fs.renameSync(path, newpath);
        uploadedFiles.push(newpath.replace('uploads/','')); 
    }
    res.json(uploadedFiles);
});

app.post('/places', (req,res)=>{
const {token}=req.cookies;
const {
    title,address,addedPhotos,description,price,
    perks,extraInfo,checkIn,checkOut,maxGuests,
  } = req.body;
  jwt.verify(token,jwtsecret,{},async(err,userData)=>{
    if(err) throw err;
    const placeDoc=await place.create({
        owner:userData.id,price,title,
        address,photos:addedPhotos,description,
        perks,extraInfo,checkIn,checkOut,maxGuests,
    });
    res.json(placeDoc);
  })
});

app.get('/user-places',(req,res)=>{
    const {token}=req.cookies;
    jwt.verify(token,jwtsecret,{},async(err,userData)=>{
        const {id}=userData;
        res.json(await place.find({owner:id}));
    });
});

app.get('/places/:id',async(req,res)=>{
    const {id}=req.params;
    res.json(await PlaceformPage.findById(id));
});

app.put('/places',async(req,res)=>{
    const {token}=req.cookies;
    const {
        title,address,addedPhotos,description,
        perks,extraInfo,checkIn,checkOut,maxGuests,price,
      } = req.body;
      jwt.verify(token,jwtsecret,{},async(err,userData)=>{
        if(err) throw err;
        const placeDoc=await place.findById(id);
        if(userData.id=== placeDoc.owner.toString()){
            placeDoc.set({
                title,address,photos:addedPhotos,description,
                perks,extraInfo,checkIn,checkOut,maxGuests,price,
            });
            await placeDoc.save();
            res.json('ok');
        }
    });
});

app.get('/places',async(req,res)=>{
    res.json(await Place.find());
})

app.listen(4000);