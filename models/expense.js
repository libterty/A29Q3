'use strict';
module.exports = (sequelize, DataTypes) => {
  const Expense = sequelize.define(
    'Expense',
    {
      name: DataTypes.STRING,
      category: DataTypes.STRING,
      date: DataTypes.STRING,
      merchant: DataTypes.STRING,
      amount: DataTypes.INTEGER
    },
    {}
  );
  Expense.associate = function(models) {
    Expense.belongsTo(models.User);
  };
  return Expense;
};
