import React, { Component } from "react";
import { Query, graphql } from "react-apollo";
import {
    Alert,
    Modal,
    Icon,
    Button,
    Form,
    FormControl,
    FormGroup,
    Col,
    InputGroup,
    DropdownButton,
    MenuItem
} from "patternfly-react";
import { CodeEditor } from "../common/CodeEditor";

import GetDataSources from "../../graphql/GetDataSources.graphql";
import UpsertResolver from "../../graphql/UpsertResolver.graphql";
import GetResolvers from "../../graphql/GetResolvers.graphql";

import some from "lodash.some";

const INITIAL_STATE = {
    err: "",
    schemaId: null,
    dataSource: {
        name: ""
    },
    request: "",
    response: "",
    validations: {
        dataSource: null,
        request: null,
        response: null
    }
};

class ResolverDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {...INITIAL_STATE, schemaId: props.schemaId };
    }

    componentDidUpdate(prevProps) {
        if (this.props.selectedResolver &&
            this.props.selectedResolver !== prevProps.selectedResolver) {
            this.setState({
                ...this.state,
                request: this.props.selectedResolver.requestMapping,
                response: this.props.selectedResolver.responseMapping,
                dataSource: this.props.selectedResolver.DataSource,

                // We assume that the last edited values were valid
                validations: {
                    dataSource: "success",
                    request: "success",
                    response: "success"
                }
            });
        }
    }

    onClose() {
        this.setState(INITIAL_STATE);
        this.props.onClose();
    }

    onAdd() {
        const { schemaId, field, type, selectedResolver } = this.props;
        const id = selectedResolver ? selectedResolver.id : undefined;
        const { dataSource, request, response } = this.state;

        this.props.mutate({
            variables: {
                id,
                schemaId,
                field,
                type,
                dataSourceId: dataSource.id,
                requestMapping: request,
                responseMapping: response
            },
            refetchQueries: [{
                query: GetResolvers,
                variables: {
                    schemaId,
                    type
                }
            }]
        }).then(() => {
            this.onClose();
        }).catch(err => {
            this.setState({
                err
            });
        });
    }

    onDataSourceChanged(dataSource) {
        const dsValidation = (!!dataSource) ? "success" : "error";

        const { validations } = this.state;
        const newValidations = { ...validations, dataSource: dsValidation };

        this.setState({ dataSource, validations: newValidations });
    }

    onRequestChanged(request) {
        const resolverValidation = (request && request.length > 0) ? "success" : "error" ;

        const { validations } = this.state;
        const newValidations = { ...validations, request: resolverValidation };

        this.setState({ request, validations: newValidations });
    }

    onResponseChanged(response) {
        const responseValidation = (response && response.length > 0) ? "success" : "error";

        const { validations } = this.state;
        const newValidations = { ...validations, response: responseValidation };

        this.setState({ response, validations: newValidations});
    }

    renderDataSources(data) {
        const { dataSources } = data;
        return dataSources.map(dataSource => {
            return (<MenuItem key={dataSource.name} eventKey={dataSource}>
                {`${dataSource.name} (${dataSource.type})`}
            </MenuItem>);
        });
    }

    renderDialog(data) {
        const { visible } = this.props;
        const { dataSource, validations, err } = this.state;

        return (
            <Modal show={visible}>
                <Modal.Header>
                    <button
                        className="close"
                        aria-hidden="true"
                        onClick={() => this.onClose()}
                        aria-label="Close"
                        type="submit"
                    >
                        <Icon type="pf" name="close" />
                    </button>
                    <Modal.Title>Resolver Mapping</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Alert */}
                    {err && <Alert onDismiss={() => this.setState({ err: "" })}>{err}</Alert>}

                    <Form horizontal>
                        <FormGroup controlId="dataSource">
                            <Col sm={3}>Data Source</Col>
                            <Col sm={9}>
                                <InputGroup>
                                    <FormControl
                                        disabled
                                        style={{ backgroundColor: "#fff", color: "#363636" }}
                                        value={dataSource.name}
                                    />
                                    <InputGroup.Button>
                                        <DropdownButton
                                            bsStyle="default"
                                            id="dropdown-type"
                                            title=""
                                            onSelect={ds => this.onDataSourceChanged(ds)}
                                        >
                                            {this.renderDataSources(data)}
                                        </DropdownButton>
                                    </InputGroup.Button>
                                </InputGroup>
                            </Col>
                        </FormGroup>

                        <FormGroup controlId="request" validationState={validations.request}>
                            <Col sm={3}>Resolver</Col>
                            <Col sm={9}>
                                <div style={{
                                    height: "120px",
                                    border: "1px solid lightgrey"
                                }}>
                                    <CodeEditor
                                        value={this.state.request}
                                        onChange={r => this.onRequestChanged(r)}
                                    />
                                </div>
                            </Col>
                        </FormGroup>

                        <FormGroup controlId="response" validationState={validations.response}>
                            <Col sm={3}>Resolver</Col>
                            <Col sm={9}>
                                <div style={{
                                    height: "120px",
                                    border: "1px solid lightgrey"
                                }}>
                                    <CodeEditor
                                        value={this.state.response}
                                        onChange={r => this.onResponseChanged(r)}
                                    />
                                </div>
                            </Col>
                        </FormGroup>

                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        bsStyle="default"
                        className="btn-cancel"
                        onClick={() => this.onClose()}
                    >
                        Cancel
                    </Button>
                    <Button
                        bsStyle="primary"
                        onClick={() => this.onAdd()}
                        disabled={some(validations, s => !s || s === "error")}
                    >
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    render() {
        return (<Query query={GetDataSources} variables={{name: undefined}}>
            {({loading, error, data}) => {
                if (loading) return null;
                if (error) return null;
                return this.renderDialog(data);
            }}
        </Query>);
    }
}

const ResolverDialogWithMutation = graphql(UpsertResolver)(ResolverDialog);
export { ResolverDialogWithMutation as ResolverDialog };
