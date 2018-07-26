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

const sections = {
    queries: [],
    mutations: [],
    subscriptions: [],
    custom: []
};

const groupTypes = (relevantTypes, query, mutation, subscription) => {
    return relevantTypes.reduce((acc, type) => {
        switch(type.name) {
            case query.name:
                acc.queries.push(type);
                break;
            case mutation.name:
                acc.mutations.push(type);
                break;
            case subscription.name:
                acc.subscriptions.push(type);
                break;
            default:
                acc.custom.push(type);
        }
        return acc;
    }, sections);
};

const renderListView = (compiled, schemaId) => {
    const { types, queryType, mutationType, subscriptionType } = compiled.data.__schema;
    const relevantTypes = types.filter(type => wellKnownTypes.indexOf(type.name) < 0);

    const grouped = groupTypes(relevantTypes, queryType, mutationType, subscriptionType);

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
};

const renderContent = (compiled, schemaId) => (
    <div className={style["structure-content"]}>
        <div className={style["structure-header"]}>
            <span>Data Types</span>
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
            { renderListView(compiled, schemaId) }
        </div>
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
    } if (compiled) {
        return renderContent(compiled, schemaId);
    }
    return <EmptyStructureView />;
};

export { StructureView };
