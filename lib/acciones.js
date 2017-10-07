module.exports = {

    "CAMBIO_RESULTADOS": (id, clave, valor) => {

        return {
            type: "CAMBIO_RESULTADOS",
            id: id,
            clave: clave,
            valor: valor
        }

    },

    "CAMBIO_META": (id, clave, valor) => {

        return {
            type: "CAMBIO_META",
            id: id,
            clave: clave,
            valor: valor
        }

    },

    "NUEVO_JOB": (job) => {

        return {
            type: "NUEVO_JOB",
            job: job 
        }
    },

    "JOB_ALMACENADO": (job) => {

      return {
        type: "JOB_ALMACENADO",
        job: job
      }
    },

    "JOB_REINICIADO": (id) => {

      return {
        type: "JOB_REINICIADO",
        id: id
      }

    }
}
