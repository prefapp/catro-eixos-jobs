const {Proceso} = require("catro-eixos-js");

const ProcesoConJobsMixin = require("./proceso_jobs.js");

module.exports = ProcesoConJobsMixin(

    class extends Proceso{

        //DEPURAR() {return true}

        __r(){
            return [

                "__crearJob", 
                "__a", 
                "__b", 
                "__apuntarResultados"
            ]

        }

        __crearJob(){
    
            this.iniciarJob();
        }

        EVAL__crearJob(){

            if(!this["job"]) throw("NO_TIENE_JOB");
        }

        KO__crearJob(err){
            this.error(`[CREAR_JOB][${err}]`);
        }

        __a(){

            this["suma"] = this.arg("a") + this.arg("b");
        }

        __b(){
            this["resta"] = this.arg("a") - this.arg("b")
        }

        __apuntarResultados(){

            this.resultado("suma", this["suma"]);
            this.resultado("resta", this["resta"]);
            this.resultado("idJob", this["job"].id);
        }

        KO__apuntarResultados(err){

            this.error(`[APUNTANDO_RESULTADOS][${err}]`);
        }
    }

)
