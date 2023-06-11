import Accordion from 'react-bootstrap/Accordion';

import {Col, Row} from "react-bootstrap";

/**
 * Generates a CodeBlock for a source code.
 * @param props parameters
 * @returns {JSX.Element} CodeBlock
 */
function CodeBlock(props) {

    /**
     * Calculates the color for a given value using the ratio.
     * @param ratio ratio
     * @param gas gas
     * @returns {string} color
     */
    function getRatioColor(ratio, gas) {
        if (gas > ratio.high) {
            return "rgba(255,0,0,0.76)";
        } else if (gas > ratio.mid) {
            return "rgba(255,136,0,0.85)";
        } else if (gas > ratio.low) {
            return "rgba(255,242,0,0.85)";
        } else {
            return "rgba(64,255,0,0.88)";
        }
    }

    /**
     * Creates a separate code tag for each line in the source code. The analyzed gas costs are displayed in color.
     * @param props parameters
     * @returns {*[]}
     */
    function codeLine(props) {
        let sourceCodeArray = props.content.split("\n");
        let ratio = props.ratio;
        let isProxy = props.transactionFunction["isProxy"];
        let functionFileID = props.transactionFunction["functionFileID"];
        let functionLine = props.transactionFunction["functionLine"];
        let calledContract = props.id === functionFileID;

        let result = [];

        for (let i = 0; i < sourceCodeArray.length; i++) {
            let isCalledLine = calledContract && ((i + 1) === functionLine);
            let code;

            // If the line appeared in the anaylse, it will be colored.
            if (props.analysed.get((i + 1).toString()) !== undefined) {
                let color = getRatioColor(ratio, props.analysed.get((i + 1).toString()));

                code = (<Col >
                        <code style={{background: color, color: "black", float: "left"}}>
                            {sourceCodeArray[i] + "\n"}
                        </code>
                    </Col>
                )

            } else {
                code = (<Col md="9">
                    <code style={{background: "rgba(255,0,0,0)", color: "black", float: "left"}}>
                        {sourceCodeArray[i] + "\n"}
                    </code>
                </Col>)
            }

            let gas;
            let functionCall = "";

            // Displays the gas cost.
            if (props.analysed.get((i + 1).toString()) !== undefined) {
                let color = getRatioColor(ratio, props.analysed.get((i + 1).toString()));

                gas = (
                    <Col md="2" className="noselect" style={{display:'flex', justifyContent:'left'}}>
                        <span style={{background: color, float: "left"}}>
                            Gas: {props.analysed.get((i + 1).toString())}
                        </span>
                    </Col>
                )

                // Displays the initial cost if it is not a proxy contract.
                if (isCalledLine) {
                    functionCall = (
                        <Col md="2" className="noselect" style={{display:'flex', justifyContent:'right'}}>
                            <span style={{background: "rgba(42,117,255,0.66)", float: "left"}}>
                                Contract Call: {props.initialTransactionCost}
                            </span>
                        </Col>
                    )
                }
            }

            result.push(
                <Row key={i + "row"}>
                    <Col md="auto">
                    <span className="noselect" style={{
                        display: "inline-block",
                        width: "4em",
                        textAlign: "right",
                        float: "left",
                    }}>{i + 1}.</span>
                    </Col>
                    {code}
                    {functionCall}
                    {gas}
                </Row>);
        }

        result = result.slice(0, -1);
        return result;
    }

    return (
        <Accordion.Item key={props.id + "accordion"} eventKey={props.id.toString()}>
            <Accordion.Header>
                {props.name}
            </Accordion.Header>
            <Accordion.Body>
                <pre className="code">
                    {codeLine(props)}
                </pre>
            </Accordion.Body>
        </Accordion.Item>
    );
}

export default CodeBlock