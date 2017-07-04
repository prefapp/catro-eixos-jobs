const {Map, List, fromJS} = require("immutable");

module.exports = {

    "setEstadoJobs": (estado = Map()) => {

        return estado.merge({

            jobs: Map()

        });
    },

    "altaJob": (estado, job) => {
       
        return estado.update(

            "jobs", 

            (t) => t.set(job.id, fromJS(job.RAW()))
        )

    },

    "setResultado": (estado, id, clave, valor) => {

        return estado.updateIn(

            ["jobs", id, "resultados"],

            (r) => r.set(clave, valor) 
        )
    },

    "setMeta": (estado, id, clave, valor) => {

        return estado.updateIn(

            ["jobs", id, "meta"],
    
            (r) => r.set(clave, valor)

        )
    },
}

