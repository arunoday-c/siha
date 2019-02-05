import algaehMysql from "algaeh-mysql";
module.exports = {
  getPatientMrdList: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = new algaehMysql();
      try {
        _mysql
          .executeQuery({
            query: "",
            values: [],
            printQuery: true
          })
          .then(result => {
            _mysql.releaseConnection();
            req.records = result;
            resolve(result);
            next();
          })
          .catch(error => {
            _mysql.releaseConnection();
            reject(error);
            next(error);
          });
      } catch (e) {
        _mysql.releaseConnection();
        next(e);
      }
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  getPatientEncounterDetails: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = new algaehMysql();
      try {
        _mysql
          .executeQuery({
            query: "",
            values: [],
            printQuery: true
          })
          .then(result => {
            _mysql.releaseConnection();
            req.records = result;
            resolve(result);
            next();
          })
          .catch(error => {
            _mysql.releaseConnection();
            reject(error);
            next(error);
          });
      } catch (e) {
        _mysql.releaseConnection();
        next(e);
      }
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  getPatientChiefComplaint: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = new algaehMysql();
      try {
        _mysql
          .executeQuery({
            query: "",
            values: [],
            printQuery: true
          })
          .then(result => {
            _mysql.releaseConnection();
            req.records = result;
            resolve(result);
            next();
          })
          .catch(error => {
            _mysql.releaseConnection();
            reject(error);
            next(error);
          });
      } catch (e) {
        _mysql.releaseConnection();
        next(e);
      }
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  getPatientDiagnosis: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = new algaehMysql();
      try {
        _mysql
          .executeQuery({
            query: "",
            values: [],
            printQuery: true
          })
          .then(result => {
            _mysql.releaseConnection();
            req.records = result;
            resolve(result);
            next();
          })
          .catch(error => {
            _mysql.releaseConnection();
            reject(error);
            next(error);
          });
      } catch (e) {
        _mysql.releaseConnection();
        next(e);
      }
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  getPatientMedication: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = new algaehMysql();
      try {
        _mysql
          .executeQuery({
            query: "",
            values: [],
            printQuery: true
          })
          .then(result => {
            _mysql.releaseConnection();
            req.records = result;
            resolve(result);
            next();
          })
          .catch(error => {
            _mysql.releaseConnection();
            reject(error);
            next(error);
          });
      } catch (e) {
        _mysql.releaseConnection();
        next(e);
      }
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  getPatientInvestigation: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = new algaehMysql();
      try {
        _mysql
          .executeQuery({
            query: "",
            values: [],
            printQuery: true
          })
          .then(result => {
            _mysql.releaseConnection();
            req.records = result;
            resolve(result);
            next();
          })
          .catch(error => {
            _mysql.releaseConnection();
            reject(error);
            next(error);
          });
      } catch (e) {
        _mysql.releaseConnection();
        next(e);
      }
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  getPatientPaymentDetails: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = new algaehMysql();
      try {
        _mysql
          .executeQuery({
            query: "",
            values: [],
            printQuery: true
          })
          .then(result => {
            _mysql.releaseConnection();
            req.records = result;
            resolve(result);
            next();
          })
          .catch(error => {
            _mysql.releaseConnection();
            reject(error);
            next(error);
          });
      } catch (e) {
        _mysql.releaseConnection();
        next(e);
      }
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  getPatientTreatments: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = new algaehMysql();
      try {
        _mysql
          .executeQuery({
            query: "",
            values: [],
            printQuery: true
          })
          .then(result => {
            _mysql.releaseConnection();
            req.records = result;
            resolve(result);
            next();
          })
          .catch(error => {
            _mysql.releaseConnection();
            reject(error);
            next(error);
          });
      } catch (e) {
        _mysql.releaseConnection();
        next(e);
      }
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  }
};
