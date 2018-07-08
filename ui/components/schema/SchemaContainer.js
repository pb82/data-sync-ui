import React, { Component } from "react";
import { CommonToolbar } from "../common";
import { Grid, Row, Col } from "patternfly-react";
import { Editor } from "./Editor"
import { Structure} from "./Structure";
import GetSchema from "../../graphql/GetSchema.graphql";
import UpdateSchema from "../../graphql/UpdateSchema.graphql";

import { graphql } from "react-apollo";

class SchemaContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            height: window.innerHeight - 209,
            compileError: null,
            compiledSchema: ""
        };
    }

    updateDimensions() {
        this.setState({
            height: window.innerHeight - 209
        });
    }

    componentWillMount() {
        this.updateDimensions();
    }

    componentDidMount() {
        window.addEventListener("resize", () => this.updateDimensions());
    }

    componentWillUnmount() {
        window.removeEventListener("resize", () => this.updateDimensions());
    }

    export() {
        console.log("export clicked")
    }

    onEditorSave(content) {
        this.props.mutate({
            variables:{
                source: content
            }
        }).then(({ data }) => {
            const { updateSchema: { compiled } } = data;

            this.setState({
                compileError: false,
                compiledSchema: compiled
            });
        }).catch(err => {
            this.setState({
                compileError: err,
                compiledSchema: null
            });
        })
    }

    getToolbarButtons() {
        return [
            { title: "Export", cb: () => this.export(), id: "export_schema" }
        ];
    }

    renderContent() {
        const { getSchema: { source, compiled } } = this.props.data;

        return (
            <div>
                <CommonToolbar buttons={this.getToolbarButtons()} />
                <div>
                    <Grid fluid>
                        <Row>
                            <Col xs={12} md={8} className="col-schema-editor" style={{height: this.state.height}}>
                                <div className="div-schema-editor">
                                    <Editor
                                        value={source}
                                        onSave={content => {this.onEditorSave(content)}}
                                    />
                                </div>
                            </Col>
                            <Col xs={6} md={4} className="col-schema-tree" style={{height: this.state.height}}>
                                <div className="div-schema-tree">
                                    <Structure
                                        error={this.state.compileError}
                                        schema={this.state.compiledSchema || compiled }
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </div>
        );
    }

    render() {
        if (this.props.data.loading) {
            return <div>Loading...</div>
        }

        return this.renderContent();
    }
}

export default graphql(GetSchema)(
    graphql(UpdateSchema)(SchemaContainer)
);
