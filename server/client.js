//region INITIALIZATION
const express = require('express');
const bodyParser = require('body-parser');
const bearerToken = require('express-bearer-token');
const helmet = require("helmet");

const dateFormat = require('date-format');
const fs = require('fs');
const cors = require('cors');
const bcrypt = require("bcrypt-nodejs");
const https = require('https');
const request = require("request");

const errors = require("./assets/json/error_messages.json");
const host = "organify.debrej.fr";
const salt = require("./assets/json/salt.json").salt;

const app = express();

app.use('/assets', express.static('assets'));
app.use(express.json());
app.use(express.urlencoded());
app.use(bodyParser.json() );
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bearerToken());
app.use(helmet());
app.use(cors());

app.use(function(req, res, next){
    let log = "["+dateFormat(new Date(), "yyyy-mm-dd h:MM:ss")+"] : "+req.method+" "+host+req.originalUrl+" FROM "+req.ip+"\n";
    fs.appendFile("client.log", log, (err) => {
        if (err) throw err;
        console.log(log);
    });
    next();
});

//endregion

//region PAGE RENDER GET REQUESTS

app.get("/", function(req, res){
    res.render("index.ejs")
});

app.get("/board", function(req, res){
    res.render("board.ejs")
});

app.get("/dispos", function(req, res){
    res.render("dispos.ejs")
});

app.get("/taches", function(req, res){
    res.render("taches.ejs")
});

app.get("/affect", function(req, res){
    res.render("affect.ejs")
});

//endregion

//region QUERY GET REQUESTS

