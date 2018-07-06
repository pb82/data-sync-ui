import React, { Component } from "react";
import { CommonToolbar } from "../common";
import { Grid, Row, Col } from "patternfly-react";

class SchemaContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            height: window.innerHeight - 210
        };
    }

    updateDimensions() {
        console.log(window.innerHeight);
        this.setState({
            height: window.innerHeight - 210
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

    render() {
        return (
            <div>
                <CommonToolbar buttons={this.getToolbarButtons()} />
                <div>
                    <Grid fluid>
                        <Row>
                            <Col xs={12} md={8} className="col-schema-editor" style={{height: this.state.height}}>
                                <div className="div-schema-editor">

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
}

export { SchemaContainer };
