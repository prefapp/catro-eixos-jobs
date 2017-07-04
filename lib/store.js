const {createStore, combineReducers} = require("redux");

const Job = require("./job.js");

const {jobs, ultimaAccion} = require("./reducer.js");

class StoreJobs{

    constructor(){

        let reducers = combineReducers({jobs, ultimaAccion});

        this.store = createStore(reducers);        

        Job.setStore(this.store);
    }

    agregarObserver(observer){

        let f = observer.instalar();

        this.store.subscribe(() => {
            f(this.store);
        })
    }
}

module.exports = StoreJobs;
