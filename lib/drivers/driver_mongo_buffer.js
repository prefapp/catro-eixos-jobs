const Acciones = require("../acciones.js");

module.exports = class{

  constructor(){

    this.jobs = {};

  }

  jobModificado(jobId, tipo){

    this.jobs[jobId] = true;
  
  }

  getBuffer(refStore){

    const store = refStore.getState();

    let jobs = Object.keys(this.jobs).map((id) => {

        let modificaciones = store.jobs.getIn(["jobsMutados", id]).toJS();

        return {

          id: id,

          "set": {"$set": modificaciones}
        }  
    })


    return jobs;
  }

  jobAlmacenado(job, refStore){

    delete this.jobs[job.id];

    refStore.dispatch(
      Acciones.JOB_REINICIADO(job.id)
    )
  }

  almacenarJob(job, refDB){

    return new Promise((cumplida, falla) => {

      const t = setTimeout(() => {
        falla(`TIMEOUT`);
      }, 500);

      refDB.collection("jobs")

        .updateOne({_id: job.id}, job["set"],)

        .then((datos) => {

            clearTimeout(t);

            if(datos.result.ok) return cumplida();
            else    return falla();

        })

    })
    
  }
}
