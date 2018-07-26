import React from "react";
import { Alert, ListView } from "patternfly-react";
import { EmptyStructureView } from "./EmptyStructureView";
import { TypeList } from "./TypeList";

import style from "./structureView.css";

// Graphql internal types that we don't want to render
const wellKnownTypes = [
    "String",
    "Boolean",
    "Int",
    "ID",
    "__Schema",
    "__Type",
    "__TypeKind",
    "__Field",
    "__InputValue",
    "__EnumValue",
    "__Directive",
    "__DirectiveLocation"
];

const groupTypes = (relevantTypes, query, mutation, subscription) => relevantTypes.reduce((acc, type) => {
    switch (type.name) {
        case query.name:
            type.isQuery = true;
            acc.queries.push(type);
            break;
        case mutation.name:
            type.isMutation = true;
            acc.mutations.push(type);
            break;
        case subscription.name:
            type.isSubscription = true;
            acc.subscriptions.push(type);
            break;
        default:
            type.isCustom = true;
            acc.custom.push(type);
            break;
    }
    return acc;
}, {
    queries: [],
    mutations: [],
    subscriptions: [],
    custom: []
});

const renderQueries = (queries, schemaId) => (
    <React.Fragment>
        <div className={style["structure-header"]}>
            <span>Queries</span>
            <a
                className={style["ag-link"]}
                target="_blank"
                rel="noopener noreferrer"
                href="https://docs.aerogear.org"
            >
                {"Learn more \u2139"}
            </a>
        </div>
        <div>
            <ListView>
                {
                    queries.map(type => (
                        <TypeList
                            key={type.name}
                            schemaId={schemaId}
                            type={type}
                        />
                    ))
                }
            </ListView>

        </div>
    </React.Fragment>
);

const renderListView = (compiled, schemaId) => {
    const { types, queryType, mutationType, subscriptionType } = compiled.data.__schema;
    const relevantTypes = types.filter(type => wellKnownTypes.indexOf(type.name) < 0);
    const grouped = groupTypes(relevantTypes, queryType, mutationType, subscriptionType);
    return renderQueries(grouped.queries, schemaId);

    /*
    return (
        <ListView>
            {
                relevantTypes.map(type => (
                    <TypeList
                        key={type.name}
                        schemaId={schemaId}
                        type={type}
                    />
                ))
            }
        </ListView>
    );
    */
};

const renderContent = (compiled, schemaId) => (
    <div className={style["structure-content"]}>
        {renderListView(compiled, schemaId)}
    </div>
);

const renderError = error => {
    const { message } = error;
    return (<Alert className={style.alertBox}>{message}</Alert>);
};

const StructureView = props => {
    const { error, compiled, schemaId } = props;
    if (error) {
        return renderError(error);
    }
    if (compiled) {
        return renderContent(compiled, schemaId);
    }
    return <EmptyStructureView />;
};

export { StructureView };
