import helpers from './index';
import _ from 'lodash';

const validAttributeFunctionType = 'array';
const customTypes = {
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

function formatAttributes (attribute) {
  let result;
  const split = attribute.split(':');
  const customAttributes = {};

  if (split.length === 2) {
    result = { fieldName: split[0], dataType: split[1], dataFunction: null };
  } else if (split.length >= 3) {
    const isValidFunction = validAttributeFunctionType === split[1].toLowerCase();
    const isValidValue = validAttributeFunctionType !== split[2].toLowerCase();

    if (isValidFunction && isValidValue) {
      result = { fieldName: split[0], dataType: split[2], dataFunction: split[1] };
    } else {
      result = { fieldName: split[0], dataType: split[1] };
    }
    /*
     * Use custom attrs to set `customTypes`
     */
    if (split.length > 3 || !isValidFunction) {
      const startIndex = !isValidFunction ? 2 : 3;
      const extraAttrs = split.slice(startIndex);
      _.forEach(extraAttrs, attr => {
        if (_.has(customTypes, attr)) {
          _.merge(customAttributes, customTypes[attr]);
        }
      });
    }
  }
  return _.merge(result, { customAttributes });
}

module.exports = {
  transformAttributes (flag) {
    /*
      possible flag formats:
      - first_name:string,last_name:string,bio:text,reviews:array:string
      - 'first_name:string last_name:string bio:text reviews:array:string'
      - 'first_name:string, last_name:string, bio:text, reviews:array:string'
    */

    const set    = flag.replace(/,/g, ' ').split(/\s+/);
    const result = [];

    set.forEach(attribute => {
      const formattedAttribute = formatAttributes(attribute);

      if (formattedAttribute) {
        result.push(formattedAttribute);
      }
    });

    return result;
  },

  generateFileContent (args) {
    return helpers.template.render('models/model.js', {
      name:       args.name,
      attributes: this.transformAttributes(args.attributes),
      underscored: args.underscored
    });
  },

  generateFile (args) {
    const modelPath = helpers.path.getModelPath(args.name);

    helpers.asset.write(modelPath, this.generateFileContent(args));
  },

  modelFileExists (filePath) {
    return helpers.path.existsSync(filePath);
  }
};
