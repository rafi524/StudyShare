const { supabase } = require('../main.js');

async function checkConnection() {
    try {
      const { data, error } = await supabase
        .from('User') // Replace with your table name
         .select('id, UserName')
        .eq('UserName','anik'); // Add the WHERE clause to filter by "id" equal to 1
  
      if (error) {
        console.error('Error:', error.message);
      } else {
        console.log('Connection successful. Data:', data);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

async function createNewCustomer(customer){
   /* const sql = `
Begin CREATE_CUSTOMER(:username,:name,:email,:phone,:password,:nid,:passport,:country,:city,:detail,:signupdate,:birthdate); end;
    `;
    const binds = {
        
        username: customer.username,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        password: customer.password,
        nid: customer.nid,
        passport: customer.passport,
        country: customer.country,
        city: customer.city,
        detail: customer.detail,
        signupdate:customer.signupdate,
        birthdate:customer.birthdate

    }
    console.log(customer);
    return await database.execute(sql, binds, {});
    */
}
async function createNewCompany(company)
{
    /*
    const sql=
    `
 Begin CREATE_COMPANY(:username,:cname,:email,:phone,:password,:type,:signupdate); end;
`;
const binds={
    username: company.username,
    cname: company.cname,
    email: company.email,
    phone: company.phone,
    password: company.password,
    type: company.type,
    signupdate:company.signupdate
}
console.log("binds");        
console.log(binds);
    return await database.execute(sql, binds, {});
    */
}
async function getLoginInfoByEmail(email){
    /*
    const sql = `
        SELECT 
            ID, "User_Type","Password","User_Name"
        FROM 
            "User"
        WHERE 
            "Email" = :email
        `;
    const binds = {
        email : email
    }

    return (await database.execute(sql, binds, database.options)).rows;
    */
}
async function getLoginInfoByUserName(username){
    checkConnection();
    const { data, error } = await supabase
    .from('User')
    .select('id, UserName, Password')
    .eq('UserName',username)
    

  if (error) {
    console.error('Error fetching data:', error.message);
    return ;
  }

  console.log('Users:', data);
  return data;
}

async function getLoginInfoByID(uid){
    const { data, error } = await supabase
    .from('User')
    .select('id, UserName, Password')
    .eq('id',uid)
    

  if (error) {
    console.error('Error fetching data:', error.message);
    return ;
  }

  console.log('Users:', data);
  return data;
}

module.exports = {
   
    createNewCustomer,
    createNewCompany,
    getLoginInfoByEmail,
    getLoginInfoByUserName,
    getLoginInfoByID
}