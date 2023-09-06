const dbServices = require('../db/dbServices.js');
const dbBookNow= require('../db/dbBookNow.js');
const timeUtils=require('../utils/dateTime.js');
const dbCompany=require('../db/dbCompany.js');
exports.searchBusGetController = (req, res, next) => {
    let Logged=req.user!=null;
    res.render('pages/buslist', { Title: 'ZabenNaki', Logged, errors: [] ,buses:[]});
}
exports.searchBusPostController =async (req, res, next) => {
   
    let {Option,from,to,juorneyDate}=req.body;
   let jDate=new Date(juorneyDate);
    let message=null;
    let result=await dbServices.getVehicles(from,to,Option,jDate);
    
    if(result==[]) console.log('No Vehicles found!');
    console.log(result);
    let results=[];
    let cDate=new Date();
    cDate.setHours(cDate.getHours() + 6);
    console.log(cDate);
    cDate=new Date(cDate.toISOString().substring(0,10));
    console.log('THIS IS CDATE!!');
    console.log(cDate);
    console.log(jDate);
    if(jDate<cDate)
    {
        message='You cannot book on a previous date!'
    }
    
   else if(Option=='Bus')
    {

        let buses=[];
        let len=result.length;
        for(let i=0;i<len;i++)
        {
            
         let vehicleID=result[i].Vehicle_ID;
         let result2=await dbServices.getBusByID(vehicleID);
         console.log(result2);
         let company=await dbCompany.getCompany(result2[0].Company_ID);
         
         
        let dfare= await dbServices.getFare(result[i].ID,'NA')
        let n1= result[i].Departure_Time;
            let n2=result[i].Arrival_Time;
            if(result[i].Mod=='UP')
            [result2[0].DEPSTATION,result2[0].DESSTATION]=[result2[0].DESSTATION,result2[0].DEPSTATION];
         let bus={
             id:result[i].ID,
             busID:result[i].Vehicle_ID,
             name:result2[0].Bus_Name,
             cname:result2[0].CNAME,
             from:result2[0].DEPSTATION,
             to:result2[0].DESSTATION,
             depTime:timeUtils.toStr(n1),
             arrTime:timeUtils.toStr(n2),
             fare:dfare[0].Fare
         }
         
         
         buses.push(bus);
        }
         results=buses;
    }
    else if(Option=='Train')
    {
        let trains=[];
        let len=result.length;
        trains=result;
        
        console.log(trains);
        for(let i=0;i<len;i++)
        {
           
         let vehicleID=result[i].Vehicle_ID;
         let result2=await dbServices.getTrainByID(vehicleID);
        let fSHOVAN= await dbServices.getFare(result[i].ID,'SHOVAN');
        let fSNIGDHA= await dbServices.getFare(result[i].ID,'SNIGDHA');
        let fAC_S= await dbServices.getFare(result[i].ID,'AC_S');
        console.log(fSHOVAN);
        console.log(fAC_S);

        let dfare={
            SHOVAN:fSHOVAN[0].Fare,
            SNIGDHA:fSNIGDHA[0].Fare,
            AC_S:fAC_S[0].Fare,
        }
         let train={
            trainName:result2[0].Train_Name,
             id:result[i].ID,
             trainID:result[i].Vehicle_ID,
             cname:result2[0].CNAME,
             from:result2[0].DEPSTATION,
             to:result2[0].DESSTATION,
             depTime:timeUtils.toStr(result[i].Departure_Time),
             arrTime:timeUtils.toStr(result[i].Arrival_Time) ,
             fare:dfare,
         }
         console.log(train);
         results.push(train);
        }
        
    }
   
   let date=juorneyDate;
   let Logged=req.user!=null;
    res.render('pages/vehicleList',{Title:Option+" Available",Logged,results,date:date,Option,message});
    
}
exports.searchHotelGetController = (req, res, next) => {
    let Logged=req.user!=null;
    res.render('pages/services/hotelSearch', { Title: 'ZabenNaki', Logged, errors: [] });
}
exports.busSeatGetController= async (req,res,next)=>
{let date=req.query.date;
    let Logged=req.user!=null;
   let message=null;
   let payNow=null;
   let result=[];
   let cDate=new Date();
   let jDate=new Date(date);
   cDate.setHours(cDate.getHours() + 6);
   cDate=new Date(cDate.toISOString().substring(0,10));
   console.log(cDate);
   console.log(jDate);
    console.log(req.query);
    
   let ttID=req.params.id;
    let row= await dbServices.getTravelsThroughDetails(ttID);
    busID=row[0].Vehicle_ID;

    let result2=await dbServices.getBusByID(busID);
    let company=await dbCompany.getCompany(result2[0].Company_ID);
         console.log(company);
        
    let bType={
        tName:'Bus',
        Class:'',
        Coach:'',
    }
    let maxDate=new Date();
    maxDate.setDate(cDate.getDate()+company[0].DAY_ADV);
    if(maxDate<jDate)
    {
        console.log(-149);
        console.log(maxDate);
       message="You cannot buy tickets so before"
    }
    else if(jDate<cDate)
    {
        message='You cannot book on a previous date!'
    }
    else
    result=await dbServices.getAllSeatsByVID(busID,'Bus',date);
  
   
   return res.render( 'pages/services/seat.ejs', { Title: 'ZabenNaki', Logged, seats:result,bType,coaches:null,ttID,date,message,payNow });
}

