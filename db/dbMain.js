const oracledb = require('oracledb');
oracledb.autoCommit = true;
const router = require('express').Router();
async function   executeWithDbmsOutput(sql, binds, options)
{
    console.log(' executing');
    let connection, results;
    let cnt=-1;
    try {
        // Get a connection from the default pool
        connection = await oracledb.getConnection({ user: "ors", password: "ors77", connectionString: "localhost/orcl" });
       
        await connection.execute(
            `BEGIN
               DBMS_OUTPUT.ENABLE(NULL);
             END;`);



        results = await connection.execute(sql, binds, options);
      
        
        console.log('dbmain');
    } catch (err) {
        console.log("ERROR executing sql 1 : " + err.message);
    } finally {
       
        let result;
        do {
    
            const sql2=
            
            `BEGIN
            
            DBMS_OUTPUT.GET_LINE(:ln, :st);
          END;`;
          const binds2={
            ln: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 32767 },
            st: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER } 
    
          }
          result = await connection.execute(sql2, binds2,options);
          console.log(result);
          if (result.outBinds.st === 0)
          cnt=result.outBinds.ln
            
        } while (result.outBinds.st === 0);
    
        if (connection) {
            try {
                // Put the connection back in the pool
                await connection.close();
            } catch (err) {
                console.log("ERROR closing connection: " + err);
            }
        }
    }
    return cnt;
}

// code to execute many sql
async function execute(sql, binds, options){
    let connection,results;
    try {
        // Get a connection from the default pool
        connection = await oracledb.getConnection({user: "ors", password: "ors77", connectionString: "localhost/orcl" });
       results = await connection.execute(sql, binds, options);
    } catch (err) {
        console.log("ERROR executing sql: " + err.message);
    } finally {
        if (connection) {
            try {
              
                await connection.close();
            } catch (err) {
                console.log("ERROR closing connection: " + err);
            }
        }
    }

    return results;
}
// code to execute many sql
async function executeMany(sql, binds, options){
    let connection;
    try {
        // Get a connection from the default pool
        connection = await oracledb.getConnection({user: "ors", password: "ors77", connectionString: "localhost/orcl" });
        await connection.executeMany(sql, binds, options);
    } catch (err) {
        console.log("ERROR executing sql: " + err.message);
    } finally {
        if (connection) {
            try {
                // Put the connection back in the pool
                await connection.close();
            } catch (err) {
                console.log("ERROR closing connection: " + err);
            }
        }
    }

    return;
}
const options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT
}
module.exports = {
    
    execute,
    executeMany,
    executeWithDbmsOutput,
    options,
    oracledb,
};