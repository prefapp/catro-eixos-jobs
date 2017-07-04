
const {mixin} = require("catro-eixos-js");

const Job = require("./job.js");

const ProcesoConJobsMixin = mixin({

    "iniciarJob": function(){

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

        return j;
    }


});

module.exports = ProcesoConJobsMixin;
