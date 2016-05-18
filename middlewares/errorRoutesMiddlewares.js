'use strict';

exports.notFound = function(req, res, next) {
  res.status(404);
  res.render('404');
};

exports.serverError = function(err, req, res, next){
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
};
