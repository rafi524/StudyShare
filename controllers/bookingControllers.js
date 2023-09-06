const dbServices = require('../db/dbServices.js');
const dbBookNow = require('../db/dbBookNow.js');

exports.booknowController= async (req,res,next)=>
{
   
    
    console.log(req.body);
    busID=req.params.id;
    console.log(req.user);
    let message=null;
    if(req.user===null) 
    {
        message='Please login First!';
        res.redirect('back');
    }
    else if(req.user.userType==='Customer') {
       dbServices.getCustomerDetails(req.user.id);
    }

     
   let result=await dbServices.getAllSeatsByVID(busID,'Bus');
   console.log(result);
    
  let Logged=req.user!=null;
    res.render('pages/services/bus/seat.ejs', { Title: 'ZabenNaki', Logged, seats:result,message });
}
exports.transactionController= async(req,res,next)=>
{
    console.log(req.body);
    let Logged=req.user!=null;
    let payNow=null;
    let {method,trxID,amount}=req.body;
    amount=parseInt(amount);
    let date=new Date();
    custID=req.user.id;
   await dbServices.addTransaction(trxID,date,amount,method,custID);

  let customer= await dbServices.getCustomerDetails(req.user.id);
  
   reservation= await dbBookNow.getReservationDetails(req.params.rid);
    console.log(reservation);
  if(reservation.length==0)
  {message ='Session timed out!';
  console.log(message);
    return  res.redirect('back');
    
    
  }
   else if(customer[0].Wallet<reservation[0].Total_Fare)
   {
    message='You don\'t have  enough amount'
    console.log(message); 
     payNow={
        name:'',
        totalSeat:reservation[0].TOTALSEAT,
        totalFare:reservation[0].Total_Fare,
        wallet:customer[0].Wallet,
        rid:req.params.rid,
        jDate:jDate,
       }
     
       
      
      
   }
   else
   {
    let status=await dbBookNow.confirmAReservation(req.params.rid);
    let customer= await dbServices.getCustomerDetails(req.user.id);
    let reservation= result=await dbBookNow.getReservationDetails(req.params.rid);
    console.log(reservation);
    console.log(customer);
    if(status=1) {
        message='success';
        let ticket={
          custname:customer[0].Name,
          from:'',
          to:'',
           jDate:req.query.jDate,
           depTime:'',
           arrTime:'',
           class:'',
           seats:'',
           cname:'',
          wallet:customer[0].Wallet,
          totalFare:reservation[0].Total_Fare,
          totalSeat:reservation[0].TOTALSEAT,
        }
        return res.render('pages/services/Ticket.ejs',{Title: 'ZabenNaki', Logged, seats:[],message,ticket});
    }
    else if(status=0) message='Time  Out.  Please try again!';
    else message='Unknown error occured!';
    console.log(message);
   
   } 
   
   return res.render('pages/services/seat.ejs', { Title: 'ZabenNaki', Logged, seats:[],coaches:null,bType:'',ttID:null,date:req.query.date,message,payNow });
}

