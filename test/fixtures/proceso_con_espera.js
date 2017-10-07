const {Proceso} = require("catro-eixos-js");

const ProcesoConJobsMixin = require("./proceso_jobs.js");

module.exports = ProcesoConJobsMixin(

    class extends Proceso{

        //DEPURAR() {return true}

        __r(){
            return [

                "__crearJob",
                "__puntoA",
                "__puntoB",
            ]

        }

        __crearJob(){
            this.iniciarJob();
            this.resultado("punto", 0);
        }

        __puntoA(){

            return new Promise((cumplida) => {

                setTimeout(() => {
                    this.resultado("punto", 50);
                    cumplida();
                }, 500)

            });
        }

        __puntoB(){

            return new Promise((cumplida) => {

                setTimeout(() => {
                    this.resultado("punto", 100);
                    cumplida();
                }, 500)

            });
        }
    }

)
