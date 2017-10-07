
const {mixin} = require("catro-eixos-js");

const Job = require("../../lib/job.js");

const ProcesoConJobsMixin = mixin({

    "iniciarJob": function(){

        /*
         * El proceso quiere acceso al sistema de jobs 
         * pero no generar un job
         */
        if(this["SIN_JOB"]) return;

        let j = this.__convertirTareaEnJob();

        this["job"] = j;

        this["job"].PROCESANDO();

        this.__agregarEvento(

            "FIN_PROCESADO",

            () => { this["job"].FINALIZAR() }

        );
    },

    "__convertirTareaEnJob": function(){

        let j = new Job(this.tarea.args, this.tarea.resultados);

        this.tarea.args = j.args;
        this.tarea.resultados = j.resultados;
        
        j.ID_TAREA(this.tarea.id)

        return j;
    }


});

module.exports = ProcesoConJobsMixin;
