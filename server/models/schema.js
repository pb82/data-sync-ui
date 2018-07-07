export default (sequelize, DataTypes) => {
    const Schema = sequelize.define("Schema", {
        name: DataTypes.STRING,
        source: DataTypes.STRING,
        compiled: DataTypes.JSON
    });
    return Schema;
};
