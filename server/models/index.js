const { Sequelize } = require("sequelize");
const { createDatabase, supportsiLike } = require("./database");
const DataSourceModel = require("./dataSource");
const SchemaModel = require("./schema");
const ResolverModel = require("./resolver");

const database = createDatabase();
const dataSource = DataSourceModel(database, Sequelize);
const schema = SchemaModel(database, Sequelize);
const resolver = ResolverModel(database, Sequelize);

resolver.belongsTo(dataSource, {
    onDelete: "cascade",
    foreignKey: {
        allowNull: false
    }
});

const sync = () => database.sync({ force: false });

module.exports = {
    database,
    dataSource,
    resolver,
    sync,
    schema,
    supportsiLike
};
