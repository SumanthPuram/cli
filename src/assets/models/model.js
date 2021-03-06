
module.exports = (sequelize, DataTypes) => {
  const <%= name %> = sequelize.define('<%= name %>', {
    <% attributes.forEach(function(attribute) { %>
    <%= attribute.fieldName %>: {
        type: DataTypes.<%= attribute.dataFunction ? `${attribute.dataFunction.toUpperCase()}(DataTypes.${attribute.dataType.toUpperCase()})` : attribute.dataType.toUpperCase()%>,
      <% Object.keys(attribute.customAttributes).forEach(function(key) { %>
        <%= key %>: <%= attribute.customAttributes[key] %>,
        <% }) %>
      },
    <% }) %>
  }, {
    <%= underscored ? 'underscored: true,' : '' %>
  });

  <%= name %>.associate = (models) => {
    // associations can be defined here
  };

  return <%= name %>;
};
