const Driver = require("./driver.js");

const MongoClient = require("mongodb").MongoClient; 

const Observer = require("../observer.js");

const assert = require("assert");

const DriverMongoBuffer = require("./driver_mongo_buffer.js");

class DriverMongo extends Driver{

    constructor(conexion, store){

      super(store);
      
      this.cadenaConexion = conexion;
      this.buffer = new DriverMongoBuffer();
  
      this.fEnProcesado = false;

      this.__acciones = [];

    }

    iniciar(){

      return new Promise((cumplida, falla) => {

        MongoClient.connect(this.cadenaConexion)
    
          .then((conexion) => {

            this._conexion = conexion;

            this.__vincularStore();

            this.__iniciarBucle();

            cumplida();

          })
          .catch((err) => {

            falla(`[JOBS_INIT][MONGO_CONEXION][${err.stack}]`)

          })
      })

    }

    buscarJobs(consulta){

      return this._conexion.collection("jobs").find(consulta).toArray();

    }

    __iniciarBucle(){

      setInterval(() => {

        if(this.fEnProcesado) 
          return;

        else
          return this.__bucle();


      }, 50)

    }

    __bucle(){

      this.fEnProcesado = true;

      (async () => {
  
          const jobs = this.buffer.vaciarBuffer(this.store.store);

          for(let i = 0; i < jobs.length; i++){

              try{
                let r = await this.buffer.almacenarJob(jobs[i], this._conexion);
              }
              catch(e){

                if(e.toString().match(/TIMEOUT/)){
                
                  this.fEnProcesado = false;

                  console.log(`TIMEOUT EN MONGO DE ESCRITURA`)

                  return;
                }
                throw `ERROR EN ESCRITURA EN MONGO: ${e}`
              }

          }

          this.fEnProcesado = false;

      })();

    }

    __vincularStore(){

        let id = 0;
        let encoladas = 0;

        let actualizarJob = (data, tipo) => {

          this.buffer.jobModificado(data.ultimaAccion.get("accion")["id"], tipo);

//              this._conexion.collection("jobs")
//
//                .updateOne({_id: jobId}, {
//
//                  "$set": set
// 
//                }, function(err, r){
//
//                  if(err) return falla(err);
//
//                  console.log(u()[0], u()[1]);        

      };

      this.store.agregarObserver(

        new Observer({

          "CAMBIO_RESULTADOS": (data) => { actualizarJob(data, "resultados")},

          "CAMBIO_META": (data) => { actualizarJob(data, "meta")},

          "NUEVO_JOB": (store) => {

            let job = store.ultimaAccion.get("accion").job;
 
            let job_raw = job.RAW();

            job_raw["_id"] = job_raw.id;

            //delete job_raw.id;

            this._conexion.collection("jobs")

                    .insertOne(job_raw)

                    .then(() => {

                      this.__accionJobAlmacenado(job);
      
                    })

          }

        })

      )

    }

    getJob(id){

      const e = async () => { 
        while(1){
          if(!this.fEnProcesado) return;
          else await new Promise((c) => { setTimeout(c, 5)})
        }
      };

      return e().then(() => { 

          return this._conexion.collection("jobs").findOne({
              _id: id
          })

      })

    }

}

module.exports = DriverMongo;
