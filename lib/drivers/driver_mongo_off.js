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
      this.log = new DriverMongoLog();
  
      this.fEnProcesado = false;

      this.__acciones = [];

    }

    iniciar(){

      return new Promise((cumplida, falla) => {

        MongoClient.connect(this.cadenaConexion, {
          poolSize: 10,
          keepAlive: 1000,
          //socketTimeoutMS: 5000,
          bufferMaxEntries: 0, 
          //autoReconnect: false, 
          //noDelay: false,
          loggerLevel: "error"})
    
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

          try{
            let r = await this.log.almacenar(this._conexion);  

            this.fEnProcesado = false;
          }
          catch(e){
            throw `ERROR EN MONGO ${e}`
          }
    

      })();

    }

    __vincularStore(){

        let id = 0;
        let encoladas = 0;

        let actualizarJob = (data, tipo) => {

 //         this.buffer.jobModificado(data.ultimaAccion.get("accion")["id"], tipo);
          const a = data.ultimaAccion.get("accion");

          this.log.nuevoCambio(a.id, tipo + "." + a.clave, a.valor)

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

                      this.log.nuevoJob(job_raw.id)

                      this.__accionJobAlmacenado(job);
      
                    })

          }

        })

      )

    }

    getJob(id){

    //  const e = async () => { 
    //    while(1){
    //      if(!this.fEnProcesado) return;
    //      else await new Promise((c) => { setTimeout(c, 5)})
    //    }
    //  };

    //  return e().then(() => { 

          console.log(`------> CONSULTANDO JOB ${id} `)

          return this._conexion.collection("jobs").findOne({
              _id: id
          }).then((job) => {

            console.log(`<------- CONSULTA RESPONDIDA ${id}`);

            return job;
          })

    //  })

    }

}

module.exports = DriverMongo;
