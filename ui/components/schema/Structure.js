import React from "react";
import { ListView, ListViewItem, Row, Col, Grid, Button, Alert } from "patternfly-react";

// Graphql internal types
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

class Structure extends React.Component {
    constructor(props) {
        super(props);
        this.renderType = this.renderType.bind(this);
    }

    renderFields(fields) {
        if (!fields) {
            return <div></div>;
        }

        return fields.map((field, index) => {
            return (
                <Row key={index}>
                    <Col xs={6} md={4}>
                        {field.name}
                    </Col>
                    <Col xs={6} md={4}>
                        {field.type.name || field.type.kind}
                    </Col>
                    <Col md={4}>
                        <Button style={{width: "100%"}}>Add Resolver</Button>
                    </Col>
                </Row>
            );
        });
    }

    renderType(type, index) {
        const subItems = this.renderFields(type.fields);

        function getFieldsText(type) {
            const fields = type.fields;
            if (!fields) return "---";
            return type.fields.length + (type.fields.length > 1 ? " fields" : " field");
        }

        return (
            <ListViewItem
                key={index}
                className="structure-list-item"
                leftContent={<p style={{width: "64px"}} className="structure-name">{type.name}</p>}
                description={<span></span>}
                additionalInfo={<p className="structure-name">{getFieldsText(type)}</p>}
            >
                <Grid fluid>
                <Row className="structure-field-row">
                    <Col xs={6} md={4}>
                        Field Name
                    </Col>
                    <Col xs={6} md={4}>
                        Field Type
                    </Col>
                    <Col md={4}>
                        Resolver
                    </Col>
                </Row>
                {subItems}
                </Grid>
            </ListViewItem>
        )
    }

    renderStructureView(types) {
        return (<div>
            <ListView>
                {
                    types.map(this.renderType)
                }
            </ListView>
        </div>);
    }

    renderError(message) {
        return <div>
                <Alert style={{marginTop: "15px"}}>
                    {message}
                </Alert>
            </div>;
    }

    renderContent() {
        if (this.props.error) {
            return this.renderError(this.props.error.message);
        } else {
            if (this.props.schema) {
                const parsed = JSON.parse(this.props.schema);
                if (parsed.errors) {
                    const message = parsed.errors.map(error => {
                        return error.message;
                    });

                    return this.renderError(message);
                }

                const types = parsed.data.__schema.types.filter(type => {
                    return wellKnownTypes.indexOf(type.name) < 0;
                });

                return this.renderStructureView(types);
            } else {
                return <div></div>
            }
        }
    }

    render() {
        return (
            <div className="structure-content">
                <div className="structure-header">
                    <span>Data Types</span>
                    <a className="ag-link" target="_blank" href="https://docs.aerogear.org">
                        {"Learn more \u2139"}
                    </a>
                </div>
                <div>
                    {
                        this.renderContent()
                    }
                </div>
            </div>
        )
    }
}

export { Structure };
