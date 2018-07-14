import React, { Component } from "react";
import { Query } from "react-apollo";
import {
    ListViewItem, Grid, Row, Col
} from "patternfly-react";
import { ResolverDialog } from "./ResolverDialog";

import style from "./structureView.css";
import GetResolvers from "../../graphql/GetResolvers.graphql";

class TypeList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedResolver: {},
            showModal: false,
            fieldName: ""
        };
    }

    deleteResolver(resolver) {
    }

    editResolver(resolver) {
        console.log("selected resolver");
        console.log(resolver.responseMapping);

        this.setState({
            showModal: true,
            selectedResolver: resolver,
            fieldName: resolver.field
        });
    }

    createResolver(fieldName) {
        this.setState({
            fieldName,
            showModal: true,
            selectedResolver: {
                dataSource: {
                    name: ""
                }
            }
        });
    }

    renderLoading() {
        return <div>Loading</div>;
    }

    renderError(error) {
        return <div>{error.message}</div>;
    }

    renderAdditionalInfo(type) {
        const { fields } = type;
        if (!fields) {
            return "n.a.";
        }
        return type.fields.length + (type.fields.length > 1 ? " fields" : " field");
    }

    renderResolverForField(name, data) {
        const { resolvers } = data;
        const resolver = resolvers.find(item => item.field === name);

        if (resolver) {
            return (
                <div style={{ textAlign: "center" }}>
                    <span
                        role="button"
                        style={{ width: "100%", textAlign: "center", cursor: "pointer", display: "inline" }}
                        className="pficon pficon-delete"
                        onClick={() => this.deleteResolver(resolver)}
                    />
                    <span
                        style={{
                            width: "100%",
                            textAlign: "center",
                            cursor: "pointer",
                            display: "inline",
                            marginLeft: "5px"
                        }}
                        role="button"
                        className="pficon pficon-edit"
                        onClick={() => this.editResolver(resolver)}
                    />
                </div>
            );
        }

        return (
            <span
                style={{ width: "100%", textAlign: "center", cursor: "pointer" }}
                className="pficon pficon-add-circle-o"
                role="button"
                onClick={() => this.createResolver(name)}
            />
        );
    }

    renderFields(fields, data) {
        if (!fields) {
            // Some types won't have fields
            return <span>No fields</span>;
        }

        return fields.map(field => {
            const key = field.type.name || field.type.kind;
            return (
                <Row key={key + field.name} className={style["structure-item-row"]}>
                    <Col xs={6} md={4}>
                        {field.name}
                    </Col>
                    <Col xs={6} md={4}>
                        {key}
                    </Col>
                    <Col xs={6} md={4}>
                        {this.renderResolverForField(field.name, data)}
                    </Col>
                </Row>
            );
        });
    }

    renderList(data) {
        const type = this.props.type;
        const subItems = this.renderFields(type.fields, data);

        return (
            <ListViewItem
                key={type.name}
                leftContent={<p className={style["structure-name"]}>{type.name}</p>}
                description={<span />}
                additionalInfo={[
                    <p key={type.name} className={style["structure-name"]}>
                        {this.renderAdditionalInfo(type)}
                    </p>]}
            >
                <Grid fluid>
                    <Row className={style["structure-field-row"]}>
                        <Col xs={6} md={4}>
                            Field Name
                        </Col>
                        <Col xs={6} md={4}>
                            Field Type
                        </Col>
                        <Col xs={6} md={4}>
                            Resolver
                        </Col>
                    </Row>
                    {subItems}
                    <ResolverDialog
                        id={this.state.selectedResolver.id}
                        type={this.props.type.name}
                        field={this.state.fieldName}
                        schemaId={this.props.schemaId}
                        request={this.state.selectedResolver.requestMapping}
                        response={this.state.selectedResolver.responseMapping}
                        dataSource={this.state.selectedResolver.DataSource}
                        visible={this.state.showModal}
                        onClose={() => {
                            this.setState({ showModal: false });
                        }}
                    />
                </Grid>
            </ListViewItem>
        );
    }

    render() {
        return (
            <Query
                query={GetResolvers}
                variables={{
                    schemaId: this.props.schemaId,
                    type: this.props.type.name
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
