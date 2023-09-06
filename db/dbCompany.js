const { Result } = require('express-validator');
const database = require('./dbMain.js');



async function getVehicles(cID,cType){

    
    let sql = `
   
`;
console.log(cType);
console.log(cID);
if (cType=='Bus')
sql=`
SELECT * FROM "Bus" B JOIN "Company" C ON(B."Company_ID"=C.ID);
WHERE C.ID=:cID
`;
else if(cType=='Train')
sql=`
SELECT * FROM "Train" T JOIN "Company" C ON(T."Company_ID"=C.ID)
WHERE C.ID=:cID
`;
else console.log('-22');
    const binds = {  
        cID:cID,
    }

    return  (await database.execute(sql, binds, database.options)).rows;  
     
}
async function getCompany(cID){
    
    const sql = `
   SELECT* FROM "Company" WHERE ID=:cID
`;
    const binds = {  
        cID:cID,  
    }
    return  (await database.execute(sql, binds, database.options)).rows;  
     
}

async function updateAdv(cID,num){
    
    const sql = `
    UPDATE "Company"
 SET DAY_ADV=:num
 WHERE ID=:cID
`;
    const binds = {  
        cID:cID,
        num:num, 
    }
    return  await database.execute(sql, binds, database.options);  
     
}



module.exports = {
    getVehicles,
    getCompany,
    updateAdv,
  
}