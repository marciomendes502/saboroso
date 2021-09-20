var express = require('express');
var router = express.Router();
var users = require('./../inc/users');
var admin = require('./../inc/admin');
var menus = require('./../inc/menus');
var reservations = require('./../inc/reservations');
var moment = require('moment');
var contacts = require('./../inc/contacts');
const emails = require('../inc/emails');




module.exports = function(io){

    moment.locale('pt-BR');


router.use(function(req, res, next){

    // User is not logged in, here he redirects, checks if he is already on the login page and if he is not in the section

    if(['/login'].indexOf(req.url) === -1 && !req.session.user){

        res.redirect("/admin/login");

    }else{
        next();
    }
});


router.use(function(req, res, next){

    req.menus = admin.getMenus(req);

    next();
});

router.get("/logout", function(req, res, next){

    delete req.session.user;

    res.redirect("/admin/login");

});

router.get("/", function(req, res, next){

    admin.getDataAdmin().then(row=>{

        

        res.render("admin/index", admin.getParams(req, row));

    }).catch(error=>{

        console.error(error);

        res.render("admin/index", admin.getParams(req));

    });

    
});

router.get("/contacts", function(req, res, next){

    contacts.getContacts().then(data =>{

        res.render("admin/contacts", admin.getParams(req, {data}));


    });

    
});

router.delete("/contacts/:id", function(req, res, next){

    contacts.delete(req.params.id).then( result =>{

        io.emit('dashboard update');
        res.send(result);

    }).catch(error =>{

        res.send(error)

    });

});


router.get("/emails", function(req, res, next){

    emails.getEmails().then(data =>{

        res.render("admin/emails", admin.getParams(req, {data}));

    }).catch(error=>{

        res.send(error);

    })
    
    

});

router.get("/dashboard", function (req, res, next) {

    admin.getDataAdmin().then(results =>{ 
        
        res.send(results)
    
    }).catch(err =>{

            res.send(err);
        });
    
});

router.delete("/emails/:id", function(req, res, next){

    emails.delete(req.params.id).then(result =>{

        res.send(result);

    }).catch(error=>{

        res.send(error);
        
    });


});

router.get("/login", function(req, res, next){

    users.render(req, res, null);
});

router.post("/login", function(req, res, next){

    if(!req.body.email){

        users.render(req, res, "Preencha o campo email.");

    }else if(!req.body.password){

        users.render(req, res, "Preencha o campo senha.");
        
    }else{

        users.login(req.body.email, req.body.password).then(user =>{

            req.session.user = user;

            res.redirect("/admin");

        }).catch(error =>{

            users.render(req, res, error.message || error)

        });

    }

    
});



router.get("/menus", function(req, res, next){

    menus.getMenus().then(data=>{

        res.render("admin/menus", admin.getParams(req, {data}));

    }).catch(error=>{

        console.log(error);

    });

    
});

router.post("/menus", function(req, res, next){

    menus.save(req.fields, req.files).then(result =>{

        io.emit('dashboard update');
        res.send(result);

    }).catch(error =>{

        res.send(error);
    });
    
    

});

router.get('/teste', function(req, res, next){

    var date = "10/03/2021";

    if(('/').indexOf(date) > -1){

        console.log(('/').indexOf(date));

        

    }

    var result = ("/").indexOf(date);

    res.send(result);

});

router.delete("/menus/:id", function(req, res, next){

    menus.delete(req.params.id).then(result =>{

        io.emit('dashboard update');
        
        res.send(result);

    }).catch(error=>{

        res.send(error);
        
    });


});



router.get("/reservations", function(req, res, next){

    let start = (req.query.start) ? req.query.start : moment().subtract(1, "year").format("YYYY-MM-DD");
    let end = (req.query.end) ? req.query.end : moment().add(3, "months").format("YYYY-MM-DD");

    reservations.getReservations(
        req
        ).then(pag =>{


        res.render("admin/reservations", admin.getParams(req, {
            date:{
                start,
                end
            }, 
            data: pag.data, 
            moment,
            links: pag.links
        }));
        
    }).catch(error =>{

        console.log(error);

    });
    
    
});

router.post("/reservations", function(req, res, next){

    reservations.save(req.fields).then(result =>{

        io.emit('dashboard update');
        res.send(result);
        
    }).catch(error=>{

        res.send(error);
    })

});

router.get("/reservations/chart", function(req, res, next){

    req.query.start = (req.query.start) ? req.query.start : moment().subtract(1, "year").format("YYYY-MM-DD");
    req.query.end = (req.query.end) ? req.query.end : moment().format("YYYY-MM-DD");

    reservations.getChart(req).then(chartData =>{

        
        res.send(chartData);

    }).catch(error =>{
        
        res.send(error);
    });
    
});

router.delete("/reservations/:id", function(req, res, next){

    reservations.delete(req.params.id).then(result =>{

        io.emit('dashboard update');
        res.send(result);

    }).catch(error=>{

        res.send(error);
        
    });

});

router.get("/users", function(req, res, next){

    
    users.getUsers().then(data =>{


        res.render("admin/users", admin.getParams(req, {data}));
        
    }).catch(error =>{

        console.log(error);

    });
    
});

router.post("/users", function(req, res, next){

    users.save(req.fields).then(result =>{

        io.emit('dashboard update');
        res.send(result);

    }).catch(err =>{

        res.send(err);
    });

});

router.delete("/users/:id", function(req, res, next){

    users.delete(req.params.id).then(result =>{

        res.send(result);

        io.emit('dashboard update');
    
    }).catch(err =>{

        res.send(err);
    });
});

router.post("/users/password-change", function(req, res, next){

    users.changePassword(req).then(results =>{
        
        res.send(results);

    }).catch(err =>{

        res.send(err);

    });
});
    
    return router;

};