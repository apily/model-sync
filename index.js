/**
 * model-sync
 * Model sync model
 *
 * @copyright 2012 Enrico Marino and Federico Spini
 * @license MIT
 */ 

/**
 * Dependencies
 */

var request = require('request');

/**
 * Expose `sync`
 */

var sync = module.exports = {};

/**
 * create
 * create the model
 * 
 * @param {Function} callback callback
 * @param {Object} context context
 * @api public
 */

sync.create = function (callback, context) {
  var self = this;
  var data = this.attributes;

  self.emit('creating');
  request
    .post(root)
    .send(data)
    .end(function (res) {
      if (res.ok) {
        self.created = true;
        self.emit('created');
        callback.call(context, null, res.body);
      } else {
        callback.call(context, res.body, null);
      }
    });  
};

