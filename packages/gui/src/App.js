import './App.css';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import 'bootstrap/dist/css/bootstrap.min.css';

import {analyzeTransaction} from "./services/TransactionService";
import {useState} from "react";
import {Accordion, Alert, Col, Container, ListGroup, Row} from "react-bootstrap";
import NavbarTop from "./components/NavbarTop";
import CodeBlock from "./components/CodeBlock";
import {ClimbingBoxLoader} from "react-spinners";

export default function App(props) {
    const [loadingInProgress, setLoading] = useState(false);
    const [disable, setDisable] = useState(false);
    const [message, setMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);

    /**
     * Value of the text box
     */
    const [value, setValue] = useState(""),
        onInput = ({target: {value}}) => setValue(value),

        // After pressing the analyzing button, call analyzeTransactionButton with the transaction hash
        onFormSubmit = e => {
            setLoading(true);
            setDisable(true);
            setMessage("");
            setShowAlert(false);

            e.currentTarget.disabled = true;
            e.preventDefault();

            console.log(value);

            analyzeTransactionButton(value).then(e => {
                setLoading(false);
                setDisable(false);
            });
        }

    /**
     * Calculate the ratio of gas consumption.
     * @param traceCosts total costs
     * @returns {{high: number, low: number, mid: number}}
     */
    function calculateRatio(traceCosts) {
        let low = traceCosts * (2/100);
        let mid = traceCosts * (10/100);
        let high = traceCosts * (15/100);

        return({low, mid, high});
    }

    /**
     * Generates the transaction parameters
     * @param transactionFunction transaction function
     * @returns {*[]}
     */
    function parameter (transactionFunction) {
        console.log(transactionFunction)
        let result = [];
        if (transactionFunction.functionParameter.length > 0) {
            for (let i = 0; i < transactionFunction.functionParameter.length; i++) {
                result.push(
                    <ListGroup.Item variant="secondary">
                        {transactionFunction.functionParameter[i]}
                    </ListGroup.Item>
                );
            }
        }
        return result;
    }

    /**
     * Sends the transaction hash to the api and displays the result.
     * @param txHash transaction hash
     * @returns {Promise<void>}
     */
    async function analyzeTransactionButton(txHash) {
        let codeArray = [];
        let result = await analyzeTransaction(txHash);
        console.log(result);

        if (result["error"] !== null) {
            console.log(result["error"]);
            setMessage(result["error"]);
            setShowAlert(true);
            return;
        }

        if (result["analysed"] === null) {
            console.log("Invalid response");
            return;
        }

        let analysed = result["analysed"];
        let details = result["details"];
        let hashLink = "https://etherscan.io/tx/" + details["txHash"];
        let contractLink = "https://etherscan.io/address/" + details["contractHash"];
        let ratio = calculateRatio(details["traceCosts"]);

        let opened = []

        // A CodeBlock is created for each source code.
        for (let source in analysed) {
            let analysedMap = new Map();

            for (let line in analysed[source].analysed) {
                analysedMap.set(line, analysed[source].analysed[line]);
            }

            codeArray.push(<CodeBlock key={analysed[source].id} content={analysed[source].content}
                                      name={analysed[source].name} analysed={analysedMap}
                                      id={analysed[source].id} ratio={ratio}
                                      transactionFunction={details["transactionFunction"]}
                                      initialTransactionCost={details["initialTransactionCost"]}></CodeBlock>);

            if (analysedMap.size > 0) {
                opened.push(analysed[source].id.toString());
            }
        }

        // Show result
        props.root.render(
            <div className="App">
                <NavbarTop/>
                <div>
                    <Container id="search" fluid="md">
                        <br/>
                        <Row className="justify-content-center">
                            <Col md="12">
                                <ListGroup>
                                    <ListGroup.Item variant="success">
                                        Transaction: <a href={hashLink} target="_blank"
                                                        rel="noreferrer">{details["txHash"]}</a>
                                    </ListGroup.Item>
                                    <ListGroup.Item variant="primary">
                                        Contract: <a href={contractLink} target="_blank"
                                                      rel="noreferrer">{details["contractHash"]}</a>
                                    </ListGroup.Item>
                                    <ListGroup.Item>

                                    </ListGroup.Item>
                                    <ListGroup.Item variant="success">
                                        Name: {details["contractName"]}
                                    </ListGroup.Item>
                                    <ListGroup.Item variant="secondary">
                                        Compiler version: {details["compilerVersion"]}
                                    </ListGroup.Item>
                                    <ListGroup.Item variant="secondary">
                                        Optimizer: {details["optimizer"].toString()}
                                    </ListGroup.Item>
                                    <ListGroup.Item variant="secondary">
                                        Runs: {details["runs"]}
                                    </ListGroup.Item>
                                    <ListGroup.Item>

                                    </ListGroup.Item>
                                    <ListGroup.Item variant="dark">
                                        Function: {details["transactionFunction"]["functionSignature"]}
                                    </ListGroup.Item>

                                    {parameter(details["transactionFunction"])}

                                    <ListGroup.Item variant="dark">
                                        Proxy: {details["transactionFunction"]["isProxy"].toString()}
                                    </ListGroup.Item>
                                    <ListGroup.Item>

                                    </ListGroup.Item>
                                    <ListGroup.Item variant="secondary">
                                        Initial Transaction costs: {details["initialTransactionCost"]}
                                    </ListGroup.Item>
                                    <ListGroup.Item variant="dark">
                                        Trace costs: {details["traceCosts"]}
                                    </ListGroup.Item>
                                    <ListGroup.Item variant="warning">
                                        Gas costs: {details["gasCosts"]}
                                    </ListGroup.Item>
                                    <ListGroup.Item variant="success">
                                        Refunded: {details["refund"]}
                                    </ListGroup.Item>
                                    <ListGroup.Item variant="danger">
                                        Total gas costs: {details["totalCosts"]}
                                    </ListGroup.Item>
                                </ListGroup>
                                <br/>
                            </Col>
                        </Row>
                        <br/>
                    </Container>
                    <Container id="sourceCode" fluid="md">
                        <Accordion defaultActiveKey={opened} alwaysOpen>
                            {codeArray}
                        </Accordion>
                        <br/>
                    </Container>
                </div>
            </div>
        );
    }

    // Default website
    return (
        <div>
            <NavbarTop/>
            <div className="centered">
                <Container fluid="md">

                    <br/>
                    <Row className="justify-content-center">
                        <Col xs lg="2"></Col>
                        <Col md="8">
                            <Form onSubmit={onFormSubmit}>
                                <Row className="p-2">
                                    <Col className="mw-auto p-2">
                                        <Form.Control type="text" onChange={onInput} value={value || ""}
                                                      placeholder="Transaction Hash"/>
                                    </Col>
                                    <Col className="p-2" md="auto ">
                                        <Button variant="primary" type="submit" disabled={disable}>Analyze
                                            Transaction</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                        <Col xs lg="2"></Col>
                    </Row>

                    <Row className="justify-content-center">
                        <Col md="8">
                            <Alert className="text-center" key="message" variant="danger"
                                   show={showAlert}>{message["message"]}</Alert>
                            <br/>
                            <div className="d-flex align-items-center justify-content-center ">
                                <ClimbingBoxLoader color={'rgb(0,95,203)'} loading={loadingInProgress} size={30}/>
                            </div>
                        </Col>

                    </Row>
                </Container>
            </div>
        </div>
    );
}
