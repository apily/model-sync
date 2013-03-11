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
 * Expose `Sync`
 */

module.exports = Sync;

/**
 * Sync
 * 
 * @param {Object} options options
 * @api public
 */

function Sync (options) {
  options = options || {}
  this.root = options.root || ''; 
}

/**
 * save
 * Save the model.
 * 
 * @param {Function} callback callback
 * @param {Object} context context
 * @api public
 */

Sync.prototype.save = function (callback, context) {
  var self = this;
  var root = this.root;
  var data = this.attributes;
  var path = root;

  self.emit('saving');
  request
    .post(path)
    .send(data)
    .end(function (res) {
      if (res.ok) {
        self.created = true;
        self.emit('saved');
        callback.call(context, null, res.body);
      } else {
        callback.call(context, res.body, null);
      }
    });  
};

/**
 * update
 * Update the model.
 * 
 * @param {Function} callback callback
 * @api public
 */

Sync.prototype.update = function (callback, context) {
  var self = this;
  var id = this.id;
  var root = this.root;
  var data = this.attributes;
  var path = root + '/' + id;

  self.emit('saving');
  request
    .put(path)
    .send(data)
    .end(function (res) {
      if (res.ok) {
        self.emit('saved');
        callback.call(context, null, res.body);
      } else {
        callback.call(context, res.body, null);
      }
    });  
};


/**
 * update
 * Update the model.
 * 
 * @param {Function} callback callback
 * @api public
 */

Sync.prototype.delete = function (callback, context) {
  var self = this;
  var id = this.id;
  var root = this.root;
  var path = root + '/' + id;

  self.emit('deleting');
  request
    .delete(path)
    .send(data)
    .end(function (res) {
      if (res.ok) {
        self.emit('deleted');
        callback.call(context, null, res.body);
      } else {
        callback.call(context, res.body, null);
      }
    });  
};
