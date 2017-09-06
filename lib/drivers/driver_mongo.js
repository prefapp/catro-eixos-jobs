const Driver = require("./driver.js");

const MongoClient = require("mongodb").MongoClient; 

const Observer = require("../observer.js");

class DriverMongo extends Driver{

    constructor(conexion, store){

      super(store);
      
      this.cadenaConexion = conexion;

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

      console.log(consulta);

      return this._conexion.collection("jobs").find(consulta).toArray();

    }

    __iniciarBucle(){

      let enProcesado = false;

      setInterval(() => {

        if(this.__acciones.length == 0 || enProcesado) return;

        enProcesado = true;

        (async () => {

          let continuar = true;

          while(continuar){

            let f = this.__acciones.shift();

            if(!f){

              continuar = false;

              enProcesado = false;

            }
            else{

              await f();

            }
          }

        })()

      }, 50)

    }

    __vincularStore(){

        let actualizarJob = (data) => {

         let jobId = data.ultimaAccion.get("accion").id;

         let job = data.jobs.getIn(["jobs", jobId]);

         this.__acciones.push(() => {

           return this._conexion.collection("jobs")

             .findOneAndUpdate({id: jobId}, {

               "$set": job.toJS()

             })

         })
       
        };

      this.store.agregarObserver(

        new Observer({

          "CAMBIO_RESULTADOS": actualizarJob,

          "CAMBIO_META": actualizarJob,

          "NUEVO_JOB": (store) => {
            
            let job = store.ultimaAccion.get("accion").job;
 
            this.__acciones.push(() => {

              return this._conexion.collection("jobs")

                      .insertOne(job.RAW())

                      .then(() => {

                        this.__accionJobAlmacenado(job);
      
                      })

            });           

          }

        })

      )

    }

    getJob(id){

      return this._conexion.collection("jobs").findOne({
        id: id
      })

        
    }

}

module.exports = DriverMongo;
