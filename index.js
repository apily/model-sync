/** !
 * model-sync
 *
 * @author Enrico Marino and Federico Spini
 * @copyright 2013 Enrico Marino and Federico Spini
 * @licence MIT
 */

/**
 * Expose component.
 */

module.exports = function (model) {

  /** 
   * Component dependencies.
   */
  
  var request = require('request');

  /**
   * root
   */
  
  model.prototype.root = '';
  
  /**
   * primary_key
   */
  
  model.prototype.primary_key = '_id';
  
  /**
   * id
   * Get the model id. 
   * 
   * @return {String} the model id.
   * @api public
   */
  
  model.prototype.id = function () {
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
  
  model.prototype.url = function () {
    if (this._url) {
      return this._url;
    }
  
    var url = this.root;
    var collection = this.collection;
    var id = this.id();
  
    if (collection) {
      url += collection.url();
    }
    if (id) {
      url += '/';
      url += encodeURIComponent(id);
    }
    url = url.replace(/\/\/+/, '/');
    
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
  
  model.prototype.save = function (callback, context) {
    callback = callback || function () {};
    var model = this;
    var id = model.id();
    var url = model.url();
    var data = model.attributes;
    
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
  
  model.prototype.update = function (callback, context) {
    callback = callback || function () {};
    var model = this;
    var url = model.url();
    var data = model.attributes;
  
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
  
  model.prototype.fetch = function (callback, context) {
    callback = callback || function () {};
    var model = this;
    var url = model.url();
  
    request
      .get(url)
      .end(function (res) {
        if (res.ok) {
          model.set(res.body);
          callback.call(context, null, model);
        } else {
          callback.call(context, res.text, null);
        }
      });
  };

  return model;
}
