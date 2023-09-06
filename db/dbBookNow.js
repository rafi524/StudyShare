const { Result } = require('express-validator');
const database = require('./dbMain.js');



async function makeAReservation(custID,totalFare,status){
    
    const sql = `
    SELECT GENARATE_ID.NEXTVAL FROM DUAL 
`;
    const binds = {    
    }
    let result= (await database.execute(sql, binds, database.options)).rows;
      
    let RID=result[0].NEXTVAL;
    const sql2=`
    BEGIN
    INSERT INTO "Reservation"
    VALUES(:RID,CURRENT_TIMESTAMP,:custID,:totalFare,:status);
    IF :status='Confirm' THEN
    UPDATE "Customer"
	SET "Wallet"="Wallet"-:totalFare
	WHERE ID=:custID;
    END IF;
    END;
    `

      const binds2= { 
        RID:RID,
        custID:custID,
        totalFare:totalFare,
        status:status,  
    }
    await database.execute(sql2, binds2, database.options);
   return RID; 
     
}

async function bookASeat(rID,seatID,rDate){
   
    const sql = `
    insert into "Booked_Seats"
VALUES(GENARATE_ID.NEXTVAL,:seatID,:rDate,:rID)
   
`;
    const binds = {
      seatID:seatID,
      rDate:rDate,
      rId:rID,
    }
    return (await database.execute(sql, binds, database.options));
}

async function addTransaction(trxID,trxDate,amount,method,custID){

    const sql = `

    INSERT INTO "Transaction"
    VALUES (:trxID,:trxDate,:amount,:method,:custID)
`;
    const binds = {
       trxID:trxID,
       trxDate:trxDate,
       amount:amount,
       method:method,
       custID:custID,
    }
    return (await database.execute(sql, binds, database.options));
}
async function confirmAReservation(rID){
  
    const sql = `
 DECLARE
 i NUMBER;
 BEGIN
 UPDATE "Reservation"
SET "Status"='Confirm'
WHERE "Res_ID"=:rID;
i := SQL%ROWCOUNT;
DBMS_OUTPUT.PUT_LINE(i);
END;
`;
    const binds = {
       rID:rID,
       
    }
    let cnt= await database.executeWithDbmsOutput(sql, binds, database.options);
    
     
  
     return parseInt(cnt);
}
async function getReservationDetails(rID){
    
    const sql=`
    SELECT "Res_ID", "Time", "Cust_id", "Total_Fare","Status",(SELECT COUNT(*) FROM "Booked_Seats" WHERE "Res_ID"="Reservation"."Res_ID" ) AS TotalSeat FROM "Reservation"
    WHERE  "Res_ID"=:rID
    `;
         const binds={
            rID:rID,
         }
    return (await database.execute(sql, binds, database.options)).rows;

}
module.exports = {
   
    addTransaction,
    makeAReservation,
    bookASeat,
    confirmAReservation,
    getReservationDetails,
}