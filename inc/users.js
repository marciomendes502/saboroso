var conn = require('./db');
//const { save } = require('./menus');


module.exports ={

    render(req, res, error){

        res.render('admin/login', {

            body: req.body,
            error

        });

    },

    login(email, password){

        return new Promise((resolve, reject)=>{

            conn.query(`SELECT * FROM tb_users Where email = ? `, [
                email
            ], (error, results)=>{
    
                if(error){
                    reject(error)
                }else{

                    if(!results.length > 0){

                        reject("Usuário ou Senha incorretos!");

                    }else{

                        let row = results[0];

                        if(row.password != password){

                        reject("Usuário ou Senha incorretos!");
                        }else{

                            resolve(row);
                        }

                    }

                    
                }
    
            });
    
        });


        },

        getUsers(){

            return new Promise((resolve, reject)=>{
    
                conn.query("SELECT * FROM tb_users ORDER BY name", (err, results) =>{
    
                    if(err){
                      reject(err);
                    }else{
    
                      resolve(results);
    
                    }
                  });
            }); 
            
        },
        save(fields, files){
    
          return new Promise((resolve, reject)=>{
    
            let query, params = [
              fields.name,
              fields.email    
            ];
    
    
            if(parseInt(fields.id) > 0){
    
              params.push(fields.id);
    
              query = `UPDATE tb_users SET name = ?, email = ? WHERE id = ?`;
    
    
            }else{
    
                params.push(fields.password);
              query = `INSERT INTO tb_users (name, email, password) VALUES(?,?,?)`;
              
              
            }
    
          conn.query(query,params,(error, results)=>{
    
            if(error){
              reject(error);
            }else{
              resolve(results);
            }
    
          });    
    
          }); 
    
        },
    
        delete(id){
    
          return new Promise((resolve, reject)=>{
    
            conn.query(`DELETE FROM tb_users WHERE id=?`, id, (error, results)=>{
    
              if(error){
    
                reject(error);
              
              }else{
                resolve(results);
              }
    
            })
    
          });
    
        },

        changePassword(req){

          return new Promise((resolve, reject)=>{

            if(!req.fields.password){

              reject({error:'Digite uma senha por favor!'});

            }else if(req.fields.password !== req.fields.passwordConfirm){

              reject({error:'As senhas não conferem, digite novamente!'});

            }else{

              conn.query('UPDATE tb_users SET password = ? WHERE id = ?', 
              [req.fields.password, req.fields.id], 
              (error, result)=>{

                if(error){

                  reject(error.message);

                }else{

                  resolve(result);

                }

              });

            }

            


          });


        }

        

}