
const express=require('express');
const fs=require('fs');
//const sqlRouter=require('./main');

const app=express();
const morgan=require('morgan');
const { format } = require('path');
const guest = require('./middleware/guestCookie').guest;
const auth = require('./middleware/auth').auth;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');


const authUtils=require('./utils/authUtils.js');


//import routes
const authRoutes= require('./routes/authenRoute.js');
const serviceRoutes=require('./routes/serviceRoute.js');
const compamyRoutes=require('./routes/companyRoute.js');
const supabase =require( './main');
app.set('view engine','ejs');
app.set('views','views');
// middleWare Array
const middleWare=[
    morgan('dev'),
    express.static('public'),
    express.urlencoded({extended: true}),
    express.json(),
    cookieParser(),
    guest,
    auth,
]
app.use(express.static('public'));
app.use(middleWare);
app.use('/auth',authRoutes);
app.use('/service',serviceRoutes);
app.use('/company',compamyRoutes);



app.get('/',(req,res)=>{
    
    let Logged=req.user!=null;
    if(req.query.hotel==null)
    res.render('dumb/home2.ejs',{Title:'ZabenNaki',Logged,errors:[],hotel:false});
    else{
        console.log('hotel');
        res.render('dumb/home2.ejs',{Title:'ZabenNaki',Logged,errors:[],hotel:true});
    }
});
app.post('/',(req,res)=>{
    let Logged=req.user!=null;
    if(req.query.hotel==null)
    res.render('dumb/home2.ejs',{Title:'ZabenNaki',Logged,errors:[],srch:'vehicle'});
    else{
       
        res.render('dumb/home2.ejs',{Title:'ZabenNaki',Logged,errors:[],srch:'hotel'});
    }
})


const PORT=4000;
app.listen(PORT,()=>{
    console.log(`Listening at port ${PORT}`);
});