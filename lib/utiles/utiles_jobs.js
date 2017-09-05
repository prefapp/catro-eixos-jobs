module.exports = class {

  static setDriverJobs(driver){
    this.driver = driver;
  }

  static getDriverJobs(){
    return this.driver;
  }
}