//region GET TABLES ALL DATA
app.get("/orga/all", function(req, res){
    let options = {
        method: 'GET',
        url: 'http://127.0.0.1:2445/orga',
        headers:
            {
                'Postman-Token': '3cca8e0a-0ec5-465e-aff4-b8dbc6816ef8',
                'cache-control': 'no-cache',
                Authorization: 'Bearer ' + req.token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        form: {undefined: undefined}
    };

    request(options, function (error, response, body) {
        res.type('json');
        if (error) res.send({'status': 1000, 'error': errors.error_1000, 'error_message': body});
        else{res.send(body);}
    });

});

app.get("/task/all", function(req, res){
    let options = {
        method: 'GET',
        url: 'http://127.0.0.1:2445/task',
        headers:
            {
                'Postman-Token': '3cca8e0a-0ec5-465e-aff4-b8dbc6816ef8',
                'cache-control': 'no-cache',
                Authorization: 'Bearer '+req.token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        form: {undefined: undefined}
    };

    request(options, function (error, response, body) {
        res.type('json');
        if (error) res.send({'status': 1000, 'error': errors.error_1000, 'error_message': body});
        else{res.send(body);}
    });
});

app.get("/shift/all", function(req, res){
    let options = {
        method: 'GET',
        url: 'http://127.0.0.1:2445/shift',
        headers:
            {
                'Postman-Token': '3cca8e0a-0ec5-465e-aff4-b8dbc6816ef8',
                'cache-control': 'no-cache',
                Authorization: 'Bearer '+req.token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        form: {undefined: undefined}
    };

    request(options, function (error, response, body) {
        res.type('json');
        if (error) res.send({'status': 1000, 'error': errors.error_1000, 'error_message': body});
        else{res.send(body);}
    });
});

app.get("/subshift/all", function(req, res){
    let options = {
        method: 'GET',
        url: 'http://127.0.0.1:2445/subshift',
        headers:
            {
                'Postman-Token': '3cca8e0a-0ec5-465e-aff4-b8dbc6816ef8',
                'cache-control': 'no-cache',
                Authorization: 'Bearer '+req.token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        form: {undefined: undefined}
    };

    request(options, function (error, response, body) {
        res.type('json');
        if (error) res.send({'status': 1000, 'error': errors.error_1000, 'error_message': body});
        else{res.send(body);}
    });
});

app.get("/shift_orga/all", function(req, res){
    let options = {
        method: 'GET',
        url: 'http://127.0.0.1:2445/shift_orga',
        headers:
            {
                'Postman-Token': '3cca8e0a-0ec5-465e-aff4-b8dbc6816ef8',
                'cache-control': 'no-cache',
                Authorization: 'Bearer '+req.token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        form: {undefined: undefined}
    };

    request(options, function (error, response, body) {
        res.type('json');
        if (error) res.send({'status': 1000, 'error': errors.error_1000, 'error_message': body});
        else{res.send(body);}
    });
});

app.get("/shift_task/all", function(req, res){
    let options = {
        method: 'GET',
        url: 'http://127.0.0.1:2445/shift_task',
        headers:
            {
                'Postman-Token': '3cca8e0a-0ec5-465e-aff4-b8dbc6816ef8',
                'cache-control': 'no-cache',
                Authorization: 'Bearer '+req.token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        form: {undefined: undefined}
    };

    request(options, function (error, response, body) {
        res.type('json');
        if (error) res.send({'status': 1000, 'error': errors.error_1000, 'error_message': body});
        else{res.send(body);}
    });
});
//endregion

//region GET DATA WITH idOrga

// @deprecated as /orga/shift/:idOrga is better
app.get("/shift_by_orga/:idOrga",function(req, res){
    let options = {
        method: 'GET',
        url: 'http://127.0.0.1:2445/shift_by_orga',
        headers:
            {
                'Postman-Token': '3cca8e0a-0ec5-465e-aff4-b8dbc6816ef8',
                'cache-control': 'no-cache',
                Authorization: 'Bearer '+req.token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        form: { idOrga: req.params.idOrga }
    };

    request(options, function (error, response, body) {
        res.type('json');
        if (error) res.send({'status': 1000, 'error': errors.error_1000, 'error_message': body});
        res.send({'status': 1001, 'error': errors.error_1001 + "/orga/shift/:idOrga"});
    });
});

// @deprecated as /orga/task/available/:idOrga is better
app.get("/task_by_orga/:idOrga",function(req, res){
    let options = {
        method: 'GET',
        url: 'http://127.0.0.1:2445/task_by_orga',
        headers:
            {
                'Postman-Token': '3cca8e0a-0ec5-465e-aff4-b8dbc6816ef8',
                'cache-control': 'no-cache',
                Authorization: 'Bearer '+req.token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        form: { idOrga: req.params.idOrga }
    };

    request(options, function (error, response, body) {
        res.type('json');
        if (error) res.send({'status': 1000, 'error': errors.error_1000, 'error_message': body});
        res.send({'status': 1001, 'error': errors.error_1001 + "/orga/task/available/:idOrga"});
    });
});

app.get("/orga/task/available/:idOrga",function(req, res){
    let options = {
        method: 'GET',
        url: 'http://127.0.0.1:2445/orga_task',
        headers:
            {
                'Postman-Token': '3cca8e0a-0ec5-465e-aff4-b8dbc6816ef8',
                'cache-control': 'no-cache',
                Authorization: 'Bearer '+req.token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        form: { idOrga: req.params.idOrga }
    };

    request(options, function (error, response, body) {
        res.type('json');
        if (error) res.send({'status': 1000, 'error': errors.error_1000, 'error_message': body});
        else{
            res.send(body);
        }
    });
});

app.get("/orga/shift/:idOrga",function(req, res){
    let options = {
        method: 'GET',
        url: 'http://127.0.0.1:2445/orga_shift',
        headers:
            {
                'Postman-Token': '3cca8e0a-0ec5-465e-aff4-b8dbc6816ef8',
                'cache-control': 'no-cache',
                Authorization: 'Bearer '+req.token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        form: { idOrga: req.params.idOrga }
    };

    request(options, function (error, response, body) {
        res.type('json');
        if (error) res.send({'status': 1000, 'error': errors.error_1000, 'error_message': body});
        else{res.send(body);}
    });
});

app.get("/orga/:idOrga",function(req, res){
    let options = {
        method: 'GET',
        url: 'http://127.0.0.1:2445/orga_details',
        headers:
            {
                'Postman-Token': '3cca8e0a-0ec5-465e-aff4-b8dbc6816ef8',
                'cache-control': 'no-cache',
                Authorization: 'Bearer '+req.token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        form: { idOrga: req.params.idOrga }
    };

    request(options, function (error, response, body) {
        res.type('json');
        if (error) res.send({'status': 1000, 'error': errors.error_1000, 'error_message': body});
        else{res.send(body);}
    });
});

app.get("/orga/task/resp/:idOrga", function(req, res){
    let options = {
        method: 'GET',
        url: 'http://127.0.0.1:2445/task_by_resp_orga',
        headers:
            {
                'Postman-Token': '3cca8e0a-0ec5-465e-aff4-b8dbc6816ef8',
                'cache-control': 'no-cache',
                Authorization: 'Bearer '+req.token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        form: { idOrga: req.params.idOrga }
    };

    request(options, function (error, response, body) {
        res.type('json');
        if (error) res.send({'status': 1000, 'error': errors.error_1000, 'error_message': body});
        else{res.send(body);}
    });
});

app.get("/orga/task/assigned/:idOrga",function(req, res){
    let options = {
        method: 'GET',
        url: 'http://127.0.0.1:2445/assigned_task_by_orga',
        headers:
            {
                'Postman-Token': '3cca8e0a-0ec5-465e-aff4-b8dbc6816ef8',
                'cache-control': 'no-cache',
                Authorization: 'Bearer '+req.token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        form: { idOrga: req.params.idOrga }
    };

    request(options, function (error, response, body) {
        res.type('json');
        if (error) res.send({'status': 1000, 'error': errors.error_1000, 'error_message': body});
        else{res.send(body);}
    });
});
//endregion

//region GET DATA WITH idTask
app.get("/task/:idTask",function(req, res){
    let options = {
        method: 'GET',
        url: 'http://127.0.0.1:2445/task_details',
        headers:
            {
                'Postman-Token': '3cca8e0a-0ec5-465e-aff4-b8dbc6816ef8',
                'cache-control': 'no-cache',
                Authorization: 'Bearer '+req.token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        form: { idTask: req.params.idTask }
    };

    request(options, function (error, response, body) {
        res.type('json');
        if (error) res.send({'status': 1000, 'error': errors.error_1000, 'error_message': body});
        else{res.send(body);}
    });
});

app.get("/task/shift/:idTask",function(req, res){
    let options = {
        method: 'GET',
        url: 'http://127.0.0.1:2445/shift_by_task',
        headers:
            {
                'Postman-Token': '3cca8e0a-0ec5-465e-aff4-b8dbc6816ef8',
                'cache-control': 'no-cache',
                Authorization: 'Bearer '+req.token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        form: { idTask: req.params.idTask }
    };

    request(options, function (error, response, body) {
        res.type('json');
        if (error) res.send({'status': 1000, 'error': errors.error_1000, 'error_message': body});
        else{res.send(body);}
    });
});

app.get("/task/orga/assigned/:idTask", function(req, res){
    let options = {
        method: 'GET',
        url: 'http://127.0.0.1:2445/orga_assigned_by_task',
        headers:
            {
                'Postman-Token': '3cca8e0a-0ec5-465e-aff4-b8dbc6816ef8',
                'cache-control': 'no-cache',
                Authorization: 'Bearer '+req.token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        form: { idTask: req.params.idTask }
    };

    request(options, function (error, response, body) {
        res.type('json');
        if (error) res.send({'status': 1000, 'error': errors.error_1000, 'error_message': body});
        else{res.send(body);}
    });
});
//endregion

//region GET DATA WITH idShift
app.get("/shift/orga/:idShift",function(req, res){
    let options = {
        method: 'GET',
        url: 'http://127.0.0.1:2445/orga_by_shift',
        headers:
            {
                'Postman-Token': '3cca8e0a-0ec5-465e-aff4-b8dbc6816ef8',
                'cache-control': 'no-cache',
                Authorization: 'Bearer '+req.token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        form: { idShift: req.params.idShift }
    };

    request(options, function (error, response, body) {
        res.type('json');
        if (error) res.send({'status': 1000, 'error': errors.error_1000, 'error_message': body});
        else{res.send(body);}
    });
});

app.get("/shift/task/:idShift",function(req, res){
    let options = {
        method: 'GET',
        url: 'http://127.0.0.1:2445/task_by_shift',
        headers:
            {
                'Postman-Token': '3cca8e0a-0ec5-465e-aff4-b8dbc6816ef8',
                'cache-control': 'no-cache',
                Authorization: 'Bearer '+req.token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        form: { idShift: req.params.idShift }
    };

    request(options, function (error, response, body) {
        res.type('json');
        if (error) res.send({'status': 1000, 'error': errors.error_1000, 'error_message': body});
        else{res.send(body);}
    });
});

app.get("/shift/subshift/:idShift",function(req, res){
    let options = {
        method: 'GET',
        url: 'http://127.0.0.1:2445/subshift_by_shift',
        headers:
            {
                'Postman-Token': '3cca8e0a-0ec5-465e-aff4-b8dbc6816ef8',
                'cache-control': 'no-cache',
                Authorization: 'Bearer '+req.token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        form: { idShift: req.params.idShift }
    };

    request(options, function (error, response, body) {
        res.type('json');
        if (error) res.send({'status': 1000, 'error': errors.error_1000, 'error_message': body});
        else{res.send(body);}
    });
});
//endregion

//region GET DATA WITH idSubShift
app.get("/subshift/orga/:idSubShift",function(req, res){
    let options = {
        method: 'GET',
        url: 'http://127.0.0.1:2445/orga_by_subshift',
        headers:
            {
                'Postman-Token': '3cca8e0a-0ec5-465e-aff4-b8dbc6816ef8',
                'cache-control': 'no-cache',
                Authorization: 'Bearer '+req.token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        form: { idSubShift: req.params.idSubShift }
    };

    request(options, function (error, response, body) {
        res.type('json');
        if (error) res.send({'status': 1000, 'error': errors.error_1000, 'error_message': body});
        else{res.send(body);}
    });
});

app.get("/subshift/task/:idSubShift",function(req, res){
    let options = {
        method: 'GET',
        url: 'http://127.0.0.1:2445/task_by_subshift',
        headers:
            {
                'Postman-Token': '3cca8e0a-0ec5-465e-aff4-b8dbc6816ef8',
                'cache-control': 'no-cache',
                Authorization: 'Bearer '+req.token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        form: { idSubShift: req.params.idSubShift }
    };

    request(options, function (error, response, body) {
        res.type('json');
        if (error) res.send({'status': 1000, 'error': errors.error_1000, 'error_message': body});
        else{res.send(body);}
    });
});
//endregion

//endregion

//region QUERY CREATE REQUESTS

app.post("/orga", function(req, res){
    let options = {
        method: 'POST',
        url: 'http://127.0.0.1:2445/orga',
        headers:
            {
                'Postman-Token': '3cca8e0a-0ec5-465e-aff4-b8dbc6816ef8',
                'cache-control': 'no-cache',
                Authorization: 'Bearer '+req.token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        form: {
            last_name: req.body.last_name,
            first_name: req.body.first_name,
            mail: req.body.mail,
            pwd: req.body.pwd
        }
    };

    request(options, function (error, response, body) {
        res.type('json');
        if (error) res.send({'status': 1000, 'error': errors.error_1000, 'error_message': body});
        else{res.send(body);}
    });
});

app.post("/orga/shift/:idOrga", function(req, res){
    let options = {
        method: 'POST',
        url: 'http://127.0.0.1:2445/assign_shift_orga',
        headers:
            {
                'Postman-Token': '3cca8e0a-0ec5-465e-aff4-b8dbc6816ef8',
                'cache-control': 'no-cache',
                Authorization: 'Bearer '+req.token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        form: {
            idOrga: req.params.idOrga,
            shifts: req.body.shifts
        }
    };

    request(options, function (error, response, body) {
        res.type('json');
        if (error) res.send({'status': 1000, 'error': errors.error_1000, 'error_message': body});
        else{res.send(body);}
    });
});

app.post("/task/:start_date/:end_date/:idOrga", function(req, res){
    let options = {
        method: 'POST',
        url: 'http://127.0.0.1:2445/task',
        headers:
            {
                'Postman-Token': '3cca8e0a-0ec5-465e-aff4-b8dbc6816ef8',
                'cache-control': 'no-cache',
                Authorization: 'Bearer '+req.token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        form: {
            name: req.body.name,
            description: req.body.description,
            start_date: req.params.start_date,
            end_date: req.params.end_date,
            idOrga: req.params.idOrga
        }
    };

    request(options, function (error, response, body) {
        res.type('json');
        if (error) res.send({'status': 1000, 'error': errors.error_1000, 'error_message': body});
        else{res.send(body);}
    });
});

app.post("/shift/:start_date", function(req, res){
    let options = {
        method: 'POST',
        url: 'http://127.0.0.1:2445/shift',
        headers:
            {
                'Postman-Token': '3cca8e0a-0ec5-465e-aff4-b8dbc6816ef8',
                'cache-control': 'no-cache',
                Authorization: 'Bearer '+req.token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        form: {
            start_date: req.params.start_date
        }
    };

    request(options, function (error, response, body) {
        res.type('json');
        if (error) res.send({'status': 1000, 'error': errors.error_1000, 'error_message': body});
        else{res.send(body);}
    });
});

app.post("/orga/task/:idOrga/:idTask", function(req, res){
    let options = {
        method: 'POST',
        url: 'http://127.0.0.1:2445/assign_task_orga',
        headers:
            {
                'Postman-Token': '3cca8e0a-0ec5-465e-aff4-b8dbc6816ef8',
                'cache-control': 'no-cache',
                Authorization: 'Bearer '+req.token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        form: {
            idOrga: req.params.idOrga,
            idTask: req.params.idTask
        }
    };

    request(options, function (error, response, body) {
        res.type('json');
        if (error) res.send({'status': 1000, 'error': errors.error_1000, 'error_message': body});
        else{res.send(body);}
    });
});

app.post("/shift/multiple", function(req, res){
    let options = {
        method: 'POST',
        url: 'http://127.0.0.1:2445/shifts',
        headers:
            {
                'Postman-Token': '3cca8e0a-0ec5-465e-aff4-b8dbc6816ef8',
                'cache-control': 'no-cache',
                Authorization: 'Bearer '+req.token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        form: {
            undefined: undefined
        }
    };

    request(options, function (error, response, body) {
        res.type('json');
        if (error) res.send({'status': 1000, 'error': errors.error_1000, 'error_message': body});
        else{res.send(body);}
    });
});

//endregion

//region QUERY UPDATE REQUESTS

//endregion

//region QUERY DELETE REQUESTS

app.delete('/shift/:idShift/:delete_task', function(req, res){
    let options = {
        method: 'DELETE',
        url: 'http://127.0.0.1:2445/shift',
        headers:
            {
                'Postman-Token': '3cca8e0a-0ec5-465e-aff4-b8dbc6816ef8',
                'cache-control': 'no-cache',
                Authorization: 'Bearer '+req.token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        form: {
            idShift: req.params.idShift,
            delete_task: req.params.delete_task
        }
    };

    request(options, function (error, response, body) {
        res.type('json');
        if (error) res.send({'status': 1000, 'error': errors.error_1000, 'error_message': body});
        else{res.send(body);}
    });
});

app.delete('/orga/:idOrga/:delete_task', function(req, res){
    let options = {
        method: 'DELETE',
        url: 'http://127.0.0.1:2445/orga',
        headers:
            {
                'Postman-Token': '3cca8e0a-0ec5-465e-aff4-b8dbc6816ef8',
                'cache-control': 'no-cache',
                Authorization: 'Bearer '+req.token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        form: {
            idOrga: req.params.idOrga,
            delete_task: req.params.delete_task
        }
    };

    request(options, function (error, response, body) {
        res.type('json');
        if (error) res.send({'status': 1000, 'error': errors.error_1000, 'error_message': body});
        else{res.send(body);}
    });
});

app.delete('/task/:idTask', function(req, res){
    let options = {
        method: 'DELETE',
        url: 'http://127.0.0.1:2445/task',
        headers:
            {
                'Postman-Token': '3cca8e0a-0ec5-465e-aff4-b8dbc6816ef8',
                'cache-control': 'no-cache',
                Authorization: 'Bearer '+req.token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        form: {
            idTask: req.params.idTask
        }
    };

    request(options, function (error, response, body) {
        res.type('json');
        if (error) res.send({'status': 1000, 'error': errors.error_1000, 'error_message': body});
        else{res.send(body);}
    });
});

app.delete('/task/shift/:idTask/:idSubShift', function(req, res){
    let options = {
        method: 'DELETE',
        url: 'http://127.0.0.1:2445/task_shift',
        headers:
            {
                'Postman-Token': '3cca8e0a-0ec5-465e-aff4-b8dbc6816ef8',
                'cache-control': 'no-cache',
                Authorization: 'Bearer '+req.token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        form: {
            idTask: req.params.idTask,
            idSubShift: req.params.idSubShift
        }
    };

    request(options, function (error, response, body) {
        res.type('json');
        if (error) res.send({'status': 1000, 'error': errors.error_1000, 'error_message': body});
        else{res.send(body);}
    });
});

app.delete('/task/orga/:idTask/:idOrga', function(req, res){
    let options = {
        method: 'DELETE',
        url: 'http://127.0.0.1:2445/task_orga',
        headers:
            {
                'Postman-Token': '3cca8e0a-0ec5-465e-aff4-b8dbc6816ef8',
                'cache-control': 'no-cache',
                Authorization: 'Bearer '+req.token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        form: {
            idTask: req.params.idTask,
            idOrga: req.params.idOrga
        }
    };

    request(options, function (error, response, body) {
        res.type('json');
        if (error) res.send({'status': 1000, 'error': errors.error_1000, 'error_message': body});
        else{res.send(body);}
    });
});

//endregion

/*region AUTH REQUESTS*/

app.post("/login", function(req, res){
    bcrypt.hash(req.body.pwd, salt, null, function(err,pwd){
        let options = {
            method: 'POST',
            url: 'http://localhost:4524/check_pwd',
            headers:
                {
                    'Postman-Token': 'e99cb172-c3fc-4150-ae2a-6005aadfa7bd',
                    'cache-control': 'no-cache',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            form:
                {
                    mail: req.body.mail,
                    pwd: pwd
                }
        };

        request(options, function (error, response, body) {
            res.type('json');
            if (error) res.send({'status': 1000, 'error': errors.error_1000, 'error_message': body});
            else{res.send(body);}
        });
    });
});

app.post("/register_user", function(req, res){
    let options = {
        method: 'POST',
        url: 'http://localhost:4524/register_user',
        headers:
            {
                'Postman-Token': 'e99cb172-c3fc-4150-ae2a-6005aadfa7bd',
                'cache-control': 'no-cache',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        form:
            {
                mail: req.body.mail,
                pwd: req.body.pwd
            }
    };

    request(options, function (error, response, body) {
        res.type('json');
        if (error) res.send({'status': 1000, 'error': errors.error_1000, 'error_message': body});
        else{res.send(body);}
    });
});

app.post("/logout", function(req, res){
    let options = {
        method: 'POST',
        url: 'http://localhost:4524/logout',
        headers:
            {
                'Postman-Token': 'e99cb172-c3fc-4150-ae2a-6005aadfa7bd',
                'cache-control': 'no-cache',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        form:
            {
                token: req.body.token
            }
    };

    request(options, function (error, response, body) {
        res.type('json');
        if (error) res.send({'status': 1000, 'error': errors.error_1000, 'error_message': body});
        else{res.send(body);}
    });
});

/*endregion*/

//region DEFAULT ROUTE

app.use(function(req, res){
    res.render("404.ejs");
});

//endregion

//region LISTEN

app.listen(8000, function(){
    console.log("client server listening on port 8000");
});

const key = fs.readFileSync('../ssl/organify.key');
const cert = fs.readFileSync('../ssl/organify.crt');
const options = {
    key: key,
    cert: cert
};

const server = https.createServer(options, app);

server.listen(1200, () => {
    console.log("server starting on port : " + 1200);
});

//endregion