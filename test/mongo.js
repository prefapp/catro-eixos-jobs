const {expect} = require("chai");

const init = require("../lib/init.js");

const Job = require("../lib/job.js");
const acciones = require("../lib/acciones.js");

const {Tarea} = require("catro-eixos-js");
const ProcesoConEspera = require("./fixtures/proceso_con_espera.js");
const Observer = require("../lib/observer.js");
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

    it("Permite realizar inserciones masivas en uno o varios jobs", function(hecho){

        this.timeout(0);

        let D;

        init({tipo: "mongo", conexion: "mongodb://mongo:27017/test"})

            .then(({driver}) => {

                D = driver;

                const store = driver.store.store;

                let proms = new Array(10).fill(1).map(() => {
                  
                    let j  = new Job();

                    return j.esperarPorJobAlmacenado()
  
                              .then((nuevoJob) => {

                                return nuevoJob;
                              })

                });

                return Promise.all(proms);

              })

              .then((jj) =>{ 

                let jobs;

                 jobs = jj

                 for(let i = 0; i < 10; i++){

                   jobs[i].resultados[i.toString()] = 0;

                   for(let j = 0; j < 10; j++){

                     jobs[i].resultados[i.toString()]++;
                   }

                 }

                 return jj;
              })

          .then((jj) => {

                  setTimeout(() => {

                    let jobs2 = jj.map((j) => {

                      return D.getJob(j.id)

                    })
                  
                    Promise.all(jobs2)
    
                      .then((nJobs) => {

                        for(let i = 0; i < 10; i++){
                          expect(nJobs[i].resultados[i.toString()]).to.equal(10);
                        }

                        hecho();

                      })

  
                  }, 3000);

            })

            .catch((err) => {hecho(err)})

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

                    console.log(`Buscando ${jobId}`)       

                    driver.getJob(jobId)

                        .then((j) => {

                            console.log(j);
//
//                            expect(j).to.be.an("object");
//
//                            expect(j.meta.status).to.equal("FINISHED");
//
//                            expect(j.resultados.punto).to.equal(100)

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

    it("Permite controlar bien la inserción del job antes de su consulta", function(hecho){

        let D;
        let id;

        init({tipo: "mongo", conexion: "mongodb://mongo:27017/test"})

            .then(({driver}) => {

                D = driver;

                const j = new Job({proceso: "Test.foo"});

                id = j.id;

                return j.esperarPorJobAlmacenado()

            })
            .then((j) => {    
    
                return D.getJob(j.id)

            })
            .then((jj) => {

                expect(jj.id).to.equal(id)
                expect(jj.args.proceso).to.equal("Test.foo");

                hecho();
            })

            .catch((err) => {

                hecho(err);
            })

    })

})
