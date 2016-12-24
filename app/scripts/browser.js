'use strict';

var _ = require('underscore');

// Utilities for cross-browser compatibility.
var Browser = {};

// Map of CSS properties to property names used by the DOM in this browser.
var normalizedProperties = {
  'transform': _.find(['transform', 'WebkitTransform'], function (property) {
    return document.documentElement.style[property] !== undefined;
  }) || 'transform'
};

// Convert CSS properties and values to equivalent properties and values for
// this browser.
Browser.normalizeStyles = function (styles) {
  var normalized = {};
  _.forEach(_.keys(styles), function (property) {
    if (Object.prototype.hasOwnProperty.call(normalizedProperties, property)) {
      normalized[normalizedProperties[property]] = styles[property];
    } else {
      normalized[property] = styles[property];
    }
  })
  return normalized;
};

module.exports = Browser;
