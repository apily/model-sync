/** !
 * model-sync
 *
 * @author Enrico Marino and Federico Spini
 * @copyright 2013 Enrico Marino and Federico Spini
 * @licence MIT
 */

/** 
 * Dependencies.
 */

var request = require('request');

/**
 * Expose `Model`.
 */

module.exports = Model;

/**
 * @constructor Model
 *
 * @api public
 */

function Model (options) {
  this.attributes = {};
}

/**
 * root
 */

Model.prototype.root = '';

/**
 * primary_key
 */

Model.prototype.primary_key = '_id';

/**
 * id
 * Get the model id. 
 * 
 * @return {String} the model id.
 * @api public
 */

Model.prototype.id = function () {
  if (this._id) {
    return this._id;
  }

  this._id = this.attributes[this.primary_key];
  return this._id;
};

/**
 * url
 * Get the model url.
 *
 * @return {String} the model url.
 * @api public
 */

Model.prototype.url = function () {
  if (this._url) {
    return this._url;
  }

  var url = this.root;
  var collection = this.collection;
  var id = this.attributes[this.primary_key];

  if (collection) {
    url += collection.url();
  }
  if (id) {
    url += url.charAt(url.length - 1) === '/' ? '' : '/';
    url += encodeURIComponent(id);
  }

  this._url = url;
  return url;
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

Model.prototype.save = function (callback, context) {
  var callback = callback || function () {};
  var id = this.id();
  var url = this.url();
  
  if (id) {
    model.update(callback, context);
    return;
  }

  request
    .post(url)
    .send(data)
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

Model.prototype.update = function (callback, context) {
  var callback = callback || function () {};
  var url = this.url();
  var data = this.attributes;

  request
    .put(url)
    .send(data)
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

Model.prototype.fetch = function (callback, context) {
  var callback = callback || function () {};
  var model = this;
  var url = model.url();

  request
    .get(url)
    .end(function (res) {
      if (res.ok) {
        callback.call(context, null, res.body);
      } else {
        callback.call(context, res.text, null);
      }
    });
};
