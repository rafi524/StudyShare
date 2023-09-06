const database = require('./dbMain.js');


async function getCustomerDetails(cust_ID){
    const sql = `

   SELECT*
   FROM "Customer"
   WHERE ID=:cust_ID 
`;
    const binds = {
       cust_ID:cust_ID
    }
    return (await database.execute(sql, binds, database.options)).rows;
}
// Travels_Through Details
async function getTravelsThroughDetails(ID){
    const sql = `

   SELECT*
   FROM "Travels_Through"
   WHERE ID=:ID 
`;
    const binds = {
       ID:ID
    }
    return (await database.execute(sql, binds, database.options)).rows;
}
async function getFare(ttID,Class){
    console.log(ttID);
    console.log(Class);
    const sql = `

    SELECT* 
    FROM "Fare"
    WHERE "ttID"=:ttID AND "Class"=:Class

    
`;
    const binds = {
      ttID:ttID,
      Class:Class,
    }
    return (await database.execute(sql, binds, database.options)).rows;
}
async function getVehicles(from,to,Vtype,jDate){
    
    const sql = `

    SELECT ID, "Vehicle_ID","Departure_Time","Arrival_Time","Mode"
    FROM "Travels_Through"
    WHERE "Route_ID"=GET_ROUTE(:st1,:st2,:Vtype) AND "Vehicle_ID" IN (
    SELECT "Vehicle_ID" FROM "Vehicles" WHERE "Vehicle_Type"=:Vtype AND IS_AVAILABLE_V("Vehicle_ID",:Vtype,:jDate)=1
    )
`;
    const binds = {
       st1:from,
       st2:to,
       Vtype:Vtype,
       jDate:jDate,
    }
    return (await database.execute(sql, binds, database.options)).rows;
}

async function getBusByID(vehicleID)
{

    const sql = `

    SELECT "Bus_Name",(SELECT "Company_Name" FROM "Company" WHERE ID=(SELECT "Company_ID" FROM "Bus" WHERE "Bus_ID"=:vehicleID )) AS CNAME,GET_DepStationName(:vehicleID,'Bus') AS DepStation,GET_DesStationName(:vehicleID,'Bus') AS DesStation,"Company_ID"
	FROM "Bus"
    WHERE "Bus_ID"=:vehicleID
`;
    const binds = {
       vehicleID:vehicleID
    }
        
    return (await database.execute(sql, binds, database.options)).rows;
}
async function getTrainByID(vehicleID)
{

    const sql = `

    SELECT "Train_Name",(SELECT "Company_Name" FROM "Company" WHERE ID=(SELECT "Company_ID" FROM "Train" WHERE "Train_ID"=:vehicleID)) AS CNAME,GET_DepStationName(:vehicleID,'Train') AS DepStation,GET_DesStationName(:vehicleID,'Train') AS DesStation
	FROM "Train"
    WHERE "Train_ID"=:vehicleID

`;
    const binds = {
       vehicleID:vehicleID
    }
        
    return (await database.execute(sql, binds, database.options)).rows;
}
async function getAllSeatsByVID(vehicleID,vType,jDate){
    let sql;
    if(vType='Bus')
     sql=`SELECT "Seat_ID","Bus_ID","Seat_No", IS_AVAILABLE_SEAT("Seat_ID",TO_DATE(:jDate, 'YYYY-MM-DD')) AS available 
     FROM "Bus_Seat"
     WHERE "Bus_ID"=:vehicleID`;
    else if(vType='Train')
     sql=`SELECT * FROM "Train_Seat"
     WHERE "Train_ID"=:vehicleID;`;
    else if(vType='Plane')
     sql=`SELECT * FROM "Plane_Seat"
     WHERE "Plane_ID"=:vehicleID;`;
     const binds = {
        vehicleID:vehicleID,
        jDate:jDate,
     }
         
     return (await database.execute(sql, binds, database.options)).rows;

}
async function getTrainSeats(ID,Class,Coach,jDate){
   console.log(-117);
    console.log(Coach);
    const sql=`
    SELECT ID AS "Seat_ID","Class","Train_ID","Coach_No","Seat_No", IS_AVAILABLE_SEAT(ID,TO_DATE(:jDate, 'YYYY-MM-DD')) AS available 
    FROM "Train_Seat"
        WHERE "Train_ID"=:ID AND "Class"=:Class AND "Coach_No"=:Coach 
        `;
     const binds = {
        ID:ID,
        Class:Class,
        Coach:Coach,
        jDate:jDate,
     }
         
     return (await database.execute(sql, binds, database.options)).rows;

}
async function getTrainCoaches(trainID,Class){
    const sql=`
    SELECT DISTINCT "Coach_No"
    FROM "Train_Seat"
    where "Train_ID"=:trainID AND "Class"=:Class
    `;

    const binds={
        trainID:trainID,
        Class:Class,
    }
    return (await database.execute(sql, binds, database.options)).rows;
}
async function getBookedRooms(hotel_ID){
    
    
         
    return (await database.execute(sql, binds, database.options)).rows;

}
async function getBookedSeats(vehicleID){
   
     
         
    return (await database.execute(sql, binds, database.options)).rows;

}
async function addTransaction(trxID,trxDate,amount,method,custID){
    console.log(trxID);
    console.log(amount);
    console.log(trxDate);
    console.log(method);
    console.log(custID);
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
module.exports = {
   
    getVehicles,
    getBusByID,
    getTrainByID,
    getAllSeatsByVID,
  
    getBookedSeats,
    getBookedRooms,
    getCustomerDetails,
    getTravelsThroughDetails,
    addTransaction,
    getFare,

    getTrainSeats,
    getTrainCoaches,
}