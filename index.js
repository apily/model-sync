
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

var Model = require('model');
var request = require('request');

/**
 * Expose `Model`.
 */

module.exports = ModelSync;

/**
 * @constructor Model
 *
 * @api public
 */

function ModelSync (attributes, options) {
  var attributes = attributes || {};
  var options = options || {};

  Model.call(this, attributes, options);

  if (options.root) {
    this.root = options.root; 
  }
}

/**
 * Inherit from `Model`
 */

ModelSync.prototype = Object.create(Model.prototype);
ModelSync.prototype.constructor = ModelSync;

/**
 * root
 */

ModelSync.prototype.root = '';

/**
 * primary_key
 */

ModelSync.prototype.primary_key = '_id';

/**
 * id
 * Get the model id. 
 * 
 * @return {String} the model id.
 * @api public
 */

ModelSync.prototype.id = function () {
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
 * @param {String} [path] path to append to the url
 * @return {String} the model url.
 * @api public
 */

ModelSync.prototype.url = function () {
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
  if (path) {
    url += '/';
    url += path;
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

ModelSync.prototype.save = function (callback, context) {
  var callback = callback || function () {};
  var id = this.id();
  var url = this.url();
  
  if (id) {
    model.update(callback, context);
    return;
  }

  request
    .post(url)
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
  var url = this.url();

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
  var url = this.url;

  request
    .get(url)
    .end(function (res) {
      if (res.ok) {
        model.set(res.body)
        callback.call(context, null, res.body);
      } else {
        callback.call(context, res.text, null);
      }
    });
};
