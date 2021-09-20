
HTMLFormElement.prototype.save = function(url, method, config){

  let form = this;

  form.addEventListener('submit', event =>{
    
    event.preventDefault();
        
      let formCreateData = new FormData(form);
        
      fetch(url,{
            method,
            body: formCreateData
      }).then(response=> response.json())
          .then(json=>{ 

            if(json.error){

             if(typeof config.failure === 'function') config.failure(json.error);

            }else{

              if(typeof config.success === 'function') config.success(json);

            }
              
          }).catch(error =>{

            if(typeof config.failure === 'function') config.failure(error);
            
            });           
  });

};