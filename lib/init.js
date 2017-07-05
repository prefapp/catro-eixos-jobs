const StoreJobs = require("./store.js");

const DriverMemoria = require("./drivers/driver_memoria.js");

const debug = require("debug")("catro-eixos-jobs:init");

module.exports = (configuracion = {}) => {

    let store = new StoreJobs();

    let tipo = configuracion.tipo;

    let driver;

    debug(`Iniciando sistema de jobs, tipo: ${tipo}`);

    if(tipo === "memoria"){
        driver = __driverMemoria(store);
    }
    else if(tipo === "mongo"){

    }

    return new Promise((cumplida, falla) => {

        debug(`Sistema de jobs iniciado`)

        cumplida({driver, store});
    })
}

function __driverMemoria(store){
    return new DriverMemoria(store);
}
