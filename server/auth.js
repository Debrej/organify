//region INITIALIZATION
    const express = require('express');
    const fs = require('fs');
    const bodyParser = require('body-parser');
    const sprintf = require('sprintf-js').sprintf;
    const auth_requests = require("./assets/json/auth_request.json");
    const errors = require("./assets/json/error_messages.json");
    const mysql = require('mysql');
    const app = express();
    const crypto = require('crypto');
    const dateFormat = require('date-format');
    const pwd = require('./assets/json/pwd.json').pwd_auth_organify;
    const host = "auth.debrej.fr";

    app.use('/assets', express.static('assets'));
    app.use(bodyParser.json() );
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(express.json());
    app.use(express.urlencoded());

    app.use(function(req, res, next){
        let log = "["+dateFormat(new Date(), "yyyy-mm-dd h:MM:ss")+"] : "+req.method+" "+host+req.originalUrl+" FROM "+req.ip+"\n";
        fs.appendFile("auth.log", log, (err) => {
            if (err) throw err;
            console.log(log);
        });
        next();
    });

    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'auth_organify',
        database: 'organify',
        password: pwd
    });

    connection.connect();

    connection.query('SELECT 1 + 1 AS status', function(err, rows, fields) {
        if (err) {console.log("ERROR WHEN CONNECTING");}
        else{
            console.log('Connection to DB acquired\n\tSTATUS -> CONNECTED\n');
        }
    });
//endregion

//region FUNCTIONS

//endregion

//region REQUESTS

    app.post("/check_pwd", function(req, res){
        console.log(host+req.originalUrl);
        let pwd = req.body.pwd;
        let mail = req.body.mail;

        let request = sprintf(auth_requests.get_idorga_by_mail, mail);
        connection.query(request, function(err, rows, field){
           if (err) res.send({'status': 1, 'error': errors.error_1});
           else if (rows[0] !== undefined){
               let idOrga = rows[0].idOrga;
               let username = rows[0].first_name + " " + rows[0].last_name.toUpperCase();
               let request = sprintf(auth_requests.get_pwd_idorga, idOrga);
               connection.query(request, function(err, rows, field){
                   if (err) res.send({'status': 1, 'error': errors.error_1});
                   else{
                       let ans_status = rows[0] !== undefined ? rows[0].pwd === pwd : false;
                       console.log("pwd on db:", rows[0].pwd,"\npwd from req:", pwd);
                       if(ans_status){
                           let token;
                           crypto.randomBytes(48, function(err, buffer) {
                               token = buffer.toString('hex');
                               let request = sprintf(auth_requests.check_user_already_exist, idOrga);
                               connection.query(request, function(err, rows, field){
                                   if(err) res.send({'status': 1, 'error': errors.error_1});
                                   else{
                                       if(rows[0] !== undefined){
                                           let request = sprintf(auth_requests.update_token, token, idOrga);
                                           connection.query(request, function(err, rows, field){
                                               if(err) res.send({'status': 1, 'error': errors.error_1});
                                               res.send({"status": 0, "response": ans_status, "token": token, "username": username, "idOrga": idOrga});
                                           });
                                       }
                                       else{
                                           let request = sprintf(auth_requests.insert_token, idOrga, token);
                                           connection.query(request, function(err, rows, field){
                                               if(err) res.send({'status': 1, 'error': errors.error_1});
                                               res.send({"status": 0, "response": ans_status, "token": token, "username": username, "idOrga": idOrga});
                                           });
                                       }
                                   }
                               });
                           });
                       }
                       else{
                           res.send({"status": 0, "response": ans_status});
                       }
                   }
               });
           }
           else{
               res.send({"status": 2, 'error': errors.error_2});
           }
        });
    });

    app.post("/register_user", function(req, res){
        console.log(host+req.originalUrl);
        let pwd = req.body.pwd;
        let mail = req.body.mail;

        console.log("REGISTER A NEW USER WITH\n\tMAIL :",mail,"\n\tPWD HASH : ***");

        let request = sprintf(auth_requests.get_idorga_by_mail, mail);
        connection.query(request, function(err, rows, field){
            if (err) res.send({'status': 1, 'error': errors.error_1, 'SQL_err': err});
            else{
                if(rows[0] !== undefined){
                    let idOrga = rows[0].idOrga;
                    let request = sprintf(auth_requests.insert_pwd, idOrga, pwd);
                    connection.query(request, function (err, rows, field) {
                        if (err) {
                            res.send({'status': 1, 'error': errors.error_1, 'SQL_err': err});
                        }
                        else{
                            let request = sprintf(auth_requests.get_orga_details, idOrga);
                            connection.query(request, function (err, rows, fields) {
                                if (err) {
                                    res.send({'status': 1, 'error': errors.error_1, 'SQL_err': err});
                                }
                                else{
                                    res.send({'orga': rows[0], 'status': 0});
                                }
                            });
                        }
                    });
                }
                else{
                    res.send({'status': 1, 'error': errors.error_2, 'SQL_err': err});
                }
            }
        });
    });

    app.post("/logout", function(req, res){
        console.log(host+req.originalUrl);
        let token = req.body.token;
        let request = sprintf(auth_requests.delete_token, token);
        connection.query(request, function (err, rows, fields) {
            if (err) {
                res.send({'status': 1, 'error': errors.error_1, 'error_msg': err});
            }
            else{
                res.send({'status': 0});
            }
        });
    });

//endregion

//region LISTEN

app.listen(4524, function(){
    console.log("auth server listening on port 4524");
});

//endregion