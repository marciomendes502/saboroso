class SaboroGrid{

    constructor(configs){

      configs.listeners = Object.assign({
        afterUpdateClick: (e) => {

          $('#modal-update').modal('show');

        },
        afterCreateForm: (e)=>{

          window.location.reload();

        },
        afterUpdateForm: (e)=>{

          window.location.reload();

        },
        errorSubmitForm:(e, error)=>{

          alert("Não foi possível enviar o formulário!");
          console.log(error);

        },
        afterDeleteClick:(e)=>{

          window.location.reload();

        }
      }, configs.listeners);

    this.options = Object.assign({}, {
          formCreate: '#modal-create form',
          formUpdate: '#modal-update form',
          btnUpdate:'btn-update',
          btnDelete:'btn-delete',
          onUpdateLoad: (form, name, data) =>{

            let input = form.querySelector(`[name=${name}]`);  
            if(input) input.value = data[name];

          }
    }, configs);

      this.rows = [...document.querySelectorAll('table tbody tr ')];
    
      this.initForms();
      this.initButtons();
        

    }

      initForms(){

        this.formCreate = document.querySelector(this.options.formCreate);

        if(this.formCreate){

          this.formCreate.save(this.options.ajax, this.options.method,{
            success: ()=>{
              this.fireEvent('afterCreateForm');
            },
            failure:()=>{
              this.fireEvent('errorSubmitForm', error);
            }
          });

        }

        //setting the button update

        this.formUpdate = document.querySelector(this.options.formUpdate);

        if(this.formUpdate){

          this.formUpdate.save(this.options.ajax, this.options.method, {
            success: ()=>{
              this.fireEvent('afterUpdateForm');
            },
            failure:()=>{
              this.fireEvent('errorSubmitForm', error);
            }
  
          });

        }
        
      }

      fireEvent(name, args){

        if(typeof(this.options.listeners[name]) === 'function') this.options.listeners[name].apply(this, args);

      }

      setDataTr(event){

        let tr = event.path.find(el =>{
        
          return(el.tagName.toUpperCase() === 'TR');
        });


        return JSON.parse(tr.dataset.row);

      }

      btnUpdateClick(event){

        this.fireEvent('beforeUpdateClick', [event] );
        
          
          let data = this.setDataTr(event);
        
          // filling the form with data from update the dataset
          for(let name in data){
        
            this.options.onUpdateLoad(this.formUpdate, name, data);
        
          }
        
        //now displaying the filled modal
        
        this.fireEvent('afterUpdateClick', [event] );


      }

      //action delete item form menu
      btnDeleteClick(event){

        let data = this.setDataTr(event);
          
            if(confirm(eval('`'+this.options.deleteMsg+'`'))){
          
                fetch(eval('`'+this.options.deleteUrl+'`'), { method: "DELETE"})
                .then(response => response.json())
                .then(json =>{
          
                  this.fireEvent('afterDeleteClick');
                });
              
            }

      }

      initButtons(){

        this.rows.forEach(row =>{

          [...row.querySelectorAll('.btn')].forEach(btn =>{

            //console.log(btn);

            btn.addEventListener('click', e =>{

              if(e.target.classList.contains(this.options.btnUpdate)){

                this.btnUpdateClick(e);

              }else if(e.target.classList.contains(this.options.btnDelete)){


                this.btnDeleteClick(e);


              }else{


                this.fireEvent('buttonClick', [e.target, this.setDataTr(e), e]);

              }

            });

          });


        });
       

      }




}