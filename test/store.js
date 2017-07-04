const {expect} = require("chai");

const StoreJobs = require("../lib/store.js");

const {Map, List, fromJS, is} = require("immutable");

const Job = require("../lib/job.js");
const Observer = require("../lib/observer.js");

describe("Store - funciona", function(){

    it("Permite crear una store", function(){

        let historia = [];

        let s = new StoreJobs();

        s.agregarObserver(new Observer({

            NUEVO_JOB: () => {
                historia.push("NUEVO_JOB");
            },

            CAMBIO_RESULTADOS: () => {
                historia.push("CAMBIO_RESULTADOS");
            },

            CAMBIO_META: () => {
                historia.push("CAMBIO_META");
            },

        }));       

        let t = new Job({}, {});       

        expect(historia[0]).to.be.equal("NUEVO_JOB");

        t.resultados.a = 1;
        expect(historia[1]).to.be.equal("CAMBIO_RESULTADOS");

        t.resultados.a = 2;
        expect(historia[2]).to.be.equal("CAMBIO_RESULTADOS");

        t.meta.status = "PROCESSING";
        expect(historia[3]).to.be.equal("CAMBIO_META");
    })

})
