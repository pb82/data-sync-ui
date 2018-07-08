import React from "react";
import { ListView, ListViewItem, Row, Col } from "patternfly-react";

// Graphql internal types
const wellKnownTypes = [
    "String",
    "Boolean",
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
        return fields.map((field, index) => {
            return (
                <Row key={index}>
                    <Col sm={11}>
                        {field.name}
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
                style={{borderBottom: "1px solid lightgrey"}}
                className="structure-list-item"
                leftContent={<span className="structure-name">{type.name}</span>}
                description={<span className="structure-name">{type.fields.length} field(s)</span>}
            >
                {subItems}
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

    renderContent() {
        if (this.props.error) {
            return <div>
                {this.props.error.message}
            </div>;
        } else {
            if (this.props.schema) {
                const types = JSON.parse(this.props.schema).data.__schema.types.filter(type => {
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
                    <a className="ag-link" target="_blank" href="https://docs.aerogear.org">Learn more 🛈</a>
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
