const acciones = require("../acciones.js");

class Driver{

    constructor(store){
        this.store = store;
    }

    findJobs(){ throw "findJobs: ABSTRACTO!!!" }

    getJob(){ throw "getTarea: ABSTRACTO!!!" }

    __accionJobAlmacenado(job){

      this.store.store.dispatch(acciones.JOB_ALMACENADO(job));

    }
}

module.exports = Driver;
