const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const fetch = require("node-fetch")
app.use(cors());
app.use(express.json()); //req.body

//get a tire 
app.get("/tires/:width/:ratio/:rim", async (req, res)=>{
    try{
       
       const {width, ratio, rim} = req.params;
        const gettire = await pool.query( "SELECT * FROM tires WHERE width = $1 and ratio= $2 and rim = $3;",
        [width, ratio, rim]);
        if( gettire.rows == ''){
            
            res.json("");
        }else{
            res.json(gettire.rows[0]);
        };    
    }catch(err){
        console.error(error.message);

    }
});
//upload a tire adding more to quantiy 
app.post("/tires", async (req, res) => {
    try {
          
        const {width, ratio, rim, quanity} = req.body;
        
        const response = await fetch('http://localhost:5001/tires/'+width +"/"+ratio +"/" +rim+ '/',);
            console.log(quanity)
            const jsonData = await response.json();
            if(jsonData > ""){
                
                var oldquantiy = jsonData.quanity;
                console.log(jsonData)
                
                const added_quanity = parseInt(quanity);
                console.log(added_quanity)
               const newquantiy = oldquantiy + added_quanity;
                //update quantiy
                const update = await pool.query(
                    'UPDATE tires SET quanity = $4 WHERE width = $1 AND ratio = $2 AND rim = $3;',
                    [width, ratio, rim, newquantiy]
                   
                );      
                res.json({
                    width: width,
                    ratio: ratio,
                    rim: rim,
                    quantity: newquantiy});
               
                console.log("tires quanity has been added");
            }else{
                
                const newTire = await pool.query(
                    'INSERT INTO tires VALUES($1, $2, $3, $4)',
                    [width, ratio, rim, quanity]
                   
                );
                    console.log("hi")
                res.json({
                    width: width,
                    ratio: ratio,
                    rim: rim,
                    quantity: quanity});
            }     
      
    } catch (err) {
      console.error(err.message);
    }
  });
 

//get all the tires 
app.get("/tires", async (req, res) => {
    try {
        
      const allTodos = await pool.query("SELECT * FROM tires ORDER BY quanity");
      res.json(allTodos.rows);
    } catch (err) {
      console.error(err.message);
    }
  });

  //deleting tires 
  app.delete("/tires", async(req, res) =>{
    try {
          
        const {width, ratio, rim, quanity} = req.body;
        
        const response = await fetch('http://localhost:5001/tires/'+width +"/"+ratio +"/" +rim+ '/',);
            console.log(quanity)
            const jsonData = await response.json();
            //checking if tire is in the table
            if(jsonData > ""){
                
                var oldquantiy = jsonData.quanity;
                console.log(jsonData)
                
                const sub_quanity = parseInt(quanity);
                
               const newquantiy = oldquantiy  - sub_quanity;
               if(newquantiy < 0 ){
                   res.status(400).json('subtrating to much')
               }
               else{
                   if (newquantiy ==0) {
                    const del = await pool.query(
                        ' DELETE FROM tires WHERE width = $1 AND ratio = $2 AND rim = $3;',
                        [width, ratio, rim]
                       
                    );
                      
                   } else {
                       //update quantiy
                        const update = await pool.query(
                        'UPDATE tires SET quanity = $4 WHERE width = $1 AND ratio = $2 AND rim = $3;',
                        [width, ratio, rim, newquantiy]
                    
                );
                   
                
                }
                res.json({
                    width: width,
                    ratio: ratio,
                    rim: rim,
                    quantity: newquantiy});
                }
            
        }else{
                res.status(404).json("there is no tire");
            }
            }catch (err) {
                console.error(err.message);
              }
            });   
      
  
app.listen(5001
    , ()=>{
    console.log("srever is runing")
});  