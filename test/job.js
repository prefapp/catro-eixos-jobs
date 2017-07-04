const {expect} = require("chai");

const estado = require("../lib/estado.js");

const {Map, List, fromJS, is} = require("immutable");

const Job = require("../lib/job.js");

describe("Job - store funciona", function(){

    before(function(){

    
        Job.setStore({

            dispatch: function(){},

        });


    })


    it("Permite crear una store", function(){

        let e = estado.setEstadoJobs();

        expect(is(e, fromJS({jobs: {}}))).to.be.equal(true)
    })

    it("Permite agregar un job a la store", function(){

        let e  = estado.setEstadoJobs();

        let t = new Job({a:1});
        let id = t.id;

        e = estado.altaJob(e, t);

        let c = {jobs:{}};

        c.jobs[id] = t.RAW();

        expect(is(e, fromJS(c))).to.be.equal(true);

    })

    it("Permite seguir los cambios en los resultados", function(){

        let e = estado.setEstadoJobs();

        let t = new Job({}, {a:1});

        let id = t.id;

        e = estado.altaJob(e, t);
        e = estado.setResultado(e, id, "a", 2);    

        expect(is(e.getIn(["jobs", id, "resultados"]), fromJS({a:2}))).to.be.equal(true);
    })

})
