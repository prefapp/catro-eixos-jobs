class Observer{

    constructor(acciones = {}){

        this.acciones = acciones;

    }

    instalar(){

        return (refStore) => {
            
            this.__accion(refStore.getState());
        }
    }

    __accion(estado){

        let tipo = estado["ultimaAccion"].get("tipo");

        if(this.acciones[tipo]){
            this.acciones[tipo](estado, estado["ultimaAccion"].get("accion"));
        }

    }
}

module.exports = Observer;
