const Driver = require("./driver.js");

const Observer = require("../observer.js");

class DriverMemoria extends Driver{

    iniciar(){

      return new Promise((cumplida, falla) => {

        this.store.agregarObserver(new Observer({

          "NUEVO_JOB": (store) => {

            //los jobs en memoria están automáticamente
            //almacenados

            let job = store.ultimaAccion.get("accion").job;

            this.__accionJobAlmacenado(job);

          }


        }))

      })

    }


    getJob(id){

        return new Promise((cumplida, falla) => {

            let j = this.store.store.getState()["jobs"]

                        .getIn(["jobs", id]);

            if(j) j = j.toJS();

            return cumplida(j);
        });
    }

}

module.exports = DriverMemoria;
