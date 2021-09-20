class PluginChangeImg{

    constructor(inputFile, tagImg){

        this.inputFile = inputFile;
        this.tagImg = tagImg;

        this.initInputEvent();


    }


    initInputEvent(){

        document.querySelector(this.inputFile).addEventListener('change', event =>{

            console.log(event.target.files[0]);

            this.fileReader(event.target.files[0]).then(file =>{

                console.log(file);

               document.querySelector(this.tagImg).src = file;

            }).catch(e=>{

                console.error(e);

            });


        });


    }

    fileReader(file){

        return new Promise((resolve, reject)=>{


        let reader = new FileReader();

        reader.onload = function() {

            resolve(reader.result);
            
        }

        reader.onerror = function(e){

            reject(e);

        }


        reader.readAsDataURL(file);
    
        });

    }


        

        


}