 //created by:Irfan
 addCashHandover: (req, res, next) => {
    
    const _options = req.mySQl !== undefined ? req.mySQl : req.connection;
    const _mysql = new algaehMysql(_options);
    const utilities = new algaehUtilities();
   
    const inputParam = req.body;
   // const decimal_places = req.userIdentity.decimal_places>0?req.userIdentity.decimal_places:3;
    console.log("receiptdetails:",inputParam.receiptdetails);
  
    try {
      if (req.userIdentity.user_type == "C" && inputParam.shift_id > 0) {
        if (inputParam.receiptdetails.length > 0) {
          _mysql
            .executeQuery({
              query:
                "select hims_f_cash_handover_header_id, shift_id, daily_handover_date,\
                  hims_f_cash_handover_detail_id, D.casher_id,D.shift_status,D.open_date,\
                  D.expected_cheque,D.expected_card,D.no_of_cheques,D.collected_cash,D.refunded_cash\
                  from hims_f_cash_handover_header H left join hims_f_cash_handover_detail D \
                  on H.hims_f_cash_handover_header_id=D.cash_handover_header_id\
                  and date(D.open_date)=CURDATE()  and casher_id=? and shift_status='O' and D.record_status='A'\
                  where H.shift_id=? and date(H.daily_handover_date)=CURDATE() and H.hospital_id=? ",
              values: [
                req.userIdentity.algaeh_d_app_user_id,
                inputParam.shift_id,
                req.userIdentity.hospital_id
              ],
              printQuery: true
            })
            .then(result => {
              let collected_cash = 0;
              let expected_card = 0;
              let expected_cheque = 0;
              let no_of_cheques = 0;
  
              //update Details
              let whichQuery = "UD";
  
              if (!result.length > 0) {
                //insert header and details
                whichQuery = "IHD";
              } else if (
                result.length > 0 &&
                !result[0]["hims_f_cash_handover_detail_id"] > 0
              ) {
                //insert details
                whichQuery = "ID";
              }
  
              collected_cash = new LINQ(inputParam.receiptdetails)
                .Where(w => w.pay_type == "CA")
                .Sum(s => parseFloat(s.amount));;
                console.log("collected_cash:",collected_cash);
              if (inputParam.pay_type == "P") {
                switch (whichQuery) {
                  case "IHD":
                    _mysql
                      .executeQueryWithTransaction({
                        query:
                          "INSERT  INTO `hims_f_cash_handover_header` ( shift_id, daily_handover_date,\
                              created_date, created_by, updated_date, updated_by,hospital_id)\
                            VALUE(?,?,?,?,?,?,?)",
                        values: [
                          inputParam.shift_id,
                          new Date(),
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          req.userIdentity.hospital_id
                        ],
                        printQuery: true
                      })
                      .then(headerRes => {
                        if (headerRes.insertId > 0) {
                          _mysql
                            .executeQuery({
                              query:
                                "INSERT INTO `hims_f_cash_handover_detail` ( cash_handover_header_id, casher_id,\
                              shift_status,open_date,  refunded_cash,created_date, created_by, updated_date, updated_by,hospital_id)\
                              VALUE(?,?,?,?,?,?,?,?,?,?)",
                              values: [
                                headerRes.insertId,
                                req.userIdentity.algaeh_d_app_user_id,
                                "O",
                                new Date(),
                                collected_cash,
                                new Date(),
                                req.userIdentity.algaeh_d_app_user_id,
                                new Date(),
                                req.userIdentity.algaeh_d_app_user_id,
                                req.userIdentity.hospital_id
                              ],
                              printQuery: true
                            })
                            .then(handoverDetails => {
                              if (handoverDetails.insertId > 0) {
                                _mysql
                                  .executeQuery({
                                    query:
                                      "update hims_f_cash_handover_detail set expected_cash=collected_cash-refunded_cash\
                                      where hims_f_cash_handover_detail_id=?;\
                                      update hims_f_receipt_header set cash_handover_detail_id=? where\
                                         hims_f_receipt_header_id=?;",
                                    values: [
                                      handoverDetails.insertId,
                                      handoverDetails.insertId,
                                      req.body.receipt_header_id
                                    ],
                                    printQuery: true
                                  })
                                  .then(updateRecept => {
                                    if (req.mySQl==undefined||req.adv_refnd=="Y") {
                                      _mysql.commitTransaction(() => {
                                        _mysql.releaseConnection();
                                        if(req.adv_refnd!=="Y"){

                                          req.records = updateRecept;
                                        }
                                        next();
                                      });
                                    } else {
                                      if (req.records) {
                                        req.records["internal_error"] = false;
                                      } else {
                                        req.records = {
                                          internal_error: false
                                        };
                                      }
  
                                      next();
                                    }
                                  })
                                  .catch(error => {
                                    _mysql.rollBackTransaction(() => {
                                      next(error);
                                    });
                                  });
                              } else {
                                req.records = {
                                  internal_error: true,
                                  message: "detais error"
                                };
                                _mysql.rollBackTransaction(() => {
                                  next();
                                });
                              }
                            })
                            .catch(error => {
                              _mysql.rollBackTransaction(() => {
                                next(error);
                              });
                            });
                        } else {
                          req.records = {
                            internal_error: true,
                            message: "Header error"
                          };
                          _mysql.rollBackTransaction(() => {
                            next();
                          });
                        }
                      })
                      .catch(error => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      });
  
                    break;
  
                  case "ID":
                    _mysql
                      .executeQueryWithTransaction({
                        query:
                          "INSERT INTO `hims_f_cash_handover_detail` ( cash_handover_header_id, casher_id,\
                          shift_status,open_date,  refunded_cash,created_date, created_by, updated_date, updated_by,hospital_id)\
                          VALUE(?,?,?,?,?,?,?,?,?,?)",
                        values: [
                          result[0]["hims_f_cash_handover_header_id"],
                          req.userIdentity.algaeh_d_app_user_id,
                          "O",
                          new Date(),
                          collected_cash,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          req.userIdentity.hospital_id
                        ],
                        printQuery: true
                      })
                      .then(handoverDetails => {
                        if (handoverDetails.insertId > 0) {
                          _mysql
                            .executeQuery({
                              query:
                                "update hims_f_cash_handover_detail set expected_cash=collected_cash-refunded_cash\
                                where hims_f_cash_handover_detail_id=?;\
                                update hims_f_receipt_header set cash_handover_detail_id=? where\
                                hims_f_receipt_header_id=?;",
                              values: [
                                handoverDetails.insertId,
                                handoverDetails.insertId,
                                req.body.receipt_header_id
                              ],
                              printQuery: true
                            })
                            .then(updateRecept => {
                              if (req.mySQl==undefined||req.adv_refnd=="Y") {
                                _mysql.commitTransaction(() => {
                                  _mysql.releaseConnection();
                                  if(req.adv_refnd!=="Y"){

                                    req.records = updateRecept;
                                  }
                                  next();
                                });
                              } else {
                                if (req.records) {
                                  req.records["internal_error"] = false;
                                } else {
                                  req.records = {
                                    internal_error: false
                                  };
                                }
  
                                next();
                              }
                            })
                            .catch(error => {
                              _mysql.rollBackTransaction(() => {
                                next(error);
                              });
                            });
                        } else {
                          req.records = {
                            internal_error: true,
                            message: "detais error"
                          };
                          _mysql.rollBackTransaction(() => {
                            next();
                          });
                        }
                      })
                      .catch(error => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      });
  
                    break;
                  case "UD":
                      collected_cash += parseFloat(result[0].refunded_cash);
  
                    _mysql
                      .executeQueryWithTransaction({
                        query:
                          "update hims_f_cash_handover_detail set refunded_cash=?,updated_date=?,updated_by=? where record_status='A' \
                        and hims_f_cash_handover_detail_id=?;\
                        update hims_f_cash_handover_detail set expected_cash=collected_cash-refunded_cash\
                                      where hims_f_cash_handover_detail_id=?;\
                         update hims_f_receipt_header set cash_handover_detail_id=? where hims_f_receipt_header_id=?;",
                        values: [
                          collected_cash,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          result[0]["hims_f_cash_handover_detail_id"],
                          result[0]["hims_f_cash_handover_detail_id"],
                          result[0]["hims_f_cash_handover_detail_id"],
                          req.body.receipt_header_id
                        ],
                        printQuery: true
                      })
                      .then(updateResult => {
                        if (req.mySQl==undefined||req.adv_refnd=="Y") {
                          _mysql.commitTransaction(() => {
                            _mysql.releaseConnection();
                            if(req.adv_refnd!=="Y"){

                              req.records = updateRecept;
                            }
                            next();
                          });
                        } else {
                          if (req.records) {
                            req.records["internal_error"] = false;
                          } else {
                            req.records = {
                              internal_error: false
                            };
                          }
  
                          next();
                        }
                      })
                      .catch(error => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      });
                    break;
                }
              } else {
                console.log("one :");
                expected_card = new LINQ(inputParam.receiptdetails)
                .Where(w => w.pay_type == "CD")
                .Sum(s => parseFloat(s.amount));
  
                expected_cheque = new LINQ(inputParam.receiptdetails)
                  .Where(w => w.pay_type == "CH")
                  .Sum(s => parseFloat(s.amount));
  
                no_of_cheques = new LINQ(inputParam.receiptdetails)
                  .Where(w => w.pay_type == "CH")
                  .ToArray().length;
  
                switch (whichQuery) {
                  case "IHD":
                    _mysql
                      .executeQueryWithTransaction({
                        query:
                          "INSERT  INTO `hims_f_cash_handover_header` ( shift_id, daily_handover_date,\
                                created_date, created_by, updated_date, updated_by,hospital_id)\
                              VALUE(?,?,?,?,?,?,?)",
                        values: [
                          inputParam.shift_id,
                          new Date(),
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          req.userIdentity.hospital_id
                        ],
                        printQuery: true
                      })
                      .then(headerRes => {
                        console.log("two :");
                        if (headerRes.insertId > 0) {
                          _mysql
                            .executeQuery({
                              query:
                                "INSERT INTO `hims_f_cash_handover_detail` ( cash_handover_header_id, casher_id,\
                                shift_status,open_date,   collected_cash,expected_card,  expected_cheque, \
                                no_of_cheques,created_date, created_by, updated_date, updated_by,hospital_id)\
                                VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?)",
                              values: [
                                headerRes.insertId,
                                req.userIdentity.algaeh_d_app_user_id,
                                "O",
                                new Date(),
  
                                collected_cash,
                                expected_card,
                                expected_cheque,
                                no_of_cheques,
                                new Date(),
                                req.userIdentity.algaeh_d_app_user_id,
                                new Date(),
                                req.userIdentity.algaeh_d_app_user_id,
                                req.userIdentity.hospital_id
                              ],
                              printQuery: true
                            })
                            .then(handoverDetails => {
                              console.log("three :");
                              if (handoverDetails.insertId > 0) {
                                _mysql
                                  .executeQuery({
                                    query:
                                      "update hims_f_cash_handover_detail set expected_cash=collected_cash-refunded_cash\
                                      where hims_f_cash_handover_detail_id=?;\
                                      update hims_f_receipt_header set cash_handover_detail_id=? where\
                                           hims_f_receipt_header_id=?;",
                                    values: [
                                      handoverDetails.insertId,
                                      handoverDetails.insertId,
                                      req.body.receipt_header_id
                                    ],
                                    printQuery: true
                                  })
                                  .then(updateRecept => {
                                    console.log("here :","catt");
                                    if (req.mySQl==undefined||req.adv_refnd=="Y") {
                                      console.log("four here :");
                                      _mysql.commitTransaction(() => {
                                        _mysql.releaseConnection();
                                        if(req.adv_refnd!=="Y"){

                                          req.records = updateRecept;
                                        }
                                        next();
                                      });
                                    } else {
                                      console.log("here :","dog");
                                      if (req.records) {
                                        req.records["internal_error"] = false;
                                      } else {
                                        req.records = {
                                          internal_error: false
                                        };
                                      }
  
                                      next();
                                    }
                                  })
                                  .catch(error => {
                                    console.log("error1 :",error);
                                    _mysql.rollBackTransaction(() => {
                                      next(error);
                                    });
                                  });
                              } else {
                                req.records = {
                                  internal_error: true,
                                  message: "detais error"
                                };
                                _mysql.rollBackTransaction(() => {
                                  next();
                                });
                              }
                            })
                            .catch(error => {
                              _mysql.rollBackTransaction(() => {
                                next(error);
                              });
                            });
                        } else {
                          req.records = {
                            internal_error: true,
                            message: "Header error"
                          };
                          _mysql.rollBackTransaction(() => {
                            next();
                          });
                        }
                      })
                      .catch(error => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      });
  
                    break;
  
                  case "ID":
                    _mysql
                      .executeQueryWithTransaction({
                        query:
                          "INSERT INTO `hims_f_cash_handover_detail` ( cash_handover_header_id, casher_id,\
                        shift_status,open_date,  collected_cash, expected_card,  expected_cheque, \
                        no_of_cheques,created_date, created_by, updated_date, updated_by,hospital_id)\
                        VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?)",
                        values: [
                          result[0]["hims_f_cash_handover_header_id"],
                          req.userIdentity.algaeh_d_app_user_id,
                          "O",
                          new Date(),
                          collected_cash,
                          expected_card,
                          expected_cheque,
                          no_of_cheques,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          req.userIdentity.hospital_id
                        ]
                      })
                      .then(handoverDetails => {
                        console.log("apple :");
                        if (handoverDetails.insertId > 0) {
                          _mysql
                            .executeQuery({
                              query:
                                "update hims_f_cash_handover_detail set expected_cash=collected_cash-refunded_cash\
                                where hims_f_cash_handover_detail_id=?;\
                                update hims_f_receipt_header set cash_handover_detail_id=? where\
                                  hims_f_receipt_header_id=?;",
                              values: [
                                handoverDetails.insertId,
                                handoverDetails.insertId,
                                req.body.receipt_header_id
                              ],
                              printQuery: true
                            })
                            .then(updateRecept => {
                              console.log("ball :");
                              if (req.mySQl==undefined||req.adv_refnd=="Y") {
                                _mysql.commitTransaction(() => {
                                  _mysql.releaseConnection();
                                  if(req.adv_refnd!=="Y"){

                                    req.records = updateRecept;
                                  }
                                
                                  next();
                                });
                              } else {
                                if (req.records) {
                                  req.records["internal_error"] = false;
                                } else {
                                  req.records = {
                                    internal_error: false
                                  };
                                }
  
                                next();
                              }
                            })
                            .catch(error => {
                              _mysql.rollBackTransaction(() => {
                                next(error);
                              });
                            });
                        } else {
                          req.records = {
                            internal_error: true,
                            message: "detais error"
                          };
                          _mysql.rollBackTransaction(() => {
                            next();
                          });
                        }
                      })
                      .catch(error => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      });
  
                    break;
                  case "UD":
                      expected_card += parseFloat(result[0].expected_card);
                    collected_cash += parseFloat(result[0].collected_cash);
                    expected_cheque += parseFloat(result[0].expected_cheque);
                    no_of_cheques += parseFloat(result[0].no_of_cheques);
                    _mysql
                      .executeQueryWithTransaction({
                        query:
                          "update hims_f_cash_handover_detail set collected_cash=?,expected_card=?,\
                            expected_cheque=?,no_of_cheques=?,updated_date=?,updated_by=? where record_status='A' \
                          and hims_f_cash_handover_detail_id=?;\
                          update hims_f_cash_handover_detail set expected_cash=collected_cash-refunded_cash\
                                      where hims_f_cash_handover_detail_id=?;\
                           update hims_f_receipt_header set cash_handover_detail_id=? where hims_f_receipt_header_id=?;",
                        values: [
                          collected_cash,
                          expected_card,
                          expected_cheque,
                          no_of_cheques,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          result[0]["hims_f_cash_handover_detail_id"],
                          result[0]["hims_f_cash_handover_detail_id"],
                          result[0]["hims_f_cash_handover_detail_id"],
                          req.body.receipt_header_id
                        ],
                        printQuery: true
                      })
                      .then(updateResult => {
                        console.log("last :");
                        if (req.mySQl==undefined||req.adv_refnd=="Y") {

                          console.log("BOOSSS :");
                          _mysql.commitTransaction(() => {
                            _mysql.releaseConnection();
                            if(req.adv_refnd!=="Y"){
                              req.records = updateRecept;
                            }
                            next();
                          });
                        } else {
                          if (req.records) {
                            req.records["internal_error"] = false;
                          } else {
                            req.records = {
                              internal_error: false
                            };
                          }
  
                          next();
                        }
                      })
                      .catch(error => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });

                        console.log("er3 :",error);
                      });
                    break;
                }
              }
            })
            .catch(error => {
              _mysql.rollBackTransaction(() => {
                next(error);
              });
            });
        } else {
          if (req.mySQl==undefined||req.adv_refnd=="Y") {
            req.records = {
              internal_error: true,
              message: "No receipt details"
            };
            _mysql.rollBackTransaction(() => {
              next();
            });
          } else {
            req.records = {
              internal_error: true,
              message: "No receipt details"
            };
            _mysql.rollBackTransaction(() => {
              next();
            });
          }
        }
      } else {
        if (req.mySQl==undefined||req.adv_refnd=="Y") {
          req.records = {
            internal_error: true,
            message: "Current user is not a Cahsier"
          };
          _mysql.rollBackTransaction(() => {
            next();
          });
        } else {
          req.records = {
            internal_error: true,
            message: "Current user is not a Cahsier"
          };
          _mysql.rollBackTransaction(() => {
            next();
          });
        }
      }
    } catch (e) {
      console.log("error:",e)
      _mysql.rollBackTransaction(() => {
        next(error);
      });
    }
  },