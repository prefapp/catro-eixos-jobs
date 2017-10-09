const Acciones = require("../acciones.js");

module.exports = class{

  constructor(){

    this.jobs = {};

  }

  jobModificado(jobId, tipo){

    this.jobs[jobId] = this.jobs[jobId] || {};
    this.jobs[jobId][tipo] = true;
  
  }

  vaciarBuffer(refStore){

    const store = refStore.getState();

    let jobs = Object.keys(this.jobs).map((id) => {

//        let modificaciones = store.jobs.getIn(
//
//          ["jobs", id]
//
//        ).toJS()
//
//        console.log(store.jobs.getIn(["jobsMutados", id]).toJS())
//
//        if(!this.jobs[id]["metas"])
//          delete modificaciones["metas"];
//        if(!this.jobs[id]["resultados"])
//          delete modificaciones["resultados"];

        let modificaciones = store.jobs.getIn(["jobsMutados", id]).toJS();

        console.log(modificaciones);

        return {

          id: id,

          "set": {"$set": modificaciones}
        }  
    })

    jobs.forEach((j) => {

      refStore.dispatch(
        Acciones.JOB_REINICIADO(j.id)
      )

    })

    this.jobs = {};

    return jobs;
  }

  almacenarJob(job, refDB){

    return new Promise((cumplida, falla) => {

      refDB.collection("jobs")

        .updateOne({_id: job.id}, job["set"], function(err){

            if(err) return falla(err);
            else    return cumplida();

        })

    })
    
  }
}
