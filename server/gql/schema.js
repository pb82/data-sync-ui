import { buildSchema } from "graphql";
import { info } from "../logger";
import { dataSource, schema } from "../models";
import { compileSchemaString } from "./helper";

const Schema = buildSchema(`
    enum DataSourceType {
        InMemory,
        Postgres
    },
    type Query {
        dataSources: [DataSource],
        getOneDataSource(id: Int!): DataSource
        getSchema: Schema
    },
    type Mutation {
        createDataSource(name: String!, type: DataSourceType!, config: String!): DataSource
        deleteDataSource(id: Int!): DataSource
        updateDataSource(id: Int!, name: String!, type: DataSourceType!, config: String!): DataSource
        updateSchema(source: String!): Schema        
    },  
    type DataSource {
        id: Int!
        name: String!
        type: DataSourceType! 
        config: String!
    },
    type Schema {
        id: Int!
        name: String!
        source: String!
        compiled: String!
    }
`);

const createDataSource = ({ name, type, config }) => {
    info("createDataSource request");
    return dataSource.create({
        name,
        type,
        config
    });
};

const listDataSources = () => {
    info("listDataSources request");
    return dataSource.findAll();
};

const getOneDataSource = ({ id }) => {
    info("getOneDataSource request");
    return dataSource.findById(id);
};

const deleteDataSource = ({ id }) => {
    info(`deleteDataSource request for id ${id}`);
    return dataSource.findById(id)
        .then(foundDataSource => {
            if (!foundDataSource) {
                return null;
            }
            return foundDataSource.destroy({ force: true }); // eslint-disable-line
        });
};

const updateDataSource = ({ id, name, type, config }) => {
    info("updateDataSource request");
    return dataSource.findById(id).then(foundDataSource => foundDataSource.update({
        name,
        type,
        config
    }));
};

const getSchema = () => {
    info("getSchema request");
    return schema.findOrCreate({
        where: { name: "default" },
        defaults: {
            source: "# Your Schema goes here",
            compiled: ""
        }
    }).spread((defaultSchema, created) => {
        if (created) {
            info("Created default schema");
        }
        return defaultSchema;
    });
};

const updateSchema = ({ source }) => {
    info("updateSchema request");

    return compileSchemaString(source).then(compiled => {
        return getSchema().then(schema => {
            return schema.update({
                source: source,
                compiled: JSON.stringify(compiled)
            });
        });
    });
};

const root = {
    dataSources: listDataSources,
    createDataSource,
    getOneDataSource,
    deleteDataSource,
    updateDataSource,
    updateSchema,
    getSchema
};

export { Schema, root };
