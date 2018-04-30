'use strict';

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var validAttributeFunctionType = 'array';
var customTypes = {
  index: {
    index: true
  },
  unique: {
    unique: true
  },
  notNull: {
    allowNull: false
  }
};

function formatAttributes(attribute) {
  var result = void 0;
  var split = attribute.split(':');
  var customAttributes = {};

  if (split.length === 2) {
    result = { fieldName: split[0], dataType: split[1], dataFunction: null };
  } else if (split.length >= 3) {
    var isValidFunction = validAttributeFunctionType === split[1].toLowerCase();
    var isValidValue = validAttributeFunctionType !== split[2].toLowerCase();

    if (isValidFunction && isValidValue) {
      result = { fieldName: split[0], dataType: split[2], dataFunction: split[1] };
    } else {
      result = { fieldName: split[0], dataType: split[1] };
    }
    /*
     * Use custom attrs to set `customTypes`
     */
    if (split.length > 3 || !isValidFunction) {
      var startIndex = !isValidFunction ? 2 : 3;
      var extraAttrs = split.slice(startIndex);
      _lodash2.default.forEach(extraAttrs, function (attr) {
        if (_lodash2.default.has(customTypes, attr)) {
          _lodash2.default.merge(customAttributes, customTypes[attr]);
        }
      });
    }
  }
  return _lodash2.default.merge(result, { customAttributes });
}

module.exports = {
  transformAttributes(flag) {
    /*
      possible flag formats:
      - first_name:string,last_name:string,bio:text,reviews:array:string
      - 'first_name:string last_name:string bio:text reviews:array:string'
      - 'first_name:string, last_name:string, bio:text, reviews:array:string'
    */

    var set = flag.replace(/,/g, ' ').split(/\s+/);
    var result = [];

    set.forEach(function (attribute) {
      var formattedAttribute = formatAttributes(attribute);

      if (formattedAttribute) {
        result.push(formattedAttribute);
      }
    });

    return result;
  },

  generateFileContent(args) {
    return _index2.default.template.render('models/model.js', {
      name: args.name,
      attributes: this.transformAttributes(args.attributes),
      underscored: args.underscored
    });
  },

  generateFile(args) {
    var modelPath = _index2.default.path.getModelPath(args.name);

    _index2.default.asset.write(modelPath, this.generateFileContent(args));
  },

  modelFileExists(filePath) {
    return _index2.default.path.existsSync(filePath);
  }
};