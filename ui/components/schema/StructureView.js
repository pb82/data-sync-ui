import React, { Component } from "react";
import {
    Alert, ListView, ListViewItem, Grid, Row, Col
} from "patternfly-react";
import { EmptyStructureView } from "./EmptyStructureView";
import style from "./structureView.css";

// Graphql internal types that we don't want to render
const wellKnownTypes = [
    "String",
    "Boolean",
    "Int",
    "__Schema",
    "__Type",
    "__TypeKind",
    "__Field",
    "__InputValue",
    "__EnumValue",
    "__Directive",
    "__DirectiveLocation"
];

class StructureView extends Component {

    renderEmpty() {
        return <EmptyStructureView />;
    }

    renderAdditionalInfo(type) {
        const { fields } = type;
        if (!fields) {
            return "n.a.";
        }
        return type.fields.length + (type.fields.length > 1 ? " fields" : " field");
    }

    renderFields(fields) {
        if (!fields) {
            // Some types won't have fields
            return <div />;
        }

        return fields.map((field, index) => {
            const key = field.type.name || field.type.kind;
            return (
                <Row key={key + index} className={style["structure-item-row"]}>
                    <Col xs={6} md={6}>
                        {field.name}
                    </Col>
                    <Col xs={6} md={6}>
                        {key}
                    </Col>
                </Row>
            );
        });
    }

    renderType(type, index) {
        const subItems = this.renderFields(type.fields);
        return (
            <ListViewItem
                key={index}
                className={style["structure-list-item"]}
                leftContent={<p className={style["structure-name"]}>{type.name}</p>}
                description={<span />}
                additionalInfo={[
                    <p key={type.name} className={style["structure-name"]}>
                        {this.renderAdditionalInfo(type)}
                    </p>]}
            >
                <Grid fluid>
                    <Row className={style["structure-field-row"]}>
                        <Col xs={6} md={6}>
                              Field Name
                        </Col>
                        <Col xs={6} md={6}>
                              Field Type
                        </Col>
                    </Row>
                    {subItems}
                </Grid>
            </ListViewItem>
        );
    }

    renderListView() {
        const { types } = this.props.compiled.data.__schema;
        const relevantTypes = types.filter(type => wellKnownTypes.indexOf(type.name) < 0);

        return (
            <ListView>
                {
                    relevantTypes.map((type, index) => this.renderType(type, index))
                }
            </ListView>
        );
    }

    renderContent() {
        return (
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
                    { this.renderListView() }
                </div>
            </div>
        );
    }

    renderError() {
        const { message } = this.props.error;
        return (<Alert className={style.alertBox}>{message}</Alert>);
    }

    render() {
        if (this.props.error) {
            return this.renderError();
        } if (this.props.compiled) {
            return this.renderContent();
        }
        return this.renderEmpty();
    }

}

export { StructureView };