exports.busSeatPostController= async (req,res,next)=>
{
    console.log(req.body);
    ttID=req.params.id;                                         // ID of travels Through Table
    let date=req.query.date;

    let jDate= new Date(date);
    let row= await dbServices.getTravelsThroughDetails(ttID);
    busID=row[0].Vehicle_ID;
    let  seats=await dbServices.getAllSeatsByVID(busID,'Bus',req.query.date);
    let message=null;
    let payNow=null;
    let Logged=req.user!=null;

    let bType={
        tName:'Bus',
        Class:'',
        Coach:'',
    }
    if(req.user===null) 
      message='Please login First!';
    else if(req.user.userType='Customer') {
   
    
    let l=0;
    for (i in req.body) {
        l++;
    }
    let dfare= await dbServices.getFare(ttID,'NA')
    let cost=l*dfare[0].Fare;
    customer= await dbServices.getCustomerDetails(req.user.id);
    let cDate=new Date();
    cDate.setHours(cDate.getHours() + 6);
    cDate=new Date(cDate.toISOString().substring(0,10));
    console.log(cDate);
    console.log(jDate);
    if(jDate<cDate)
    {
        message='You cannot book on a previous date!'
    }
   else if(cost>customer[0].Wallet)
    {   console.log.cost;
        message='Go for Payment.';
        let rID= await dbBookNow.makeAReservation(req.user.id,cost,'Processing');
        for (i in req.body) {
         await dbBookNow.bookASeat(rID,parseInt(i),new Date(req.query.date));
        }
 
       let payNow={
        name:'',
        totalSeat:l,
        wallet:customer[0].Wallet,
        totalFare:cost,
        rid:rID,
        jDate:jDate,
       }
     

       return  res.render('pages/services/seat.ejs', { Title: 'ZabenNaki', Logged, seats,bType,coaches:null,bType,ttID,date:req.query.date,message,payNow });
    }
    else {
      
        
       let rID= await dbBookNow.makeAReservation(req.user.id,cost,'Confirm');
      
       for (i in req.body) {
       await dbBookNow.bookASeat(rID,parseInt(i),new Date(req.query.date));
    }
  
      
        
    }
    
    }
    seats=await dbServices.getAllSeatsByVID(busID,'Bus',req.query.date);
    return res.render('pages/services/seat.ejs', { Title: 'ZabenNaki', Logged, seats,coaches:null,bType,ttID,date:req.query.date,message,payNow });
}

