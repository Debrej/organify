//region INITIALIZATION
    const express = require('express');
    const bodyParser = require('body-parser');
    const fs = require('fs');
    const sprintf = require('sprintf-js').sprintf;
    const sql_requests = require("./assets/json/sql_request.json");
    const errors = require("./assets/json/error_messages.json");
    const month_duration = require("./assets/json/month_duration.json");
    const mysql = require('mysql');
    const app = express();
    const http = require('http');
    const qs = require('querystring');
    const dateFormat = require('date-format');
    const bearerToken = require('express-bearer-token');
    const pwd = require('./assets/json/pwd.json').pwd_organify;
    const host = "organify.debrej.fr";
    const bcrypt = require("bcrypt-nodejs");
    const salt = require("./assets/json/salt.json").salt;

    const default_profile_pic_url = 'assets/img/user.svg';

    app.use('/assets', express.static('assets'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(bodyParser.json() );
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bearerToken());

    app.use(function(req, res, next){
        let log = "["+dateFormat(new Date(), "yyyy-mm-dd h:MM:ss")+"] : "+req.method+" "+host+req.originalUrl+" FROM "+req.ip+"\n";
        fs.appendFile("server.log", log, (err) => {
            if (err) throw err;
            console.log(log);
        });
        next();
    });

    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'organify',
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

    let params = {
        "duration_shift" : 1,
        "duration_subshift": 15
    };

    let date_format = "'%d-%m-%Y %H:%i:%s'";

    params.duration_shift = parseInt(process.env.npm_package_config_shift_duration) || 1;
    params.duration_subshift = parseInt(process.env.npm_package_config_subshift_duration) || 15;

//endregion

//region FUNCTIONS

    function addShiftDuration(start_date){

        let start_year = parseInt(start_date.slice(0,4));
        let start_month = parseInt(start_date.slice(5,7));
        let start_day = parseInt(start_date.slice(8,10));

        let start_hour = parseInt(start_date.slice(11,13));
        let start_minute = parseInt(start_date.slice(14,16));

        month_duration.month[3].duration = (start_year%4 === 0 && start_year%100 !== 0) || (start_year%400 === 0) ? 29 : 28;

        let end_hour = start_hour + params.duration_shift >= 24 ? ((start_hour + params.duration_shift)%24 < 10 ? "0" + String(start_hour + params.duration_shift)%24 : String(start_hour + params.duration_shift)%24) : (start_hour + params.duration_shift < 10 ? "0" + String(start_hour + params.duration_shift) : String(start_hour + params.duration_shift));
        let end_day = start_day;
        let end_month = start_month < 10 ? "0" + String(start_month + 1) : String(start_month + 1);
        let end_year = start_year;
        let end_minute = start_minute < 10 ? "0" + String(start_minute) : String(start_minute);

        if(start_hour + params.duration_shift >= 24){
            if(start_day + 1 > month_duration.month[start_month - 1].duration){
                end_day = "01";
                end_month = start_month + 1 > 12 ? "0" + String(1) : ((start_month + 1) < 10 ? "0" + String(start_month + 1) : String(start_month + 1));
                end_year = start_month + 1 > 12 ? start_year + 1 : start_year;
            }
        }

        return {
            "start_date": sprintf("%s-%s-%s %s:%s", start_year, start_month, start_day, start_hour, start_minute),
            "end_date": sprintf("%s-%s-%s %s:%s", end_year, end_month, end_day, end_hour, end_minute)
        };
    }

    function addSubShiftDuration(start_date){

        let start_year = parseInt(start_date.slice(0,4));
        let start_month = parseInt(start_date.slice(5,7));
        let start_day = parseInt(start_date.slice(8,10));

        let start_hour = parseInt(start_date.slice(11,13));
        let start_minute = parseInt(start_date.slice(14,16));

        month_duration.month[3].duration = (start_year%4 === 0 && start_year%100 !== 0) || (start_year%400 === 0) ? 29 : 28;

        let end_minute = start_minute + params.duration_subshift >= 60 ? ((start_minute + params.duration_subshift)%60 < 10 ? "0" + String((start_minute + params.duration_subshift)%60) : String((start_minute + params.duration_subshift)%60)) : ((start_minute + params.duration_subshift) < 10 ? "0" + String((start_minute + params.duration_subshift)) : String((start_minute + params.duration_subshift)));
        let end_hour;
        let end_day;
        let end_month;
        let end_year;

        if (start_minute + params.duration_subshift >= 60) {
            if(start_hour + 1 >= 24){
                if((start_hour + 1)%24 < 10){
                    end_hour = "0" + String((start_hour + 1)%24);
                }
                else{
                    end_hour = String(start_hour + 1)%24;
                }
                if(start_day + 1 > month_duration.month[start_month - 1].duration){
                    end_day = "01";
                    end_month = start_month + 1 > 12 ? "0" + String(1) : ((start_month + 1) < 10 ? "0" + String(start_month + 1) : String(start_month + 1));
                    end_year = start_month + 1 > 12 ? start_year + 1 : start_year;
                }
            }
            else if ((start_hour + 1) < 10){
                end_hour = "0" + String(start_hour + 1);
                end_day = start_day < 10 ? "0" + String(start_day) : String(start_day);
                end_month = start_month < 10 ? "0" + String(start_month) : String(start_month);
                end_year = start_year;
            }
            else{
                end_hour = String(start_hour + 1);
                end_day = start_day < 10 ? "0" + String(start_day) : String(start_day);
                end_month = start_month < 10 ? "0" + String(start_month) : String(start_month);
                end_year = start_year;
            }
        }
        else{
            end_hour = start_hour < 10 ? "0" + String(start_hour) : String(start_hour);
            end_day = start_day < 10 ? "0" + String(start_day) : String(start_day);
            end_month = start_month < 10 ? "0" + String(start_month) : String(start_month);
            end_year = start_year;
        }

        return {
            "start_date": sprintf("%s-%s-%s %s:%s", start_year, start_month, start_day, start_hour, start_minute),
            "end_date": sprintf("%s-%s-%s %s:%s", end_year, end_month, end_day, end_hour, end_minute)
        };
    }

    function subshiftFromShift(start_date, idShift){
        let nbShift = (parseInt(params.duration_shift)*60)/parseInt(params.duration_subshift);
        let subshifts = '';
        let current_start = start_date;
        let current_end = addSubShiftDuration(current_start).end_date;
        for(let i = 0; i < nbShift; i++){
            subshifts += sprintf('(\'%s\',\'%s\',%d),', current_start, current_end, idShift);
            current_start = current_end;
            current_end = addSubShiftDuration(current_start).end_date;
        }
        return subshifts.slice(0, -1);
    }

    function registerUser(mail, pwd){
        var options = {
            'method': 'POST',
            'port': 4524,
            'hostname': 'localhost',
            'path': '/register_user',
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        var req = http.request(options, function (res) {
            var chunks = [];
            res.on("data", function (chunk) {
                chunks.push(chunk);
            });
            res.on("end", function (chunk) {
                var body = Buffer.concat(chunks);
            });
            res.on("error", function (error) {
                console.error(error);
            });
        });

        var postData = qs.stringify({
            'mail': mail,
            'pwd': pwd
        });

        req.write(postData);

        req.end();
    }

    function escapeChars(str){
        str = str.replace(/[\\$'"]/g, "\\$&");
        return str;
    }

    function undefinedParameters(params){
        let str = "";
        for(let element in params){
            if(params.hasOwnProperty(element)){
                if (params[element] === "undefined" || params[element] === undefined){
                    str+= element + ", ";
                }
            }
        }
        return str === "" ? str : str.slice(0,-2);
    }

    function auth(req, res, next){
        let token = req.token;
        let request = sprintf(sql_requests.validate_token, token);
        connection.query(request,function(err, rows, fields) {
            if (err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
            {
                if(rows[0] === undefined){
                    res.send({'status': 401, 'error': errors.error_401.token});
                }
                else {
                    let accept = req.token === rows[0].token;
                    if(accept) {
                        next();
                    }
                    else {
                        res.send({'status': 401, 'error': errors.error_401.token});
                    }
                }
            }
        });
    }

    function maybe(fn) {
        return function(req, res, next) {
            if (req.path === '/orga' && req.method === 'POST') {
                next();
            } else {
                fn(req, res, next);
            }
        }
    }

    app.use(maybe(auth));

//endregion

//region QUERY GET REQUESTS

    app.get("/test_req", function(req, res){
        res.send(req.body)
    });

    //region GET TABLES ALL DATA
    app.get("/orga", function(req, res){
        connection.query(sql_requests.get_orga, function(err, rows, fields) {
            if (err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
            else{
                res.send({'orga' : rows, 'status': 0});
            }
        });
    });

    app.get("/task", function(req, res){
        //region REQUEST BODY
        connection.query(sql_requests.get_task, function(err, rows, fields) {
            if (err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
            else{
                res.send({'task' : rows, 'status': 0});
            }
        });
        //endregion
    });

    app.get("/shift", function(req, res){
        connection.query(sql_requests.get_shift, function(err, rows, fields) {
            if (err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
            else{
                res.send({'shift' : rows, 'status': 0});
            }
        });
    });

    app.get("/subshift", function(req, res){
        connection.query(sql_requests.get_subshift, function(err, rows, fields) {
            if (err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
            else {
                res.send({'subshift' : rows, 'status': 0});
            }
        });
    });

    app.get("/shift_orga", function(req, res){
        connection.query(sql_requests.get_shift_orga, function(err, rows, fields) {
            if (err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
            else{
                res.send({'shift' : rows, 'status': 0});
            }
        });
    });

    app.get("/shift_task", function(req, res){
        connection.query(sql_requests.get_shift_task, function(err, rows, fields) {
            if (err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
            else{
                res.send({'subshift' : rows, 'status': 0});
            }
        });
    });
    //endregion

    //region GET DATA WITH idOrga
    app.get("/shift_by_orga",function(req, res){
        //region PARAMETERS CHECK
        let params = [];
        params["idOrga"] = req.body.idOrga;
        let undefParams = undefinedParameters(params);
        if(undefParams !== ""){
            res.send({'status': 5, 'error': errors.error_5 + undefParams});
        }
        //endregion
        //region REQUEST BODY
        else{
            let request = sql_requests.get_shift_by_orga + params["idOrga"];
            connection.query(request, function(err, rows, fields) {
                if (err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
                else{
                    res.send({'shift' : rows, 'status': 0});
                }
            });
        }
        //endregion
    });

    app.get("/task_by_orga",function(req, res){
        //region PARAMETERS CHECK
        let params = [];
        params["idOrga"]= req.body.idOrga;
        let undefParams = undefinedParameters(params);
        if(undefParams !== ""){
            res.send({'status': 5, 'error': errors.error_5 + undefParams});
        }
        //endregion
        //region REQUEST BODY
        else{
            let request = sprintf(sql_requests.get_task_by_orga, params["idOrga"]);
            connection.query(request, function(err, rows, fields) {
                if (err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
                else{
                    res.send({'task' : rows, 'status': 0});
                }
            });
        }
        //endregion
    });

    app.get("/orga_task",function(req, res){
        //region PARAMETERS CHECK
        let params = [];
        params["idOrga"] = req.body.idOrga;
        let undefParams = undefinedParameters(params);
        if(undefParams !== ""){
            res.send({'status': 5, 'error': errors.error_5 + undefParams});
        }
        //endregion
        //region REQUEST BODY
        else{
            let request = sprintf(sql_requests.get_orga_details, params["idOrga"]);
            connection.query(request, function(err, rows, fields) {
                if (err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
                else{
                    let details_orga = rows[0];
                    let request = sprintf(sql_requests.get_task_by_orga, params["idOrga"]);
                    connection.query(request, function(err, rows, fields) {
                        if (err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
                        else{
                            res.send({'orga': details_orga, 'task': rows, 'status': 0});
                        }
                    });
                }
            });
        }
        //endregion
    });

    app.get("/orga_shift",function(req, res){
            //region PARAMETERS CHECK
            let params = [];
            params["idOrga"] = req.body.idOrga;
            let undefParams = undefinedParameters(params);
            if(undefParams !== ""){
                res.send({'status': 5, 'error': errors.error_5 + undefParams});
            }
            //endregion
            //region REQUEST BODY
            else{
                let request = sprintf(sql_requests.get_orga_details, params["idOrga"]);
                connection.query(request, function(err, rows, fields) {
                    if (err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
                    else{
                        let details_orga = rows[0];
                        let request = sql_requests.get_shift_by_orga + params["idOrga"];
                        connection.query(request, function(err, rows, fields) {
                            if (err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
                            else{
                                res.send({'orga': details_orga, 'shift': rows, 'status': 0});
                            }
                        });
                    }
                });
            }
    });

    app.get("/orga_details",function(req, res){
            //region PARAMETERS CHECK
            let params = [];
            params["idOrga"] = req.body.idOrga;
            let undefParams = undefinedParameters(params);
            if(undefParams !== ""){
                res.send({'status': 5, 'error': errors.error_5 + undefParams});
            }
            //endregion
            //region REQUEST BODY
            else{
                let request = sprintf(sql_requests.get_orga_details, params["idOrga"]);
                connection.query(request, function(err, rows, fields) {
                    if (err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
                    else{
                        res.send({'orga': rows[0], 'status': 0});
                    }
                });
            }
    });

    app.get("/task_by_resp_orga", function(req, res){
            //region PARAMETERS CHECK
            let params = [];
            params["idOrga"] = req.body.idOrga;
            let undefParams = undefinedParameters(params);
            if(undefParams !== ""){
                res.send({'status': 5, 'error': errors.error_5 + undefParams});
            }
            //endregion
            //region REQUEST BODY
            else{
                let request = sprintf(sql_requests.get_task_by_resp_orga, params["idOrga"]);
                connection.query(request, function(err, rows, fields) {
                    if (err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
                    else{
                        res.send({'task': rows, 'status': 0});
                    }
                });
            }
    });

    app.get("/assigned_task_by_orga",function(req, res){
            //region PARAMETERS CHECK
            let params = [];
            params["idOrga"] = req.body.idOrga;
            let undefParams = undefinedParameters(params);
            if(undefParams !== ""){
                res.send({'status': 5, 'error': errors.error_5 + undefParams});
            }
            //endregion
            //region REQUEST BODY
            else{
                let request = sprintf(sql_requests.get_task_assigned_by_orga, params["idOrga"]);
                connection.query(request, function(err, rows, fields){
                    if(err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
                    else{
                        res.send({'tasks': rows, 'status': 0});
                    }
                });
            }
    });
    //endregion

    //region GET DATA WITH idTask
    app.get("/task_details", function(req, res){
            //region PARAMETERS CHECK
            let params = [];
            params["idTask"] = req.body.idTask;
            let undefParams = undefinedParameters(params);
            if(undefParams !== ""){
                res.send({'status': 5, 'error': errors.error_5 + undefParams});
            }
            //endregion
            //region REQUEST BODY
            else{
                let request = sprintf(sql_requests.get_task_details, params["idTask"]);
                connection.query(request, function(err, rows, fields) {
                    if (err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
                    else{
                        res.send({'task' : rows[0], 'status': 0});
                    }
                });
            }
    });

    app.get("/shift_by_task",function(req, res){
            //region PARAMETERS CHECK
            let params = [];
            params["idTask"] = req.body.idTask;
            let undefParams = undefinedParameters(params);
            if(undefParams !== ""){
                res.send({'status': 5, 'error': errors.error_5 + undefParams});
            }
            //endregion
            //region REQUEST BODY
            else{
                let request = sql_requests.get_subshift_by_task + params["idTask"];
                connection.query(request, function(err, rows, fields) {
                    if (err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
                    else{
                        res.send({'subshift' : rows, 'status': 0});
                    }
                });
            }
    });

    app.get("/orga_assigned_by_task", function(req, res){
            //region PARAMETERS CHECK
            let params = [];
            params["idTask"] = req.body.idTask;
            let undefParams = undefinedParameters(params);
            if(undefParams !== ""){
                res.send({'status': 5, 'error': errors.error_5 + undefParams});
            }
            //endregion
            //region REQUEST BODY
            else{

                let request = sprintf(sql_requests.get_orga_assigned_by_task, params["idTask"]);
                connection.query(request, function(err, rows, fields) {
                    if (err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
                    else{
                        res.send({'orga' : rows, 'status': 0});
                    }
                });
            }
    });
    //endregion

    //region GET DATA WITH idShift
    app.get("/orga_by_shift",function(req, res){
            //region PARAMETERS CHECK
            let params = [];
            params["idShift"] = req.body.idShift;
            let undefParams = undefinedParameters(params);
            if(undefParams !== ""){
                res.send({'status': 5, 'error': errors.error_5 + undefParams});
            }
            //endregion
            //region REQUEST BODY
            else{
                let request = sprintf(sql_requests.get_orga_by_shift, params["idShift"]);
                connection.query(request, function(err, rows, fields) {
                    if (err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
                    else{
                        res.send({'orga' : rows, 'status': 0});
                    }
                });
            }
    });

    app.get("/task_by_shift",function(req, res){
            //region PARAMETERS CHECK
            let params = [];
            params["idShift"] = req.body.idShift;
            let undefParams = undefinedParameters(params);
            if(undefParams !== ""){
                res.send({'status': 5, 'error': errors.error_5 + undefParams});
            }
            //endregion
            //region REQUEST BODY
            else{
                let request = sprintf(sql_requests.get_task_by_shift, params["idShift"]);
                connection.query(request, function(err, rows, fields) {
                    if (err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
                    else{
                        res.send({'task' : rows, 'status': 0});
                    }
                });
            }
    });

    app.get("/subshift_by_shift",function(req, res){
            //region PARAMETERS CHECK
            let params = [];
            params["idShift"] = req.body.idShift;
            let undefParams = undefinedParameters(params);
            if(undefParams !== ""){
                res.send({'status': 5, 'error': errors.error_5 + undefParams});
            }
            //endregion
            //region REQUEST BODY
            else{
                let request = sprintf(sql_requests.get_subshift_by_shift, date_format, date_format, parseInt(params["idShift"]));
                connection.query(request, function(err, rows, fields) {
                    if (err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
                    else{
                        res.send({'subshift' : rows, 'status': 0});
                    }
                });
            }
    });
    //endregion

    //region GET DATA WITH idSubShift
    app.get("/orga_by_subshift",function(req, res){
            //endregion
            let params = [];
            params["idSubShift"] = req.body.idSubShift;
            let undefParams = undefinedParameters(params);
            if(undefParams !== ""){
                res.send({'status': 5, 'error': errors.error_5 + undefParams});
            }
            //region PARAMETERS CHECK
            //region REQUEST BODY
            else{
                let request = sprintf(sql_requests.get_orga_by_subshift, params["idSubShift"]);
                connection.query(request, function(err, rows, fields) {
                    if (err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
                    else {
                        res.send({'orga': rows, 'status': 0});
                    }
                });
            }
    });

    app.get("/task_by_subshift",function(req, res){
            //region PARAMETERS CHECK
            let params = [];
            params["idSubShift"] = req.body.idSubShift;
            let undefParams = undefinedParameters(params);
            if(undefParams !== ""){
                res.send({'status': 5, 'error': errors.error_5 + undefParams});
            }
            //endregion
            //region REQUEST BODY
            else{
                let request = sprintf(sql_requests.get_task_by_subshift, params["idSubShift"]);
                connection.query(request, function(err, rows, fields) {
                    if (err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
                    res.send({'task' : rows, 'status': 0});
                });
            }
    });
    //endregion

//endregion

//region QUERY CREATE REQUESTS

    app.post("/orga", function(req, res){
            //region PARAMETERS CHECK
            let params = [];
            params["last_name"] = req.body.last_name;
            params["first_name"] = req.body.first_name;
            params["mail"] = req.body.mail;
            params["pwd"] = req.body.pwd;
            let undefParams = undefinedParameters(params);
            if(undefParams !== ""){
                res.send({'status': 5, 'error': errors.error_5 + undefParams});
            }
            //endregion
            //region REQUEST BODY
            else{
                let request = sprintf(sql_requests.count_orga_by_mail, params["mail"]);
                connection.query(request, function(err, rows, field){
                    if(err) res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});
                    else{
                        let count = parseInt(rows[0].num);
                        if(count !== 0){
                            res.send({'status': 3, 'error': errors.error_3})
                        }
                        else{
                            let request = sprintf(sql_requests.create_orga, params["first_name"], params["last_name"], params["mail"], default_profile_pic_url);
                            connection.query(request, function(err, rows, fields){
                                if (err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
                                else{
                                    let insertId = rows['insertId'];
                                    let request = sprintf(sql_requests.get_orga_details, insertId);
                                    connection.query(request, function(err, rows, fields){
                                        if (err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
                                        else{
                                            bcrypt.hash(req.body.pwd, salt, null, function(err,pwd) {
                                                registerUser(params["mail"], pwd);
                                                res.send({'orga': rows[0], 'status': 0});
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }
            //endregion
    });

    app.post("/assign_shift_orga", function(req, res){
            //region PARAMETERS CHECK
            let params = [];
            params["idOrga"] = req.body.idOrga;
            params["shifts"] = JSON.parse(req.body.shifts).shifts;
            let undefParams = undefinedParameters(params);
            if(undefParams !== ""){
                res.send({'status': 5, 'error': errors.error_5 + undefParams});
            }
            //endregion
            //region REQUEST BODY
            else{
                let shifts_string = "";

                for(let i = 0; i<params["shifts"].length; i++){
                    shifts_string += "("+params["shifts"][i]+","+params["idOrga"]+"),";
                }
                shifts_string = shifts_string.slice(0, -1);

                let request = sprintf(sql_requests.assign_orga_shift, shifts_string);
                connection.query(request, function(err, rows, fields){
                    if (err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
                    else{
                        res.send({'shifts': params["shifts"], 'idOrga': params["idOrga"], 'status': 0});
                    }
                });
            }
    });

    app.post("/task", function(req, res){
            //region PARAMETERS CHECK
            let params = [];
            params["name"] = escapeChars(req.body.name);
            params["description"] = escapeChars(req.body.description);
            params["start_date"] = req.body.start_date;
            params["end_date"] = req.body.end_date;
            params["idOrga"] = req.body.idOrga;
            let undefParams = undefinedParameters(params);
            if(undefParams !== ""){
                res.send({'status': 5, 'error': errors.error_5 + undefParams});
            }
            //endregion
            //region REQUEST BODY
            else{
                let requestTask = sprintf(sql_requests.create_task, params["name"], params["description"], params["idOrga"]);
                connection.query(requestTask, function(err, rows, field){
                    if (err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
                    else{
                        let idTask = rows['insertId'];
                        let request = sprintf(sql_requests.get_subshift_between_dates, date_format, date_format, params["start_date"], params["end_date"]);
                        connection.query(request, function(err, rows, fields){
                            if (err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
                            else{
                                if(rows.length === 0){
                                    res.send({'status': 4, 'error': errors.error_4, 'SQL_message': err});
                                }
                                else {
                                    let subshift = "";
                                    for (let i = 0; i < rows.length; i++) {
                                        subshift += "(" + rows[i].idSubShift + "," + idTask + "),";
                                    }
                                    subshift = subshift.slice(0, -1);
                                    let requestSubshift = sprintf(sql_requests.assign_task_subshift, subshift);
                                    connection.query(requestSubshift, function(err, rows, fields){
                                        if (err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
                                        else{
                                            let request = sprintf(sql_requests.get_task_details, idTask);
                                            connection.query(request, function(err, rows, fields){
                                                if (err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
                                                else{
                                                    let task = rows[0];
                                                    let request = sql_requests.get_subshift_by_task + idTask;
                                                    connection.query(request, function(err, rows, fields){
                                                        if (err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
                                                        else{
                                                            res.send({'task': task, 'subshift': rows, 'status': 0});
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    }
                });

            }
    });

    app.post("/shift", function(req, res){
            //region PARAMETERS CHECK
            let params = [];
            params["start_date"] = req.body.start_date;

            let undefParams = undefinedParameters(params);
            if(undefParams !== ""){
                res.send({'status': 5, 'error': errors.error_5 + undefParams});
            }
            //endregion
            //region REQUEST BODY
            else{
                let dates = addShiftDuration(params["start_date"]);
                let request = sprintf(sql_requests.create_shift, dates.start_date, dates.end_date);
                connection.query(request, function(err, rows, field){
                    if (err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
                    else{
                        let insertId = rows['insertId'];
                        let subshifts = subshiftFromShift(params["start_date"], insertId);
                        let request = sprintf(sql_requests.get_shift_details, date_format, date_format, insertId);
                        connection.query(request, function(err, rows, field){
                            if (err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
                            else{
                                let shift = rows[0];
                                let request = sprintf(sql_requests.create_subshift, subshifts);
                                connection.query(request, function(err, rows, field){
                                    if (err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
                                    else{
                                        let request = sprintf(sql_requests.get_subshift_by_shift, date_format, date_format, insertId);
                                        connection.query(request, function(err, rows, field){
                                            if (err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
                                            else{
                                                res.send({"shift" : shift, "subshift": rows, "status" : 0});
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
    });

    app.post("/assign_task_orga", function(req, res){
            //region PARAMETERS CHECK
            let params = [];
            params["idOrga"] = req.body.idOrga;
            params["idTask"] = req.body.idTask;

            let undefParams = undefinedParameters(params);
            if(undefParams !== ""){
                res.send({'status': 5, 'error': errors.error_5 + undefParams});
            }
            //endregion
            //region REQUEST BODY
            else{
                let request = sprintf(sql_requests.assign_task_orga, params["idOrga"], params["idTask"]);
                connection.query(request, function(err, rows, field){
                    if (err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
                    else{
                        let request = sprintf(sql_requests.get_orga_details, params["idOrga"]);
                        connection.query(request, function(err, rows, field){
                            if (err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
                            else{
                                let orga = rows[0];
                                let request = sprintf(sql_requests.get_task_details, params["idTask"]);
                                connection.query(request, function(err, rows, field) {
                                    if (err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
                                    else{
                                        let task = rows[0];
                                        res.send({'orga': orga, 'task': task, 'status': 0});
                                    }
                                });
                            }
                        });
                    }
                });
            }
    });

    app.post("/shifts", function(req, res){
        //TODO create multiple shifts
        res.send({'status': 6, 'error': errors.error_6});
    });

//endregion

//region QUERY UPDATE REQUESTS

//endregion

//region QUERY DELETE REQUESTS

    app.delete('/shift', function(req, res){
            //region PARAMETERS CHECK
            let params = [];
            params["idShift"] = req.body.idShift;
            params["delete_task"] = parseInt(req.body.delete_task);
            let undefParams = undefinedParameters(params);
            if(undefParams !== ""){
                res.send({'status': 5, 'error': errors.error_5 + undefParams});
            }
            //endregion
            //region REQUEST BODY
            else{
                if(params["delete_task"] === 1){
                    let request = sprintf(sql_requests.get_subshift_by_shift, date_format, date_format, params["idShift"]);
                    connection.query(request, function(err, rows, field){
                        if (err) res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});
                        let subshifts = "(";
                        for (let i = 0; i<rows.length; i++){
                            subshifts += sprintf("%d,", rows[i].idSubShift);
                        }
                        subshifts = subshifts.slice(0, -1) + ")";
                        let request = sprintf(sql_requests.get_task_in_subshift, subshifts);
                        connection.query(request, function(err, rows, field){
                            if (err) res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});
                            let tasks = "(";
                            for (let i = 0; i<rows.length; i++){
                                tasks += sprintf("%d,", rows[i].idTask);
                            }
                            tasks = tasks.slice(0, -1) + ")";
                            let request = sprintf(sql_requests.delete_tasks, tasks);
                            connection.query(request, function(err, rows, field){
                                if (err) res.send({"status": 0});
                                let request = sprintf(sql_requests.delete_shift, params["idShift"]);
                                connection.query(request, function(err, rows, field){
                                    if (err) res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});
                                    else{
                                        let request = sprintf(sql_requests.delete_subshift, params["idShift"]);
                                        connection.query(request, function(err, rows, field){
                                            if (err) res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});
                                            res.send({'status': 0});
                                        });
                                    }
                                });
                            });
                        });
                    });
                }
                else {
                    let request = sprintf(sql_requests.delete_shift, params["idShift"]);
                    connection.query(request, function (err, rows, field) {
                        if (err) res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});
                        else {
                            let request = sprintf(sql_requests.delete_subshift, params["idShift"]);
                            connection.query(request, function (err, rows, field) {
                                if (err) res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});
                                res.send({'status': 0});
                            });
                        }
                    });
                }
            }
    });

    app.delete('/orga', function(req, res){
            //region PARAMETERS CHECK
            let params = [];
            params["idOrga"] = req.body.idOrga;
            params["delete_task"] = parseInt(req.body.delete_tasks);
            let undefParams = undefinedParameters(params);
            if(undefParams !== ""){
                res.send({'status': 5, 'error': errors.error_5 + undefParams});
            }
            //endregion
            //region REQUEST BODY
            else{
                if (params["delete_task"] === 1){
                    let request = sprintf(sql_requests.delete_orga_tasks, params["idOrga"]);
                    connection.query(request, function(err, rows, field){
                        if (err) res.send({'status': 0, 'err': err});
                        else {
                            let request = sprintf(sql_requests.delete_orga, params["idOrga"]);
                            connection.query(request, function (err, rows, field) {
                                if (err) res.send({'status': 0, 'err': err});
                                else {
                                    res.send({'status': 0});
                                }
                            });
                        }
                    });
                }
                else{
                    let request = sprintf(sql_requests.delete_orga, params["idOrga"]);
                    connection.query(request, function(err, rows, field){
                        if (err) res.send({'status': 0, 'err': err});
                        else{
                            res.send({'status': 0});
                        }
                    });
                }
            }
    });

    app.delete('/task', function(req, res){
            //region PARAMETERS CHECK
            let params = [];
            params["idTask"] = req.body.idTask;
            let undefParams = undefinedParameters(params);
            if(undefParams !== ""){
                res.send({'status': 5, 'error': errors.error_5 + undefParams});
            }
            //endregion
            //region REQUEST BODY
            else{
                let request = sprintf(sql_requests.delete_task, params["idTask"]);
                connection.query(request, function(err, rows, field){
                    if (err) res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});
                    else{
                        res.send({'status': 0});
                    }
                });
            }
    });

    app.delete('/task_shift', function(req, res){
            //region PARAMETERS CHECK
            let params = [];
            params["idTask"] = req.body.idTask;
            params["idSubShift"] = req.body.idSubShift;
            let undefParams = undefinedParameters(params);
            if(undefParams !== ""){
                res.send({'status': 5, 'error': errors.error_5 + undefParams});
            }
            //endregion
            //region REQUEST BODY
            else{
                let request = sprintf(sql_requests.delete_task_shift, params["idTask"], params["idSubShift"]);
                connection.query(request, function(err, rows, fields){
                    if(err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
                    else{
                        res.send({'status': 0});
                    }
                });
            }
    });

    app.delete('/task_orga', function(req, res){
            //region PARAMETERS CHECK
            let params = [];
            params["idTask"] = req.body.idTask;
            params["idOrga"] = req.body.idOrga;
            let undefParams = undefinedParameters(params);
            if(undefParams !== ""){
                res.send({'status': 5, 'error': errors.error_5 + undefParams});
            }
            //endregion
            //region REQUEST BODY
            else{
                let request = sprintf(sql_requests.delete_task_orga, params["idTask"], params["idOrga"]);
                connection.query(request, function(err, rows, fields){
                    if(err) {res.send({'status': 1, 'error': errors.error_1, 'SQL_message': err});}
                    else{
                        res.send({'status': 0});
                    }
                });
            }
    });

//endregion

//region DEFAULT ROUTE
app.use(function(req, res){
    res.send(404);
});
//endregion

//region LISTEN

app.listen(2445, function(){
    console.log("resource server listening on port 2445");
});

//endregion