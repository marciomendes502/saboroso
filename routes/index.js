var conn = require('./../inc/db');
var menu = require('./../inc/menus');
var reservations =  require('./../inc/reservations');
var contacts = require('./../inc/contacts');
var express = require('express');
var router = express.Router();
var emails = require('./../inc/emails');




module.exports = function(io){

  /* GET home page. */
router.get('/', function(req, res, next) {

  menu.getMenus().then(results =>{
  
    res.render('index', { 
      title: 'Restaurante Saboroso',
      menus: results,
      isHome: true 
     });
  
  }); 
    
  });
  
  router.get('/contacts', function(req, res, next){
  
    contacts.render(req, res);
    
  });
  
  router.post('/contacts', function(req, res, next){
  
    if(!req.body.name){
      contacts.render(req, res,"Digite o nome!");
  
    }else if(!req.body.email){
      contacts.render(req, res,"Digite o email!");
  
    }else if(!req.body.message || req.body.message === "" || req.body.message.length < 10){
  
      contacts.render(req, res,"Digite a mensagem, tem que ter no mínimo 10 caracteres!");
  
    }else{
  
      contacts.save(req.body).then(results =>{
  
        req.body = {};
        
        io.emit('dashboard update');
        contacts.render(req, res, null,"Mensagem enviada com sucesso!");
  
      }).catch(error =>{
  
        contacts.render(req, res, error.message);
        
      });
  
    }
  
  
  
  });
  
  router.get('/menus', function(req, res, next){
  
  
  
    menu.getMenus().then(results =>{
  
      res.render('menus', {
        title: 'Menus - Restaurante Saboroso',
        h1:'Saboreie nosso menu!',
        background:'images/img_bg_1.jpg',
        menus: results
      });
    
    }); 
    
  
    
  });
  
  router.get('/reservations', function(req, res, next){
  
    
    reservations.render(req, res);
     
  });
  
  router.post('/reservations', function(req, res, next){
  
    if(!req.body.name){
      reservations.render(req, res, "Digite o Nome!"); //anteriormente res.send("Digite o nome!")
    }else if(!req.body.email){
      reservations.render(req, res, "Digite o Email!");
    }else if(!req.body.people){
      reservations.render(req, res, "Coloque o número de pessoas!");
    }else if(!req.body.date){
      reservations.render(req, res, "Coloque a Data!");
    }else if(!req.body.time){
      reservations.render(req, res, "Coloque a Hora!");
    }else{

  
      reservations.save(req.body).then(result =>{
  
        req.body = {};

         io.emit('dashboard update');
         
         reservations.render(req, res, null, "Reserva feita com sucesso!");
  
      }).catch(error =>{
  
        reservations.render(req, res, error.message);
  
      });
      
    }
  
    
  
    
  });
  
  router.get('/services', function(req, res, next){
  
    res.render('services', {
      title: 'Serviços - Restaurante Saboroso',
      h1:'É um prazer poder servir!',
      background:'images/img_bg_1.jpg'
    });
  
    
  });
  
  router.post('/subscribe', function(req, res, next){
  
    if(!req.fields.email){
      res.send({
        error: "Preencha o e-mail."
      });
    }else{
  
      emails.save(req.fields).then(result =>{
        
        io.emit('dashboard update');
        res.send(result);
    
      }).catch(error =>{
    
        res.send(error);
      })
      
    }
  
  });


  return router;
};
