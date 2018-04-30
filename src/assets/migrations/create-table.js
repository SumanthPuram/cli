
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('<%= tableName %>', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },

        <% attributes.forEach(function(attribute) { %>
          <%= attribute.fieldName %>: {
            type: Sequelize.<%= attribute.dataFunction ? `${attribute.dataFunction.toUpperCase()}(Sequelize.${attribute.dataType.toUpperCase()})` : attribute.dataType.toUpperCase()%>,
          <% Object.keys(attribute.customAttributes).forEach(function(key) { %>
            <%= key %>: <%= attribute.customAttributes[key] %>,
          <% }) %>
          },
        <% }) %>

        <%= createdAt %>: {
          allowNull: false,
          type: Sequelize.DATE
        },

        <%= updatedAt %>: {
          allowNull: false,
          type: Sequelize.DATE
        }
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('<%= tableName %>');
  }
};
