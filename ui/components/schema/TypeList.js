import React, { Component } from "react";
import { Query } from "react-apollo";
import {
    ListViewItem, Grid, Row, Col, Button, Spinner
} from "patternfly-react";

import style from "./structureView.css";
import GetResolvers from "../../graphql/GetResolvers.graphql";
import { formatGraphQLField } from "./GraphQLFormatter";

class TypeList extends Component {

    renderLoading() {
        return <Spinner className="spinner" loading />;
    }

    renderError(error) {
        return <div>{error.message}</div>;
    }

    renderResolverForField(name, data) {
        const { resolvers } = data;
        const resolver = resolvers.find(item => item.field === name);
        if (resolver) {
            return <span>{resolver.DataSource.name}</span>
        }

        return <span style={{color: "lightgrey"}}>No resolver</span>;
    }

    renderFields(fields, data) {
        if (!fields) {
            // Some types won't have fields
            return <span>No fields</span>;
        }

        return fields.map(field => {
            const type = field.type.name || field.type.kind;
            return (
                <Row key={type + field.name} className={style["structure-item-row"]}>
                    <Col xs={6} md={6} style={{textAlign: "left"}}>
                        {formatGraphQLField(field)}
                    </Col>
                    <Col xs={6} md={6} style={{textAlign: "right"}}>
                        {this.renderResolverForField(field.name, data)}
                    </Col>
                </Row>
            );
        });
    }

    renderList(data) {
        const { type } = this.props;
        const subItems = this.renderFields(type.fields, data);

        return (
            <Grid fluid>
                {subItems}
            </Grid>

        );
    }

    render() {
        const { schemaId, type } = this.props;
        return (
            <Query
                query={GetResolvers}
                variables={{
                    schemaId,
                    type
                }}
            >
                {({ loading, error, data }) => {
                    if (loading) {
                        return this.renderLoading();
                    }
                    if (error) {
                        return this.renderError(error);
                    }
                    return this.renderList(data);
                }}
            </Query>
        );
    }

}

export { TypeList };
