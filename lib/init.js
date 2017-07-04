const StoreJobs = require("./store.js");

const DriverMemoria = require("./drivers/driver_memoria.js");

module.exports = (configuracion = {}) => {

    let store = new StoreJobs();

    let tipo = configuracion.tipo;

    let driver;

    if(tipo === "memoria"){
        driver = __driverMemoria(store);
    }
    else if(tipo === "mongo"){

    }

    return new Promise((cumplida, falla) => {

        cumplida({driver, store});
    })
}

function __driverMemoria(store){
    return new DriverMemoria(store);
}
