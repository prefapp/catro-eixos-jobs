const StoreJobs = require("./store.js");

const DriverMemoria = require("./drivers/driver_memoria.js");
const DriverMongo = require("./drivers/driver_mongo.js");

const debug = require("debug")("catro-eixos-jobs:init");

module.exports = (configuracion = {}) => {

    let store = new StoreJobs();

    let tipo = configuracion.tipo;

    let driver;

    debug(`Iniciando sistema de jobs, tipo: ${tipo}`);

    let codigo_iniciar;

    if(tipo === "memoria"){
      
      driver = __driverMemoria(store);
      
      codigo_iniciar = () => driver.iniciar();
    }
    else if(tipo === "mongo"){

      if(!configuracion.conexion){
        throw `[JOBS_INIT][Falta cadena de conexión]`
      }

      driver = __driverMongo(configuracion.conexion, store);

      codigo_iniciar = () => driver.iniciar();

    }

    return new Promise((cumplida, falla) => {

        codigo_iniciar()

          .then(() => {

            debug(`Sistema de jobs iniciado`)

            return cumplida({driver, store});

          })
 
          .catch((err) => {

            falla(err);

          })     

    })
}

function __driverMemoria(store){
    return new DriverMemoria(store);
}

function __driverMongo(conexion, store){
    return new DriverMongo(conexion, store);
}