exports.trainSeatGetController= async (req,res,next)=>
{
    
    

    let {Class,Coach,date}=req.query;
    let coach=parseInt(Coach);
   let ttID=req.params.id;
    let row= await dbServices.getTravelsThroughDetails(ttID); 
    let message=null;
    let Logged=req.user!=null;
   let payNow=null;
   trainID=row[0].Vehicle_ID;
   
let cSHOVAN=[];
let cSNIGDHA=[];
let cAC_S=[];
   let rSHOVAN= await dbServices.getTrainCoaches(trainID,'SHOVAN');
   let rSNIGDHA=await dbServices.getTrainCoaches(trainID,'SNIGDHA');
   let rAC_S=await dbServices.getTrainCoaches(trainID,'AC_S');
   for(i of rSHOVAN)
   {
    cSHOVAN.push(i.Coach_No);
   }
   for(i of rSNIGDHA)
   {
    cSNIGDHA.push(i.Coach_No);
   }
   for(i of rAC_S)
   {
    cAC_S.push(i.Coach_No);
   }
   console.log(-245);
   console.log(cSHOVAN);
   if(Coach=='default')
   {
    if(Class=='SHOVAN')coach= cSHOVAN[0];
    else if(Class=='SNIGDHA') coach= cSNIGDHA[0];
    else coach=cAC_S[0];
    
   }
  let result=[];
  let cDate=new Date();
  cDate.setHours(cDate.getHours() + 6);
  cDate=new Date(cDate.toISOString().substring(0,10));
 let jDate= new Date(date);
  if(jDate<cDate)
  {
      message='You cannot book on a previous date!'
  }
   else result=await dbServices.getTrainSeats(trainID,Class,coach,date);
   let coaches={
    SHOVAN:cSHOVAN,
    SNIGDHA:cSNIGDHA,
    AC_S:cAC_S,
    sClass:Class,
    sCoach:coach,
    
   }
   let bType={
    tName:'Train',
    Class:Class,
    Coach:Coach,
   }
   
   
   
   
    res.render( 'pages/services/seat.ejs', { Title: 'ZabenNaki', Logged, seats:result,bType,coaches,ttID,date,message,payNow });

 
  
}
exports.trainSeatPostController= async (req,res,next)=>
{
    let {Class,Coach,date}=req.query;
    let jDate=new Date(date);
    let coach=parseInt(Coach); 
   let ttID=req.params.id;
    let row= await dbServices.getTravelsThroughDetails(ttID);
   trainID=row[0].Vehicle_ID;
   let cSHOVAN=[];
let cSNIGDHA=[];
let cAC_S=[];
   let rSHOVAN= await dbServices.getTrainCoaches(trainID,'SHOVAN');
   let rSNIGDHA=await dbServices.getTrainCoaches(trainID,'SNIGDHA');
   let rAC_S=await dbServices.getTrainCoaches(trainID,'AC_S');
   for(i of rSHOVAN)
   {
    cSHOVAN.push(i.Coach_No);
   }
   for(i of rSNIGDHA)
   {
    cSNIGDHA.push(i.Coach_No);
   }
   for(i of rAC_S)
   {
    cAC_S.push(i.Coach_No);
   }
   
   if(Coach=='default')
   {
    if(Class=='SHOVAN')coach= cSHOVAN[0];
    else if(Class=='SNIGDHA') coach= cSNIGDHA[0];
    else coach=cAC_S[0];
    
   }
   let result=[];
   
    result=await dbServices.getTrainSeats(trainID,Class,coach,date);
   let coaches={
    SHOVAN:cSHOVAN,
    SNIGDHA:cSNIGDHA,
    AC_S:cAC_S,
    sClass:Class,
    sCoach:coach,
    
   }
   let bType={
    tName:'Train',
    Class:Class,
    Coach:Coach,
   }
   console.log(bType);
   console.log(coaches.sCoach);
   let Logged=req.user!=null;
   let message=null;
   let payNow=null;
  

   let cDate=new Date();
   cDate.setHours(cDate.getHours() + 6);
   cDate=new Date(cDate.toISOString().substring(0,10));
   console.log(cDate);
   console.log(jDate);
   if(jDate<cDate)
   {
       message='You cannot book on a previous date!'
   }
  else if(req.user===null) 
      message='Please login First!';
    else if(req.user.userType=='Customer') {
   
        let rFare= await dbServices.getFare(ttID,Class);
        let l=0;
        for (i in req.body) {
            l++;
        }
        let cost=l*rFare[0].Fare;
        customer= await dbServices.getCustomerDetails(req.user.id);
    console.log(customer[0]);
        if(cost>customer[0].Wallet)
        { 
              console.log.cost;
            message='Go for Payment.';
            let rID= await dbBookNow.makeAReservation(req.user.id,cost,'Processing');
            for (i in req.body) {
             await dbBookNow.bookASeat(rID,parseInt(i),new Date(req.query.date));
            }
     
            payNow={
            name:'',
            totalSeat:l,
            wallet:customer[0].Wallet,
            totalFare:cost,
            rid:rID,
            jDate:jDate,
           }         
        }
        else
        {
            let rID= await dbBookNow.makeAReservation(req.user.id,cost,'Confirm');
                console.log(rID);
            for (i in req.body) {
            await dbBookNow.bookASeat(rID,parseInt(i),new Date(req.query.date));  
            console.log(i);
            result=await dbServices.getTrainSeats(trainID,Class,coach,date);
        }
       return  res.render('pages/services/seat.ejs', { Title: 'ZabenNaki', Logged, seats:result,bType,coaches,ttID,date:req.query.date,message,payNow });
    }
}
    else {
          
      message='Please Sign in as a customer!';   
        
    }
    
   return  res.render('pages/services/seat.ejs', { Title: 'ZabenNaki', Logged, seats:result,bType,coaches,ttID,date:req.query.date,message,payNow });
}
