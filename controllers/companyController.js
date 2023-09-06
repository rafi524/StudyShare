const dbCompany = require('../db/dbCompany.js');
exports.chomeGetController= async (req,res,next)=>{

    let Logged=req.user!=null;
    let message=null;
    let company=null;
    let results=[];
    if(!Logged)
    {
        message='Please login first';
    }
    else if(req.user.type=='Customer')
    {
        message='You don\'t own any company.'
    }
    else
    {
        let result= await dbCompany.getCompany(req.user.id);
        console.log(result);
        results= await dbCompany.getVehicles(req.user.id,result[0].Type);
        console.log(results);
        console.log(result);
        company={
            cname:result[0].Company_Name,
            rating:result[0].Rating,
            total:results.length,
            advBook:result[0].DAY_ADV,
        }

    }
    
    res.render('pages/company/company.ejs',{Title:'ZabenNaki', Logged,company,cname:'BD Railway'});

}

exports.chomePostController= async (req,res,next)=>{
console.log(req.body);
console.log(req.query.task);
let Logged=req.user!=null;
    let message=null;
    let company=null;
    let results=[];
    let cID=req.user.id;
if(req.query.task=='adv')
{
    let num=parseInt(req.body.adv);
    if(num<0||num>45) message='Number must be between 0 to 45 !';
    else 
    dbCompany.updateAdv(cID,num);
    let result= await dbCompany.getCompany(req.user.id);
    results= await dbCompany.getVehicles(req.user.id,result[0].Type);
    console.log(results);
    console.log(result);
    company={
        cname:result[0].Company_Name,
        rating:result[0].Rating,
        total:results.length,
        advBook:result[0].DAY_ADV,
    }
}
console.log(company);
res.render('pages/company/company.ejs',{Title:'ZabenNaki', Logged,company,cname:'BD Railway'});
}
exports.vehiclesGetontroller= async (req,res,next)=>{
    let Logged=req.user!=null;
    let message=null;
    console.log(-66);
    let results=[];
    if(!Logged)
    {
        message='Please login first';
    }
    else if(req.user.type=='Customer')
    {
        message='You don\'t own any company.'
    }
    else
    {
        let result= await dbCompany.getCompany(req.user.id);
        results= await dbCompany.getVehicles(req.user.id,result[0].Type);
        console.log(results);
        console.log(result);
    }
    res.render('pages/company/vehicles',{Title:'Vehicles',Logged,message,results,Option:'Train'});

}
