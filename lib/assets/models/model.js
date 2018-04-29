'use strict';

module.exports = (sequelize, DataTypes) => {
  var <%= name %> = sequelize.define('<%= name %>', {
    <% attributes.forEach(function(attribute, index) { %>
    <%= attribute.fieldName %>: {
        type: DataTypes.<%= attribute.dataFunction ? `${attribute.dataFunction.toUpperCase()}(DataTypes.${attribute.dataType.toUpperCase()})` : attribute.dataType.toUpperCase()%>,
      <% if (attribute.index) {%>
          index: true,
        <% } %>
      <% if (attribute.unique) {%>
          unique: true,
        <% } %>
      <% if (attribute.notNull) {%>
          allowNull: false,
        <% } %>
      },
      <%= (Object.keys(attributes).length - 1) > index ? ',' : '' %>
    <% }) %>
  }, {
    <%= underscored ? 'underscored: true,' : '' %>
  });

  <%= name %>.associate = function(models) {
    // associations can be defined here
  };

  return <%= name %>;
};
