import React, { Component } from "react";
import { CommonToolbar } from "../common";
import { Grid, Row, Col } from "patternfly-react";
import { Editor } from "./Editor"
import GetSchema from "../../graphql/GetSchema.graphql";
import { Query } from "react-apollo";

class SchemaContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            height: window.innerHeight - 209
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

    getToolbarButtons() {
        return [
            { title: "Export", cb: () => this.export(), id: "export_schema" }
        ];
    }

    renderContent(source) {
        return (
            <div>
                <CommonToolbar buttons={this.getToolbarButtons()} />
                <div>
                    <Grid fluid>
                        <Row>
                            <Col xs={12} md={8} className="col-schema-editor" style={{height: this.state.height}}>
                                <div className="div-schema-editor">
                                    <Editor source={source}/>
                                </div>
                            </Col>
                            <Col xs={6} md={4} className="col-schema-tree" style={{height: this.state.height}}>
                                <div className="div-schema-tree">

                                </div>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </div>
        );
    }

    render() {
        return (
            <Query query={GetSchema}>
                {({loading, error, data}) => {
                    if (loading) return (<div>Loading...</div>);
                    if (error) return (<div>{error.message}</div>);

                    const { source } = data.getSchema;

                    return this.renderContent(source);
                }}
            </Query>
        );
    }
}

export { SchemaContainer };
