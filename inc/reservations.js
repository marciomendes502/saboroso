let conn = require('./db');
let Pagination = require('./Pagination');
var moment = require('moment');

module.exports= {

    render(req, res, error, success){

        res.render('reservations', {
            req,
            title: 'Reservas - Restaurante Saboroso',
            h1:'Reserve uma Mesa amigo!',
            background:'images/img_bg_2.jpg',
            error,
            success
          });

    },
    save(fields){      

        return new Promise((resolve, reject)=>{
            
            let query, params = [
                fields.name,
                fields.email,
                fields.people,
                fields.date,
                fields.time
            ];
        
            if((fields.date).indexOf("/") > -1){
        
                let date =  fields.date.split('/');
                    
                fields.date = `${date[2]}-${date[1]}-${date[0]}`; 

                params[3] = fields.date;
        
              }
           


            if(parseInt(fields.id) > 0){

                params.push(fields.id);

                query = `UPDATE tb_reservations SET name = ?, email= ?, people=?, date=?, time=? WHERE id= ?`;
                

            }else{

                query = `INSERT INTO tb_reservations(name, email, people, date, time) 
                VALUES(?, ?, ?, ?, ?)`;
            }


            
            
            conn.query(query,params,(err, results) => {

                if(err){
                    reject(err);
                }else{
                    resolve(results);
                }
            
            });

        });
        
        


    },
    getReservations(req){


        return new Promise((resolve, reject)=>{

            let page = req.query.page;
            let dtstart = req.query.start;
            let dtend = req.query.end;
            
            if(!page) page = 1;

            let params = [];
    
            if(dtstart && dtend) params.push(dtstart, dtend);
    
            let pag = new Pagination(`
            SELECT SQL_CALC_FOUND_ROWS * 
            FROM tb_reservations
            ${(dtstart && dtend) ? 'WHERE date BETWEEN ? AND ?' : ''}
            ORDER BY date DESC LIMIT ?, ?
            `,
            params
            );
    
             pag.getPage(page).then(data =>{

                resolve({
                    data,
                    links: pag.getNavigation(req.query)
                })

             });


        });

       

    },
    delete(id){

        return new Promise((resolve, reject)=>{
  
          conn.query(`DELETE FROM tb_reservations WHERE id=?`, id, (error, results)=>{
  
            if(error){
  
              reject(error);
            
            }else{
              resolve(results);
            }
  
          })
  
        });
  
      },
      getChart(req){

        return new Promise((resolve,reject)=>{
            conn.query(`
                SELECT 
                    CONCAT(YEAR(date), '-', MONTH(date)) AS date,
                    COUNT(*) AS total, 
                    (SUM(people) / COUNT(*)) AS avg_people
                FROM tb_reservations 
                WHERE 
                    date BETWEEN ? AND ?
                GROUP BY YEAR(date), MONTH(date)
                ORDER BY YEAR(date) DESC, MONTH(date) DESC;
                `,[
                     req.query.start,
                     req.query.end
                 ],(err, results)=>{

                    if(err){
                        reject(err);
                    }else{

                        let months = [];
                        let values = [];

                        results.forEach(row =>{
                            months.push(moment(row.date).format('MMM YYYY'));
                            values.push(row.total);
                        })

                        resolve({
                            months,
                            values
                        });
                    }
                 });
        });
      }


}