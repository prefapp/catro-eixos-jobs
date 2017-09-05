const {expect} = require("chai");

const init = require("../lib/init.js");

const {Tarea} = require("catro-eixos-js");
const ProcesoConEspera = require("./fixtures/proceso_con_espera.js");
const Observer = require("../lib/observer.js");

describe("Init del sistema en mongo", function(){

    it("Inicializa bien en mongo", function(hecho){

        init({tipo: "mongo", conexion: "mongodb://mongo:27017/test"})

            .then(({driver}) => {

                hecho();
            })

            .catch((err) => {

                console.log(err);
                hecho(1);
            })
    })

    it("Se pueden ejecutar procesos y preguntar por tareas", function(hecho){

        let Driver;

        init({tipo: "mongo", conexion: "mongodb://mongo:27017/test"})
            .then(({driver, store}) => {

                let jobId;

                store.agregarObserver(new Observer({

                  "NUEVO_JOB": (d) => {

                    jobId = d.ultimaAccion.get("accion").job.id;

                  }

                }))

                new ProcesoConEspera(

                    new Tarea("foo")

                )

                .ejecutar()

                .then((t) => {

                   setTimeout(() => {
       
                    driver.getJob(jobId)

                        .then((j) => {

 //                           console.log(j);

                            expect(j).to.be.an("object");

                            expect(j.meta.status).to.equal("FINISHED");

                            expect(j.resultados.punto).to.equal(100)

                            hecho();
                        })


                  }, 100);

                })

                .catch((err) => {

                    console.log(err);
                    hecho(true);

                })

            })

    })

})
