/**
 * model-sync
 * Model sync model
 *
 * @copyright 2012 Enrico Marino and Federico Spini
 * @license MIT
 */ 

/** 
 * Dependencies.
 */

var Model = require('model');
var request = require('request');

/**
 * Expose `Model`.
 */

module.exports = ModelSync;

/**
 * @constructor ModelSync
 *
 * @api public
 */

function ModelSync (options) {
  Model.call(this);
  this.root = options.root; 
}

/**
 * Inherit from `Model`
 */

ModelSync.prototype = Object.create(Model.prototype);
ModelSync.prototype.constructor = ModelSync;

/**
 * root
 */

CocoModel.prototype.root = '';

/**
 * primary_key
 */

CocoModel.prototype.primary_key = '_id';

/**
 * get_id
 */

CocoModel.prototype.get_id = function () {
  return this.attributes[this.primary_key];
};

/**
 * save
 *
 * @param {Function} callback
 *   @param {Object} err error
 *   @param {Object} res response
 * @param {Object} context
 * @api public
 */

ModelSync.prototype.save = function (callback, context) {
  var callback = callback || function () {};
  var model = this;
  var path = model.root;
  var data = model.attributes;
  var primary_key = model.primary_key;
  var id = data[primary_key];
  
  if (id) {
    model.update(callback, context);
    return;
  }

  request
    .post(path)
    .data(data)
    .end(function (res) {
      if (res.ok) {
        callback.call(context, null, res.body);
      } else {
        callback.call(context, res.text, null);
      }
    });
};

/** 
 * update
 * 
 * @param {Function} callback
 *   @param {Object} err error
 *   @param {Object} res response
 * @param {Object} context
 * @api private
 */

ModelSync.prototype.update = function (callback, context) {
  var callback = callback || function () {};
  var model = this;
  var path = model.root;
  var data = model.attributes;
  var primary_key = model.primary_key;
  var id = data[primary_key];

  request
    .put(path)
    .data(data)
    .end(function (res) {
      if (res.ok) {
        callback.call(context, null, res.body);
      } else {
        callback.call(context, res.text, null);
      }
    });
};

/**
 * fetch
 *
 * @param {Function} callback
 *   @param {Object} err error
 *   @param {Object} res response
 * @param {Object} context
 * @api public
 */

ModelSync.prototype.fetch = function (callback, context) {
  var callback = callback || function () {};
  var model = this;
  var path = model.root;
  var data = model.attributes;
  var primary_key = model.primary_key;
  var id = data[primary_key];

  request
    .get(path + '/' + id)
    .end(function (res) {
      if (res.ok) {
        model.set(res.body)
        callback.call(context, null, res.body);
      } else {
        callback.call(context, res.text, null);
      }
    });
};
