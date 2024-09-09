const express = require('express');
const router = express.Router();
const mysql = require('mysql2')
let SqlString = require('sqlstring');

const connetion = mysql.createConnection({
    hostname: '127.0.0.1',
    user: 'root',
    port: 3305,
    password: 'root',


})

connetion.connect((error) => {
    if (error) {
        console.log(`db is not connected`, error)
    } else {
        console.log(`db is connected`)
    }
})

router.post('/inser_user_details', (req, resp) => {
    let objectToSend = {}
    try {
        let obj = req.body
        let db = 'dummy'
        let sql = ` insert into ${db}.user (name,email) values (${SqlString.escape(obj.name)},${SqlString.escape(obj.email)})`

        connetion.query(sql, (error, result) => {
            if (error) {
                objectToSend["error"] = true
                objectToSend["data"] = 'Some Error Ocuured at Server Side'
                resp.send(objectToSend)
                resp.end()

            }
            else {
                console.log(result)
                let user_id = result.insertId

                let sql_user_details = ` insert into ${db}.user_deatils (user_id,mobile,address,gender) values (${SqlString.escape(user_id)},${SqlString.escape(obj.mobile)},${SqlString.escape(obj.address)},${SqlString.escape(obj.gender)})`



                connetion.query(sql_user_details, (error1, result1) => {
                    if (error1) {
                        objectToSend["error"] = true
                        objectToSend["data"] = 'Some Error Ocuured at Server Side'
                        resp.send(objectToSend)
                        resp.end()

                    } else {
                        objectToSend["error"] = false
                        objectToSend["data"] = 'Successfully Data Inserted'
                        resp.send(objectToSend)
                        resp.end()
                    }
                })
            }
        })
    } catch (error) {

        objectToSend["error"] = true;
        objectToSend["data"] = "InternaL Server Error";
        resp.send(objectToSend);
    }

})


router.get("/getuserdetails", (req, res) => {
    let objectToSend = {};
    try {
        // let obj = JSON.parse(req.params.dtls);
        let db = 'dummy'
        let sql = ` select * from ${db}.user  as us join ${db}.user_deatils as usd on us.id = usd.user_id group by us.id `

        connetion.query(sql, function (error2, results2) {
            if (error2) {
                objectToSend["error"] = true;
                objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support.";
                res.send(objectToSend);
            } else {

                objectToSend["error"] = false;
                objectToSend["data"] = results2;
                res.send(objectToSend);
            }
        });

    } catch (error) {


        objectToSend["error"] = true;
        objectToSend["data"] = "InternaL Server Error";
        res.send(objectToSend);

    }

});


router.delete("/deleteUser:dtls", (req, res) => {
    let objectToSend = {};

    try {
        let db = 'dummy'

        let id = JSON.parse(req.params.dtls)

        let sql = ` delete from ${db}.user  where id = ${SqlString.escape(id)}`

        connetion.query(sql, function (error2, results2) {
            if (error2) {
                objectToSend["error"] = true;
                objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support.";
                res.send(objectToSend);
            } else {
                let sql_user_Dtls = ` delete from ${db}.user_deatils  where user_id = ${SqlString.escape(id)}`

                connetion.query(sql_user_Dtls, function (err, resultt) {
                    if (err) {
                        objectToSend["error"] = true;
                        objectToSend["data"] = "InternaL Server Error";
                        res.send(objectToSend);

                    } else {
                        objectToSend["error"] = false;
                        objectToSend["data"] = 'Deleted Successfully ';
                        res.send(objectToSend);
                    }
                })


            }
        });
    } catch (error) {
        objectToSend["error"] = true;
        objectToSend["data"] = "InternaL Server Error";
        res.send(objectToSend);

    }


});



router.put('/updateUser', (req, res) => {
    let objectToSend = {}

    try {
        let obj = req.body
        let db = 'dummy'




        let sql = `update  ${db}.user set   `
        if (obj['update_data']['name']) {
            sql += `name = ${SqlString.escape(obj['update_data']['name'])}  `
        }
        if (obj['update_data']['email']) {
            sql += ` , email = ${SqlString.escape(obj['update_data']['email'])}`
        }
        if (obj['id']) {
            sql += ` where id  = ${SqlString.escape(obj['id'])}`
        }

        let sql_user_details = `update  ${db}.user_deatils set   `


        if (obj['update_data']['mobile']) {
            sql_user_details += ` mobile = ${SqlString.escape(obj['update_data']['mobile'])} `
        }
        if (obj['address']) {
            sql_user_details += ` , address = ${SqlString.escape(obj['update_data']['address'])}`
        }
        if (obj['gender']) {
            sql_user_details += ` , gender = ${SqlString.escape(obj['update_data']['gender'])}`
        }
        if (obj['id']) {
            sql_user_details += `  where user_id  = ${SqlString.escape(obj['id'])} `
        }



        connetion.query(sql, function (error, results) {
            if (error) {
                objectToSend["error"] = true
                objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
                res.send(objectToSend);
            } else {
                connetion.query(sql_user_details, function (err, resultt) {
                    if (err) {
                        objectToSend["error"] = true
                        objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
                        res.send(objectToSend);
                    } else {
                        objectToSend["error"] = false
                        objectToSend["data"] = " updated successfully"
                        res.send(objectToSend);
                    }
                })

            }
        })
    } catch (error) {
        objectToSend["error"] = true;
        objectToSend["data"] = "InternaL Server Error";
        res.send(objectToSend);
    }

})



// asssignement user details data 

router.get('/Assingmentuserdetails',(req,resp)=>{
    let objectToSend = {}
    // let obj = JSON.parse(req.params.dtls)
    let db = 'dummy'
    let user_tb_Data=[]
    let user_details_tb_Data=[]
    let sql = `select * from ${db}.user`
    connetion.query(sql,(error,result)=>{
        if(error){
            objectToSend["error"]=true
            objectToSend["data"]='Some Error Ocuured at Server Side'
            resp.send(objectToSend)
            resp.end()
        }else{
            user_tb_Data =[]
            user_tb_Data = result
            let user_id = result.map((item)=>item.id)
            let sql_user_Details = ` select * from ${db}.user_deatils `
        connetion.query(sql_user_Details,(Err,resultt)=>{
             if(Err){
                objectToSend["error"]=true
                objectToSend["data"]='Some Error Ocuured at Server Side'
                resp.send(objectToSend)
                resp.end() 
             }else{
                user_details_tb_Data=[]

                user_details_tb_Data=resultt
                
                let new_Arr=[]
                for(let i=0;i<user_tb_Data.length;i++){
                    for(let j=0;j<user_details_tb_Data.length;j++){

                        if(user_tb_Data[i]['id']==user_details_tb_Data[j]['user_id']){
                            new_Arr.push({
                                'id':user_tb_Data[i]['id'],
                                  'name': user_tb_Data[i]['name'],
                                  'email':user_tb_Data[i]['email'],
                                  'details':user_details_tb_Data[j]
                                  
                            })
                        }

                    }
                }

                objectToSend["error"]=false
                objectToSend["data"]=new_Arr
                resp.send(objectToSend)
                resp.end()

             }
        })
        }
    })

    

})



module.exports = router;