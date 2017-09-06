const {expect} = require("chai");

const init = require("../lib/init.js");

const {Tarea} = require("catro-eixos-js");
const ProcesoConEspera = require("./fixtures/proceso_con_espera.js");
const Observer = require("../lib/observer.js");

describe("Init del sistema", function(){

    it("Inicializa bien en memoria", function(hecho){

        init({tipo: "memoria"})

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

        init({tipo: "memoria"})

            .then(({driver, store}) => {

                let estadosJob = [];
                let metasJob = [];

                Driver = driver;    

                store.agregarObserver(new Observer({

                    "NUEVO_JOB": (estado, accion) => {

                        estadosJob.push(
                            estado.jobs.getIn(["jobs", accion.job.id]).toJS()
                        );
                    },

                    "CAMBIO_RESULTADOS": (estado, accion) => {

                        estadosJob.push(
                            estado.jobs.getIn(["jobs", accion.id]).toJS()
                        );
                    },

                    "CAMBIO_META": (estado, accion) => {

                        metasJob.push(
                            estado.jobs.getIn(["jobs", accion.id]).toJS()
                        );
                    }
                    
                  })
                )

                new ProcesoConEspera(

                    new Tarea("foo")

                )

                .ejecutar()

                .then(({resultados}) => {

                    console.log(estadosJob);

                    //expect(estadosJob.length).to.be.equal(4);

                    expect(estadosJob[0].resultados.punto).to.be.equal(0);        
                    expect(estadosJob[1].resultados.punto).to.be.equal(50);        
                    expect(estadosJob[2].resultados.punto).to.be.equal(100);        
                    expect(estadosJob[3].resultados.punto).to.be.equal(100);        
                    expect(estadosJob[3].resultados.estado).to.be.equal("OK");        

                    expect(metasJob.pop().meta.status).to.equal("FINISHED");

                    driver.getJob(estadosJob[0].id)

                        .then((j) => {

                            expect(j).to.be.an("object");

                            hecho();
                        })


                })

                .catch((err) => {

                    console.log(err);
                    hecho(true);

                })

            })

    })

})
