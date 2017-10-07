const {Map, List, fromJS} = require("immutable");

module.exports = {

    "setEstadoJobs": (estado = Map()) => {

        return estado.merge({

            jobs: Map(),

            jobsMutados: Map()

        });
    },

    "altaJob": (estado, job) => {
       
        return estado.update(

            "jobs", 

            (t) => t.set(job.id, fromJS(job.RAW()))
        )

    },

    "jobAlmacenado": (estado, id) => {

        return estado.updateIn(
      
          ["jobs", id, "meta"],

          (r) => r.set("almacenado", true)
        )

    },

    "setResultado": (estado, id, clave, valor) => {

        return estado.updateIn(

            ["jobs", id, "resultados"],

            (r) => r.set(clave, valor) 
        
        ).updateIn(

            ["jobsMutados", id],

            Map(),

            (m) => m.set("resultados."+clave, valor) 

        )
    },

    "setMeta": (estado, id, clave, valor) => {

        return estado.updateIn(

            ["jobs", id, "meta"],
    
            (r) => r.set(clave, valor)

        ).updateIn(

          ["jobsMutados", id],

          Map(),

          (m) => m.set("meta."+clave, valor)

        )
    },

    "reiniciarJob": (estado, id) => {

      return estado.deleteIn(["jobsMutados", id])

    }

}

