const Driver = require("./driver.js");

const MongoClient = require("mongodb").MongoClient; 

const Observer = require("../observer.js");

const assert = require("assert");

//const DriverMongoBuffer = require("./driver_mongo_buffer.js");
const DriverMongoLog = require("./driver_mongo_transaccion.js");

class DriverMongo extends Driver{

    constructor(conexion, store){

      super(store);
      
      this.cadenaConexion = conexion;
  
      this.fEnProcesado = false;

    }

    iniciar(){

      return new Promise((cumplida, falla) => {

        MongoClient.connect(this.cadenaConexion, {
          poolSize: 1,
          //keepAlive: 1000,
          //socketTimeoutMS: 5000,
          //bufferMaxEntries: 0, 
          //autoReconnect: false, 
          //noDelay: false,
          //loggerLevel: "error"
        })
          .then((conexion) => {

            this._conexion = conexion;

            this.__vincularStore();

            //this.__iniciarBucle();

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

    __vincularStore(){

      let id = 0;
      let encoladas = 0;

      let actualizarJob = (data, tipo) => {

        const a = data.ultimaAccion.get("accion")

        let cambio = {}
        cambio[`${tipo}.${a.clave}`] = a.valor

        let jobId = a.id
        
        console.log("ALMACENANDO CAMBIO", cambio, " en ", jobId)
        
        return this._conexion.collection('jobs')
          .updateOne({
              _id: jobId
            },
            {
              "$set": cambio
            
            })
      }

      this.store.agregarObserver(

        new Observer({

          "CAMBIO_RESULTADOS": (data) => { 
            actualizarJob(data, "resultados")
            .then((salida) => {
              let cambio = data.ultimaAccion.get('accion')
              if(salida.result.ok) console.log("CAMBIO OK", cambio.clave, cambio.valor); 
              else console.log("cambio KO", salida)
            })
            .catch( e => console.log("ERROR:",  e))
          },

          "CAMBIO_META": (data) => {
            actualizarJob(data, "meta")
            .then((salida) => {
              let cambio = data.ultimaAccion.get('accion')
              if(salida.result.ok) console.log("CAMBIO META OK",cambio.clave, cambio.valor); 
              else console.log("CAMBIO_META_KO", salida)
            })
            .catch( e => console.log("ERROR META:",  e))
          
          },

          "NUEVO_JOB": (store) => {

            let job = store.ultimaAccion.get("accion").job;
 
            let job_raw = job.RAW();

            job_raw["_id"] = job_raw.id;

            //delete job_raw.id;

            this._conexion.collection("jobs")
              
              .insertOne(job_raw)
              
              .then(() => {
                this.__accionJobAlmacenado(job)
              })

          }

        })

      )

    }

    getJob(id){

      //console.log(`------> CONSULTANDO JOB ${id} `)

      return this._conexion.collection("jobs").findOne({
          _id: id
      }).then((job) => {

        //console.log(`<------- CONSULTA RESPONDIDA ${id}`);

        return job;
      })

    }

}

module.exports = DriverMongo;
