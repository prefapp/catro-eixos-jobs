const Estado = require("./estado.js");

const {Map} = require("immutable");

module.exports = {

    "jobs": (estado = Estado.setEstadoJobs(), accion) => {

        switch(accion.type){

            case "CAMBIO_RESULTADOS":
                return Estado.setResultado(estado, accion.id, accion.clave, accion.valor);

            case "CAMBIO_META":
                return Estado.setMeta(estado, accion.id, accion.clave, accion.valor);
            
            case "NUEVO_JOB":
                return Estado.altaJob(estado, accion.job);
      
            case "JOB_ALMACENADO":
                return Estado.jobAlmacenado(estado, accion.job.id);      
            case "JOB_REINICIADO":
                return Estado.reiniciarJob(estado, accion.id)
    
        }

        return estado;
    },

    "ultimaAccion": (estado = Map(), accion) => {

 //       console.log(`${accion.type}`)

        return estado

                .set("tipo", accion.type)

                .set("accion", accion)

    }
}
