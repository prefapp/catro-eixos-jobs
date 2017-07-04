const {expect} = require("chai");

const {Tarea} = require("catro-eixos-js");
const ProcesoConJobs = require("./fixtures/proceso_con_jobs.js");
const StoreJobs = require("../lib/store.js");

describe("Proceso con jobs", function(){

    let store;

    before(function(){

        store = new StoreJobs();

    })

    it("Ejecuta un proceso con jobs", function(hecho){

        let p = new ProcesoConJobs(new Tarea(

            "foo",
            {a: 5, b: 5}


        ));

        p.ejecutar()

            .then(({resultados}) => {

                expect(resultados.suma).to.be.equal(10);
                expect(resultados.resta).to.be.equal(0);
                
                expect(resultados.idJob).to.be.an("string");

                hecho();
            })
            .catch((err) => {

                console.log(err);

                hecho(1);
            })

    })

})
