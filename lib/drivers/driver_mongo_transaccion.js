const Acciones = require("../acciones.js");

module.exports = class{

  constructor(){

    this.jobs = {};

    this.v = 0;
  }

  nuevoJob(job){

    this.jobs[job] = new LogJob();

  }

  nuevoCambio(id, clave, valor){

    let cambio = {};

    cambio[clave] = valor;

    return this.jobs[id].nuevoCambio(cambio)

  }

  almacenar(refDB){

    return new Promise((cumplida, falla) => {

      (() => {

        this.v++;

        Object.keys(this.jobs).forEach(async (jobId) => {

            while(this.jobs[jobId].hayCambio()){

              try{

                let r = await this.__almacenarCambio(

                  refDB,

                  jobId,

                  this.jobs[jobId]
                );

              }
              catch(e){

                console.log(`ERROR EN ESCRITURA ${e}`)
                return falla(`ERROR EN ESCRITURA EN MONGO: ${e}`)
              }
            }

        })

        cumplida();

      })();

    });

  }

  __almacenarCambio(refDB, jobId, log){

    return new Promise((cumplida, falla) => {

      const cambio = log.getCambio();

      console.log("ALMACENANDO CAMBIO", cambio, " en ", jobId)

      const t = setTimeout(() => {
        falla(`TIMEOUT`);
      }, 500);

      refDB.collection("jobs")

        .updateOne({_id: jobId}, {"$set": cambio})  

        .then((datos) => {

            clearTimeout(t);

            if(datos.result.ok) return cumplida();

            else    return falla();

        })

    })

  }

}

class LogJob{


  constructor(){

    this.log = [];

  }

  hayCambio(){
    return this.log.length > 0
  }

  nuevoCambio(cambio){
    this.log.push(cambio);
  }

  getCambio(){
    return this.log.shift();
  }

}
