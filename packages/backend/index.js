require('dotenv').config()

const Web3 = require('web3');
const solc = require('solc');

const nodeUrl = process.env.ARCHIVE_NODE_URL;
const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
const logLevel = process.env.LOG_LEVEL;

const Opcode = new Map([[0, "STOP"], [1, "ADD"], [2, "MUL"], [3, "SUB"], [4, "DIV"], [5, "SDIV"], [6, "MOD"], [7, "SMOD"], [8, "ADDMOD"], [9, "MULMOD"], [10, "EXP"], [11, "SIGNEXTEND"], [12, "UNRECOGNIZED_0C"], [13, "UNRECOGNIZED_0D"], [14, "UNRECOGNIZED_0E"], [15, "UNRECOGNIZED_0F"], [16, "LT"], [17, "GT"], [18, "SLT"], [19, "SGT"], [20, "EQ"], [21, "ISZERO"], [22, "AND"], [23, "OR"], [24, "XOR"], [25, "NOT"], [26, "BYTE"], [27, "SHL"], [28, "SHR"], [29, "SAR"], [30, "UNRECOGNIZED_1E"], [31, "UNRECOGNIZED_1F"], [32, "SHA3"], [33, "UNRECOGNIZED_21"], [34, "UNRECOGNIZED_22"], [35, "UNRECOGNIZED_23"], [36, "UNRECOGNIZED_24"], [37, "UNRECOGNIZED_25"], [38, "UNRECOGNIZED_26"], [39, "UNRECOGNIZED_27"], [40, "UNRECOGNIZED_28"], [41, "UNRECOGNIZED_29"], [42, "UNRECOGNIZED_2A"], [43, "UNRECOGNIZED_2B"], [44, "UNRECOGNIZED_2C"], [45, "UNRECOGNIZED_2D"], [46, "UNRECOGNIZED_2E"], [47, "UNRECOGNIZED_2F"], [48, "ADDRESS"], [49, "BALANCE"], [50, "ORIGIN"], [51, "CALLER"], [52, "CALLVALUE"], [53, "CALLDATALOAD"], [54, "CALLDATASIZE"], [55, "CALLDATACOPY"], [56, "CODESIZE"], [57, "CODECOPY"], [58, "GASPRICE"], [59, "EXTCODESIZE"], [60, "EXTCODECOPY"], [61, "RETURNDATASIZE"], [62, "RETURNDATACOPY"], [63, "EXTCODEHASH"], [64, "BLOCKHASH"], [65, "COINBASE"], [66, "TIMESTAMP"], [67, "NUMBER"], [68, "DIFFICULTY"], [69, "GASLIMIT"], [70, "CHAINID"], [71, "SELFBALANCE"], [72, "BASEFEE"], [73, "UNRECOGNIZED_49"], [74, "UNRECOGNIZED_4A"], [75, "UNRECOGNIZED_4B"], [76, "UNRECOGNIZED_4C"], [77, "UNRECOGNIZED_4D"], [78, "UNRECOGNIZED_4E"], [79, "UNRECOGNIZED_4F"], [80, "POP"], [81, "MLOAD"], [82, "MSTORE"], [83, "MSTORE8"], [84, "SLOAD"], [85, "SSTORE"], [86, "JUMP"], [87, "JUMPI"], [88, "PC"], [89, "MSIZE"], [90, "GAS"], [91, "JUMPDEST"], [92, "UNRECOGNIZED_5C"], [93, "UNRECOGNIZED_5D"], [94, "UNRECOGNIZED_5E"], [95, "UNRECOGNIZED_5F"], [96, "PUSH1"], [97, "PUSH2"], [98, "PUSH3"], [99, "PUSH4"], [100, "PUSH5"], [101, "PUSH6"], [102, "PUSH7"], [103, "PUSH8"], [104, "PUSH9"], [105, "PUSH10"], [106, "PUSH11"], [107, "PUSH12"], [108, "PUSH13"], [109, "PUSH14"], [110, "PUSH15"], [111, "PUSH16"], [112, "PUSH17"], [113, "PUSH18"], [114, "PUSH19"], [115, "PUSH20"], [116, "PUSH21"], [117, "PUSH22"], [118, "PUSH23"], [119, "PUSH24"], [120, "PUSH25"], [121, "PUSH26"], [122, "PUSH27"], [123, "PUSH28"], [124, "PUSH29"], [125, "PUSH30"], [126, "PUSH31"], [127, "PUSH32"], [128, "DUP1"], [129, "DUP2"], [130, "DUP3"], [131, "DUP4"], [132, "DUP5"], [133, "DUP6"], [134, "DUP7"], [135, "DUP8"], [136, "DUP9"], [137, "DUP10"], [138, "DUP11"], [139, "DUP12"], [140, "DUP13"], [141, "DUP14"], [142, "DUP15"], [143, "DUP16"], [144, "SWAP1"], [145, "SWAP2"], [146, "SWAP3"], [147, "SWAP4"], [148, "SWAP5"], [149, "SWAP6"], [150, "SWAP7"], [151, "SWAP8"], [152, "SWAP9"], [153, "SWAP10"], [154, "SWAP11"], [155, "SWAP12"], [156, "SWAP13"], [157, "SWAP14"], [158, "SWAP15"], [159, "SWAP16"], [160, "LOG0"], [161, "LOG1"], [162, "LOG2"], [163, "LOG3"], [164, "LOG4"], [165, "UNRECOGNIZED_A5"], [166, "UNRECOGNIZED_A6"], [167, "UNRECOGNIZED_A7"], [168, "UNRECOGNIZED_A8"], [169, "UNRECOGNIZED_A9"], [170, "UNRECOGNIZED_AA"], [171, "UNRECOGNIZED_AB"], [172, "UNRECOGNIZED_AC"], [173, "UNRECOGNIZED_AD"], [174, "UNRECOGNIZED_AE"], [175, "UNRECOGNIZED_AF"], [176, "UNRECOGNIZED_B0"], [177, "UNRECOGNIZED_B1"], [178, "UNRECOGNIZED_B2"], [179, "UNRECOGNIZED_B3"], [180, "UNRECOGNIZED_B4"], [181, "UNRECOGNIZED_B5"], [182, "UNRECOGNIZED_B6"], [183, "UNRECOGNIZED_B7"], [184, "UNRECOGNIZED_B8"], [185, "UNRECOGNIZED_B9"], [186, "UNRECOGNIZED_BA"], [187, "UNRECOGNIZED_BB"], [188, "UNRECOGNIZED_BC"], [189, "UNRECOGNIZED_BD"], [190, "UNRECOGNIZED_BE"], [191, "UNRECOGNIZED_BF"], [192, "UNRECOGNIZED_C0"], [193, "UNRECOGNIZED_C1"], [194, "UNRECOGNIZED_C2"], [195, "UNRECOGNIZED_C3"], [196, "UNRECOGNIZED_C4"], [197, "UNRECOGNIZED_C5"], [198, "UNRECOGNIZED_C6"], [199, "UNRECOGNIZED_C7"], [200, "UNRECOGNIZED_C8"], [201, "UNRECOGNIZED_C9"], [202, "UNRECOGNIZED_CA"], [203, "UNRECOGNIZED_CB"], [204, "UNRECOGNIZED_CC"], [205, "UNRECOGNIZED_CD"], [206, "UNRECOGNIZED_CE"], [207, "UNRECOGNIZED_CF"], [208, "UNRECOGNIZED_D0"], [209, "UNRECOGNIZED_D1"], [210, "UNRECOGNIZED_D2"], [211, "UNRECOGNIZED_D3"], [212, "UNRECOGNIZED_D4"], [213, "UNRECOGNIZED_D5"], [214, "UNRECOGNIZED_D6"], [215, "UNRECOGNIZED_D7"], [216, "UNRECOGNIZED_D8"], [217, "UNRECOGNIZED_D9"], [218, "UNRECOGNIZED_DA"], [219, "UNRECOGNIZED_DB"], [220, "UNRECOGNIZED_DC"], [221, "UNRECOGNIZED_DD"], [222, "UNRECOGNIZED_DE"], [223, "UNRECOGNIZED_DF"], [224, "UNRECOGNIZED_E0"], [225, "UNRECOGNIZED_E1"], [226, "UNRECOGNIZED_E2"], [227, "UNRECOGNIZED_E3"], [228, "UNRECOGNIZED_E4"], [229, "UNRECOGNIZED_E5"], [230, "UNRECOGNIZED_E6"], [231, "UNRECOGNIZED_E7"], [232, "UNRECOGNIZED_E8"], [233, "UNRECOGNIZED_E9"], [234, "UNRECOGNIZED_EA"], [235, "UNRECOGNIZED_EB"], [236, "UNRECOGNIZED_EC"], [237, "UNRECOGNIZED_ED"], [238, "UNRECOGNIZED_EE"], [239, "UNRECOGNIZED_EF"], [240, "CREATE"], [241, "CALL"], [242, "CALLCODE"], [243, "RETURN"], [244, "DELEGATECALL"], [245, "CREATE2"], [246, "UNRECOGNIZED_F6"], [247, "UNRECOGNIZED_F7"], [248, "UNRECOGNIZED_F8"], [249, "UNRECOGNIZED_F9"], [250, "STATICCALL"], [251, "UNRECOGNIZED_FB"], [252, "UNRECOGNIZED_FC"], [253, "REVERT"], [254, "INVALID"], [255, "SELFDESTRUCT"]]);

const Logger = new Map([[0, "INFO"], [1, "ERROR"], [2, "CRITICAL"], [3, "DEBUG"]]);

const JumpType = {
    NOT_JUMP: 0, INTO_FUNCTION: 1, OUTOF_FUNCTION: 2, INTERNAL_JUMP: 3,
}

/**
 * Classes
 */

class SourceLocation {
    constructor(file, offset, length, fileName, fileId) {
        this.file = file;
        this.offset = offset;
        this.length = length;
        this.fileName = fileName;
        this.fileId = fileId;
    }

    get getStartingLineNumber() {
        if (this.line === undefined) {
            this.line = getLineNumber(this.offset, this.file)
        }
        return this.line;
    };
}

class Instruction {
    constructor(pc, opcode, jumpType, pushData, location, modifier) {
        this.pc = pc;
        this.opcode = opcode;
        this.opcodeString = Opcode.get(opcode);
        this.jumpType = jumpType;
        this.modifier = modifier;
        this.pushData = pushData;
        this.location = location;
        this.line = undefined;
        if (location !== undefined) {
            this.line = location.getStartingLineNumber;
        }
    }
}

class TransactionStackTraceStep {
    constructor(instruction, gas, gasCost, depth, op, modifier) {
        this.instruction = instruction;
        this.gas = gas;
        this.gasCost = gasCost;
        this.depth = depth;
        this.op = op;
        this.modifier = modifier;
    }
}

class AbiFunction {
    constructor(name, inputs, type, outputs, methodID) {
        this.name = name;
        this.inputs = inputs;
        this.type = type;
        this.outputs = outputs;
        this.methodID = methodID;
    }

    functionName() {
        let params = "";

        if (this.inputs.length > 0) {
            params += "(";
            for (let i in this.inputs) {
                params += this.inputs[i].type + " " + this.inputs[i].name + ", ";
            }
            params = params.slice(0, -2);
            params += ")";

        } else {
            params = "()";
        }
        return this.name + params;
    }
}

class Source {
    constructor(name, id, content, abi, ast) {
        this.name = name;
        this.id = id;
        this.content = content;
        this.abi = abi;
        this.ast = ast;
        this.analysed = new Map;
        //this.commentMap = detectComments(content);
        this.functions = encodeAllFunctions(abi);
    }
}

class SourceCodeComment {
    constructor(index, lastIndex, startingLine, endingLine) {
        this.index = index;
        this.lastIndex = lastIndex;
        this.startingLine = startingLine;
        this.endingLine = endingLine;
        this.isMultiLine = startingLine !== endingLine;
        this.isInline = false;
        this.isBracket = false;
    }
}

class AnalysedDetails {
    constructor(txHash, contractHash, initialTransactionCost, traceCosts, gasCosts, refund, transactionFunction, contractName, compilerVersion, optimizer, runs) {
        this.txHash = txHash;
        this.contractHash = contractHash;
        this.initialTransactionCost = initialTransactionCost;
        this.traceCosts = traceCosts;
        this.gasCosts = gasCosts;
        this.refund = refund;
        this.totalCosts = gasCosts - refund;
        this.transactionFunction = transactionFunction;
        this.contractName = contractName;
        this.compilerVersion = compilerVersion;
        this.optimizer = optimizer;
        this.runs = runs;
    }
}

class Response {
    constructor(analysed, details, error) {
        this.analysed = analysed;
        this.details = details;
        this.error = error;
    }
}

/**
 * Outputs text on the console
 * @param type message type
 * @param msg message
 */
function logToConsole(type, msg) {
    if (type <= logLevel) {
        console.log("[" + Logger.get(type) + "] " + msg);
    }
}

/**
 * Returns true if the instruction is a PUSH operator
 * @param inst instruction
 * @returns {boolean} true if instruction is a PUSH operator
 */
const isPush = inst => inst >= 0x60 && inst <= 0x7f;

/**
 * Decompresses the sourcemap
 * Based on https://github.com/NomicFoundation/hardhat/blob/main/packages/hardhat-core/src/internal/hardhat-network/stack-traces/source-maps.ts
 * Has been modified to read out the modifier.
 *
 * https://docs.soliditylang.org/en/v0.8.17/internals/source_mappings.html
 * Source map entry = s:l:f:j:m
 * s: byte-offset to the start of the range in the source file
 * l: length of the source range in bytes
 * f: source index
 * j: jump type
 * m: modifier depth
 *
 * @param compressedSourcemap compressed sourcemap
 * @returns decompressed sourcemap
 */
function decompressSourcemap(compressedSourcemap) {
    let mappings = [];

    const compressedMappings = compressedSourcemap.split(";");

    for (let i = 0; i < compressedMappings.length; i++) {
        const parts = compressedMappings[i].split(":");

        const hasParts0 = parts[0] !== undefined && parts[0] !== "";
        const hasParts1 = parts[1] !== undefined && parts[1] !== "";
        const hasParts2 = parts[2] !== undefined && parts[2] !== "";
        const hasParts3 = parts[3] !== undefined && parts[3] !== "";
        const hasParts4 = parts[4] !== undefined && parts[4] !== "";

        const hasEveryPart = hasParts0 && hasParts1 && hasParts2 && hasParts3;

        // See: https://github.com/nomiclabs/hardhat/issues/593
        if (i === 0 && !hasEveryPart) {
            mappings.push({
                jumpType: JumpType.NOT_JUMP, location: {
                    file: -1, offset: 0, length: 0,
                },
            });
            continue;
        }

        if (hasParts4) {
            mappings.push({
                location: {
                    offset: hasParts0 ? +parts[0] : mappings[i - 1].location.offset,
                    length: hasParts1 ? +parts[1] : mappings[i - 1].location.length,
                    file: hasParts2 ? +parts[2] : mappings[i - 1].location.file,
                },
                jumpType: hasParts3 ? jumpLetterToJumpType(parts[3]) : mappings[i - 1].jumpType,
                modifier: hasParts4 ? parts[4] : mappings[i - 1].modifier,

            });
            continue;
        }

        mappings.push({
            location: {
                offset: hasParts0 ? +parts[0] : mappings[i - 1].location.offset,
                length: hasParts1 ? +parts[1] : mappings[i - 1].location.length,
                file: hasParts2 ? +parts[2] : mappings[i - 1].location.file,
            }, jumpType: hasParts3 ? jumpLetterToJumpType(parts[3]) : mappings[i - 1].jumpType,
        });
    }

    return mappings;
}

/**
 * Returns the jump type
 * @param letter char
 * @returns {number} jump type
 */
function jumpLetterToJumpType(letter) {
    if (letter === "i") {
        return JumpType.INTO_FUNCTION;
    }

    if (letter === "o") {
        return JumpType.OUTOF_FUNCTION;
    }
    return JumpType.NOT_JUMP;
}

/**
 * Decodes the instructions.
 * @param bytecode bytecode from the compiler.
 * @param compressedSourcemaps compressed source map
 * @param source source code
 * @param isSingleContract true if the smart contract consists of several files.
 * @returns {*[]} decoded instructions
 */
function decodeInstructions(bytecode, compressedSourcemaps, source, isSingleContract) {
    let sourceMaps = decompressSourcemap(compressedSourcemaps);

    let instructions = [];
    let bytesIndex = 0;

    while (instructions.length < sourceMaps.length) {
        let pc = bytesIndex;
        let opcode = bytecode[pc];
        let sourceMap = sourceMaps[instructions.length];
        let pushData = void 0;
        let location = void 0;
        let modifier = sourceMap.modifier;

        const jumpType = (isJump(opcode) === true && sourceMap.jumpType === JumpType.NOT_JUMP) ? JumpType.INTERNAL_JUMP : sourceMap.jumpType;

        if (isPush(opcode)) {
            let length = getPushLength(opcode);
            pushData = bytecode.slice(bytesIndex + 1, bytesIndex + 1 + length);
        }

        if (sourceMap.location.file !== -1) {
            let file;
            let fileName = undefined;
            if (isSingleContract) {
                file = source;
            } else {
                if (source.get(sourceMap.location.file) !== undefined) {
                    file = source.get(sourceMap.location.file).content;
                    fileName = source.get(sourceMap.location.file).name;
                } else {
                    logToConsole(3, "decodeInstructions(bytecode, compressedSourcemaps, source, isSingleContract): fileID " + sourceMap.location.file + " not found in source (isGeneratedSource = true)");
                }
            }

            if (file !== undefined) {
                location = new SourceLocation(file, sourceMap.location.offset, sourceMap.location.length, fileName, sourceMap.location.file);
            }
        }

        let instruction = new Instruction(pc, opcode, jumpType, pushData, location, modifier);

        instructions.push(instruction);

        bytesIndex += getOpcodeLength(opcode);
    }

    return instructions;
}

/**
 * Returns the opcode length
 * @param opcode opcode
 * @returns {number} opcode length
 */
function getOpcodeLength(opcode) {
    if (!isPush(opcode)) {
        return 1;
    }
    return 1 + getPushLength(opcode);
}

/**
 * Returns the push opcode length
 * @param opcode push opcode
 * @returns {number} push length
 */
function getPushLength(opcode) {
    return (opcode - 96 + 1);
}

/**
 * Returns true if opcode is JUMP or JUMPI
 * @param opcode opcode
 * @returns {boolean}
 */
function isJump(opcode) {
    return opcode === 0x56 || opcode === 0x57;
}

function getOpcodeAsName(opcode) {
    for (let i = 0; i < Opcode.length; i++) {
        if (Opcode[i] === opcode) {
            return Opcode[i];
        }
    }
}

/**
 * Analyse the transaction trace
 * @param instructions decoded instructions
 * @param trace transaction trace
 * @param code source code
 * @param mainContractName contract name
 * @returns {{error: string}|*} analysed transaction
 */
function analyse(instructions, trace, code, mainContractName) {
    let analysed = [];

    // Checks if a trace is valid.
    if (!trace["result"].hasOwnProperty("structLogs")) {
        return ({error: "Transaction trace is invalid. Try again!"});
    }


    // Goes through the complete transaction trace and combines the trace with the decoded instructions.
    for (const key of trace["result"]["structLogs"]) {
        for (let i = 0; i < instructions.length; i++) {
            if (instructions[i].pc === key["pc"]) {
                let code = new TransactionStackTraceStep(instructions[i], key["gas"], key["gasCost"], key["depth"], key["op"], instructions[i].modifier);

                // Checks if the opcodes are the same
                if (instructions[i].opcodeString !== key["op"]) {
                    // If the opcodes are unequal and the depth is 1, we have a problem. However, this should not happen.
                    if (key["depth"] === 1) {
                        logToConsole(2, instructions[i].opcodeString + " !== " + key["op"] + " - " + instructions[i].pc + " ::: " + key["pc"] + " - " + key["depth"]);
                    }
                }

                analysed.push(code);
                break;
            }
        }
    }

    logToConsole(0, "Trace entries: " + trace["result"]["structLogs"].length);
    logToConsole(0, "Analysed entries: " + analysed.length);

    // lastValid element with a location
    let lastValid;

    let callCosts = 0;
    let gasBeforeCall = 0;
    let callLine = undefined;
    let callSourceId = undefined;
    let callActive = false;
    let nextIsCall = false;

    let lastValidLine = undefined;
    let lastValidSourceId = undefined;

    let isGeneratedSource = false;

    let y = 1;
    analysed.forEach(element => {

        // Check if the next instruction is in a call. callActive will be set to true.
        if (nextIsCall) {
            callActive = true;
            nextIsCall = false;
        }

        // Call is active and depth > 1
        if (element.depth > 1 && callActive) {
            logToConsole(3, "Depth > 1 and callActive")
            y++;
            return;
        } else if (element.depth === 1 && callActive) {
            //The call is over and calculate gas costs.
            callCosts = gasBeforeCall - element.gas;
            logToConsole(0, "Call gasCosts: " + callCosts);
        }

        let gasCosts = element.gasCost;

        // Checks if the instruction has a source code. The compiler can generate internal code. For more information,
        // please visit: https://docs.soliditylang.org/en/v0.8.17/internals/source_mappings.html
        if (element.instruction.location !== undefined) {
            if (code.get(element.instruction.location.fileId) !== undefined) {
                if (isGeneratedSource) {
                    isGeneratedSource = false;
                    logToConsole(0, "isGeneratedSource disabled " + element.instruction.pc + " - " + y)
                }
            } else {
                logToConsole(0, "isGeneratedSource enabled " + element.instruction.pc + " - " + y)
                isGeneratedSource = true;
            }
        }

        y++;

        // Instruction is call
        if (["CALL", "CALLCODE", "DELEGATECALL", "STATICCALL"].includes(element.op)) {
            gasBeforeCall = element.gas;
            nextIsCall = true;
            callLine = element.instruction.line;
            callSourceId = element.instruction.location.fileId;
            logToConsole(0, "callActive enabled")
            return;
        }

        // If a call is active but the depth is 1, the call is finished.
        if (element.depth === 1 && callActive) {
            code.get(callSourceId).analysed.set(callLine, code.get(callSourceId).analysed.get(callLine) + callCosts);
            callActive = false;
            callCosts = 0;
            gasBeforeCall = 0;
            callLine = undefined;
            callSourceId = undefined;
            logToConsole(0, "callActive disabled")
        }

        // Instructions has a source code and is not in any call.
        if (element.instruction.location !== undefined) {
            // If the instruction was generated by the compiler, the last valid line is used. Otherwise, the line of
            // the instruction is used.
            if (isGeneratedSource) {
                if (code.get(lastValidSourceId).analysed.get(lastValidLine) !== undefined) {
                    code.get(lastValidSourceId).analysed.set(lastValidLine, code.get(lastValidSourceId).analysed.get(lastValidLine) + gasCosts);
                } else {
                    code.get(lastValidSourceId).analysed.set(lastValidLine, gasCosts);
                }
            } else {
                if (code.get(element.instruction.location.fileId).analysed.get(element.instruction.line) !== undefined) {
                    code.get(element.instruction.location.fileId).analysed.set(element.instruction.line, code.get(element.instruction.location.fileId).analysed.get(element.instruction.line) + gasCosts);
                } else {
                    code.get(element.instruction.location.fileId).analysed.set(element.instruction.line, gasCosts);
                }

                lastValidLine = element.instruction.line;
                lastValidSourceId = element.instruction.location.fileId;
            }

            lastValid = element;
        } else {
            // Instruction has no source code.
            // If the instruction was generated by the compiler, the last valid line is used. Otherwise, the line of
            // the last valid instruction is used.
            if (isGeneratedSource) {
                if (code.get(lastValidSourceId).analysed.get(lastValidLine) !== undefined) {
                    code.get(lastValidSourceId).analysed.set(lastValidLine, code.get(lastValidSourceId).analysed.get(lastValidLine) + gasCosts);
                } else {
                    code.get(lastValidSourceId).analysed.set(lastValidLine, gasCosts);
                }
            } else {
                if (code.get(lastValid.instruction.location.fileId).analysed.get(lastValid.instruction.line) !== undefined) {
                    code.get(lastValid.instruction.location.fileId).analysed.set(lastValid.instruction.line, code.get(lastValid.instruction.location.fileId).analysed.get(lastValid.instruction.line) + gasCosts);
                } else {
                    code.get(lastValid.instruction.location.fileId).analysed.set(lastValid.instruction.line, gasCosts);
                }
                lastValidLine = element.instruction.line;
            }
        }
    });

    return code;
}

/**
 * Calculates the gas cost of the transaction trace
 * @param map analysed transaction trace
 * @returns {number} transaction gas costs
 */
function analysedTraceCosts(map) {
    let gasCosts = 0;

    map.forEach(values => {
        values.analysed.forEach(analysed => {
            gasCosts = gasCosts + analysed
        });
    });

    return gasCosts;
}

/**
 * Get the source code from Etherscan and compile it.
 * @param contractAddress contract address
 * @returns {Promise<unknown>}
 */
function getContractAndCompile(contractAddress) {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            const axios = require('axios')

            const url = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${etherscanApiKey}`

            let name;
            let compilerVersion;

            const res = await axios.get(url);
            const contract = res.data.result[0];

            name = contract["ContractName"];
            compilerVersion = contract["CompilerVersion"];
            let code = contract["SourceCode"];

            let newCode;
            let isSingleContract = undefined;

            // Parse the json response
            try {
                newCode = JSON.parse(code.slice(1, -1));
                isSingleContract = false;
            } catch {
                newCode = code;
                isSingleContract = true;
            }

            logToConsole(0, "Smart Contract: " + name);
            logToConsole(0, "Compiler Version: " + compilerVersion);
            logToConsole(0, "isSingleContract: " + isSingleContract);

            let optimizer = false;

            if (contract["OptimizationUsed"] === "1") {
                optimizer = true;
            }

            let runs = parseInt(contract["Runs"]);

            logToConsole(0, "OptimizationUsed: " + optimizer);
            logToConsole(0, "Runs: " + runs);

            // Compiler settings
            let input = {
                language: 'Solidity',

                sources: {
                    'Contract.sol': {
                        content: code
                    }
                },

                settings: {
                    optimizer: {
                        enabled: optimizer, runs: runs
                    }, outputSelection: {
                        '*': {
                            '*': ['*'], '': ['ast']
                        }
                    }
                }
            };

            let mainContractName = name;

            // If the contract consists of several files, an object with all source codes is created.
            if (!isSingleContract) {
                Object.defineProperty(input, "sources", {value: newCode.sources});
                mainContractName = Object.keys(newCode.sources)[0];
                logToConsole(0, mainContractName);
            }

            logToConsole(0, "Compiling...")

            // Loads the correct compiler version.
            solc.loadRemoteVersion(compilerVersion, function (err, solcSnapshot) {
                if (err) {
                    logToConsole(2, err);
                } else {
                    let output = JSON.parse(solcSnapshot.compile(JSON.stringify(input)));

                    // Check if the contract was compiled.
                    if (!output.hasOwnProperty("contracts")) {
                        if (output.hasOwnProperty("errors")) {
                            logToConsole(2, "Can't compile the contract!");
                            let error = "Can't compile the contract!";
                            resolve({error});
                            output.errors.forEach(e => {
                                console.log(e);
                            });

                            return;
                        }
                    }

                    let contracts = output.contracts
                    if (isSingleContract) {
                        contracts = output.contracts['Contract.sol'];
                    }

                    // Search all source codes for the main contract to get the bytecode.
                    // After that, decode the instructions.
                    for (let contractName in contracts) {
                        if (contractName === mainContractName) {
                            let sources = new Map;

                            // If the contract consists of only one file.
                            if (isSingleContract) {
                                let parsed = Buffer.from(output.contracts['Contract.sol'][contractName].evm.deployedBytecode.object, "hex");

                                let instructions = decodeInstructions(parsed, output.contracts['Contract.sol'][contractName].evm.deployedBytecode.sourceMap, code, isSingleContract);

                                let mainContractLines = undefined;

                                output.sources['Contract.sol'].ast.nodes.forEach(element => {
                                    if (element.name === name) {
                                        mainContractLines = element.src;
                                        logToConsole(3, "mainContractLines: " + mainContractLines);
                                    }
                                });

                                sources.set(output.sources['Contract.sol'].id, new Source(contractName, output.sources['Contract.sol'].id, code, output.contracts['Contract.sol'][contractName].abi, output.sources['Contract.sol'].ast));

                                resolve({
                                    instructions,
                                    sources,
                                    mainContractLines,
                                    isSingleContract,
                                    mainContractName,
                                    name,
                                    compilerVersion,
                                    optimizer,
                                    runs
                                });
                            } else {
                                if (output.contracts[contractName][name] === undefined) {
                                    break;
                                }

                                let result = compilerOutputParser(output, input, sources, contractName, name, isSingleContract);
                                let instructions = result.instructions;
                                let mainContractLines = result.mainContractLines;

                                resolve({
                                    instructions,
                                    sources,
                                    mainContractLines,
                                    isSingleContract,
                                    mainContractName,
                                    name,
                                    compilerVersion,
                                    optimizer,
                                    runs
                                });
                                return;
                            }
                        }
                    }

                    if (!isSingleContract) {
                        logToConsole(1, "No matching contract found in sources. Trying alternative method.")

                        let sources = new Map;

                        for (let contractName in contracts) {
                            if (contractName.includes(name + ".sol")) {
                                logToConsole(0, "Found contract name in sources (" + name + ")")

                                let result = compilerOutputParser(output, input, sources, contractName, name, isSingleContract);
                                let instructions = result.instructions;
                                let mainContractLines = result.mainContractLines;

                                resolve({
                                    instructions,
                                    sources,
                                    mainContractLines,
                                    isSingleContract,
                                    mainContractName,
                                    name,
                                    compilerVersion,
                                    optimizer,
                                    runs
                                });
                                return;
                            }
                        }
                    }
                }
            });
        },);
    });
}

/**
 * Try to find out the main contract name.
 * Etherscan sometimes outputs a different contract name than the compiler.
 * Afterward the instructions are decoded.
 * @param output compiler output
 * @param input compiler input
 * @param sources all source codes
 * @param contractName contract name
 * @param name name
 * @param isSingleContract isSingleContract
 * @returns {{instructions: *[], sources, mainContractLines: undefined}}
 */
function compilerOutputParser(output, input, sources, contractName, name, isSingleContract) {
    let parsed = Buffer.from(output.contracts[contractName][name].evm.deployedBytecode.object, "hex");

    // Matches the contract name
    const regex = /[A-Za-z0-9_\-\.]+(?=\.[A-Za-z0-9]+$)/gm;

    // Search all source codes and try to find the main contract,
    for (let source in output.sources) {
        if (output.contracts[source] !== undefined) {
            let objects = Object.keys(output.contracts[source]);

            if (objects.length === 1) {
                sources.set(output.sources[source].id, new Source(source, output.sources[source].id, input.sources[source].content, output.contracts[source][objects[0]].abi, output.sources[source].ast));
            } else {
                let match;
                let fileName = undefined;

                while ((match = regex.exec(source)) !== null) {
                    if (match.index === regex.lastIndex) {
                        regex.lastIndex++;
                    }

                    match.forEach((match) => {
                        fileName = match;
                    });
                }

                if (fileName !== undefined) {
                    for (let i = 0; i < objects.length; i++) {
                        if (objects[i] === fileName) {
                            sources.set(output.sources[source].id, new Source(source, output.sources[source].id, input.sources[source].content, output.contracts[source][objects[i]].abi, output.sources[source].ast));

                            break;
                        }
                    }
                } else {
                    logToConsole(2, "Can't get fileName: " + source);
                }
            }
        } else {
            logToConsole(1, "File not found in output.contracts: " + source);
            sources.set(output.sources[source].id, new Source(source, output.sources[source].id, input.sources[source].content, [], output.sources[source].ast));
        }
    }

    let instructions = decodeInstructions(parsed, output.contracts[contractName][name].evm.deployedBytecode.sourceMap, sources, isSingleContract);

    let mainContractLines = undefined;

    output.sources[contractName].ast.nodes.forEach(element => {
        if (element.name === name) {
            mainContractLines = element.src;
            logToConsole(3, "mainContractLines: " + mainContractLines);
        }
    });

    return ({
        instructions,
        sources,
        mainContractLines
    });
}

/**
 * Encodes a function from the abi.
 * @param abi abi
 * @param index function index
 * @returns {*}
 */
function encodeFunction(abi, index) {
    let provider = new Web3.providers.HttpProvider(nodeUrl);
    let web3 = new Web3(provider);

    return web3.eth.abi.encodeFunctionSignature(abi[index]);
}

/**
 * Encode all functions
 * @param abi abi
 * @returns {*[]}
 */
function encodeAllFunctions(abi) {
    let abiFunctions = [];
    for (let i = 0; i < abi.length; i++) {
        if (abi[i].inputs !== undefined) {
            abiFunctions.push(new AbiFunction(abi[i].name, abi[i].inputs, abi[i].type, abi[i].outputs, encodeFunction(abi, i)));
        }
    }

    return abiFunctions;
}

/**
 * Split string at the given position
 * @param str string
 * @param index start position
 * @returns {*[]}
 */
function split(str, index) {
    return [str.slice(0, index), str.slice(index)];
}

/**
 * Can calculate the line number in the source code using an offset.
 * @param offset offset
 * @param sourceCode source code
 * @returns {number} line number
 */
function getLineNumber(offset, sourceCode) {
    let line = 1;
    for (let i = 0, code = sourceCode.slice(0, offset); i < sourceCode.length; i++) {
        let c = code[i];
        if (c === "\n") {
            line += 1;
        }
    }
    return line;
}

/**
 * Get the transaction trace from the archive node.
 * @param transactionHash
 * @returns {Promise<unknown>}
 */
function getTransactionTrace(transactionHash) {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            let provider = new Web3.providers.HttpProvider(nodeUrl);
            let web3 = new Web3(provider);

            web3.currentProvider.send({
                method: "debug_traceTransaction", params: [transactionHash, {
                    "disableStack": true, "disableMemory": true, "disableStorage": true, "fullStorage": false
                }], jsonrpc: "2.0", id: new Date().getTime()
            }, (err, result) => {
                //console.log(err, result);
                resolve(result);
            });
        },);
    });
}

/**
 * Get the transaction details from the archive node.
 * For example, which function was called or how much gas was consumed.
 * @param transactionHash transaction hash
 * @returns {Promise<unknown>} transaction details
 */
function getTransactionDetails(transactionHash) {
    return new Promise((resolve) => {
        setTimeout(async () => {
            let provider = new Web3.providers.HttpProvider(nodeUrl);
            let web3 = new Web3(provider);

            web3.currentProvider.send({
                method: "eth_getTransactionByHash", params: [transactionHash], jsonrpc: "2.0", id: new Date().getTime()
            }, (err, result) => {
                resolve(result);
            });
        },);
    });
}

/**
 * This function tries to find the called function in the smart contract. If it is not found,
 * it is most likely a proxy contract. It also decodes the function parameters.
 * @param inputData Function data
 * @param analysed Analysed trace
 * @returns {{functionFileID: fileID, functionSignature: functionSignature, functionLine: functionLine, functionParameter: *[], isProxy: boolean}}
 */
function getTransactionFunction(inputData, analysed) {
    let [methodID, data] = split(inputData, 10);

    let functionSignature = undefined;
    let functionParameter = [];
    let functionLine = undefined;
    let functionFileID = undefined

    logToConsole(3, "RawData: " + data);

    let isProxy = true;

    for (const value of analysed.values()) {
        for (let i = 0; i < value.functions.length; i++) {
            if (value.functions[i].methodID === methodID) {
                let id = methodID.slice(2); // remove 0x from methodID

                // Search all functions with the same methodID in all sources
                for (const nodes of value.ast.nodes) {
                    if (nodes.nodeType === "ContractDefinition") {
                        for (const n of nodes.nodes) {
                            let found = false;

                            if (n.hasOwnProperty("functionSelector")) {
                                if (n.functionSelector === id) {
                                    found = true;
                                }
                            } else if (n.nodeType === "FunctionDefinition") {
                                if (n.name === value.functions[i].name) {
                                    let sameParameters = true;
                                    for (let index in n["parameters"].parameters) {
                                        if (n["parameters"].parameters[index].name !== value.functions[i].inputs[index].name) {
                                            sameParameters = false;
                                        }
                                    }
                                    found = sameParameters;
                                }
                            }

                            // Function was found
                            if (found) {
                                let functionStart = n.src.split(":");
                                let lineNumber = getLineNumber(functionStart[0], value.content);

                                logToConsole(0, "***** Function *****")
                                logToConsole(0, "Function: " + value.functions[i].functionName());
                                logToConsole(0, "MethodID: " + value.functions[i].methodID);
                                logToConsole(0, "FileID: " + value.id);
                                logToConsole(0, "Starting line: " + lineNumber);

                                functionSignature = value.functions[i].functionName();

                                let provider = new Web3.providers.HttpProvider(nodeUrl);
                                let web3 = new Web3(provider);

                                // Decode the function parameters.
                                let decoded = web3.eth.abi.decodeParameters(value.functions[i].inputs, data);
                                logToConsole(0, "***** Input Data *****")

                                // Each parameter is stored in an array
                                if (functionParameter.length === 0) {
                                    for (let x = 0; x < value.functions[i].inputs.length; x++) {
                                        functionParameter.push(value.functions[i].inputs[x].name + ": " + decoded[x] + " (" + value.functions[i].inputs[x].type + ")");
                                        logToConsole(0, value.functions[i].inputs[x].name + ": " + decoded[x] + " (" + value.functions[i].inputs[x].type + ")");
                                    }
                                }

                                // Goes through the analyzed lines of the smart contract and checks if the function
                                // has been called. If it has not been called, it is a proxy contract.
                                if (value.analysed.get(lineNumber) !== undefined) {
                                    isProxy = false;
                                    functionLine = lineNumber;
                                    functionFileID = value.id;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return ({functionSignature, functionParameter, isProxy, functionLine, functionFileID});
}

exports.analyze = async function test(transactionHash) {
    logToConsole(3, Opcode.get(0xff));

    let transactionDetails = await getTransactionDetails(transactionHash);

    if (transactionDetails === undefined) {
        return new Response(null, null, {
            code: "-2",
            message: "Can't get transaction details. The archive node is not available."
        });
    }

    if (transactionDetails.hasOwnProperty("error")) {
        return new Response(null, null, transactionDetails["error"]);
    }

    if (transactionDetails["result"] === null) {
        return new Response(null, null, {code: "-1", message: "Invalid transaction hash!"});
    }

    let contractAddress = transactionDetails["result"].to;

    logToConsole(0, "Transaction: https://etherscan.io/tx/" + transactionHash);
    logToConsole(0, "Contract: https://etherscan.io/address/" + contractAddress);

    let compiledContract = await getContractAndCompile(contractAddress);

    if (compiledContract.hasOwnProperty("error")) {
        return new Response(null, null, {code: "-3", message: compiledContract["error"]});
    }

    let transactionTrace = await getTransactionTrace(transactionHash);

    let instructions = compiledContract.instructions;
    let sources = compiledContract.sources;
    let mainContractName = compiledContract.mainContractName;

    let compilerVersion = compiledContract.compilerVersion;
    let optimizer = compiledContract.optimizer;
    let runs = compiledContract.runs;

    let analysed = analyse(instructions, transactionTrace, sources, mainContractName)

    if (analysed.hasOwnProperty("error")) {
        return new Response(null, null, {code: "-4", message: analysed["error"]});
    }

    let inputData = transactionDetails['result'].input;

    let transactionFunction = getTransactionFunction(inputData, analysed)

    let initialTransactionCost = transactionDetails['result'].gas - transactionTrace['result']['structLogs'][0].gas;
    let traceCosts = analysedTraceCosts(analysed);
    let totalCosts = traceCosts + initialTransactionCost;
    let refund = totalCosts - transactionTrace.result.gas;

    logToConsole(0, "***** Analyse *****")
    logToConsole(0, "Initial Transaction costs: " + initialTransactionCost + " Gas");
    logToConsole(0, "Trace costs: " + traceCosts + " Gas");
    logToConsole(0, "Total gas costs: " + totalCosts + " Gas");
    logToConsole(0, "Refunded: " + refund + " Gas");
    logToConsole(0, "isProxy: " + transactionFunction.isProxy);
    logToConsole(0, "Transaction: https://etherscan.io/tx/" + transactionHash);
    logToConsole(0, "Contract: https://etherscan.io/address/" + contractAddress);

    let analysedDetails = new AnalysedDetails(transactionHash, contractAddress, initialTransactionCost, traceCosts,
        totalCosts, refund, transactionFunction, compiledContract.name, compilerVersion, optimizer, runs);

    return new Response(analysed, analysedDetails, null);
}

/**
 * Unused functions
 */

/**
 * Unused function. Can detect all comments in a smart contract.
 * @param sourceCode
 * @returns {Map<any, any>}
 */
function detectComments(sourceCode) {
    const regexAll = /(\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\/)|(\/\/.*)/g; // Detect all comments
    const regexInline = /[^\s//].*\/\/.*$/gm; // Detect inline comments
    const regexClosingBracket = /^\s*[}]+?$/mg; // Detect closing brackets

    let sourceCodeComments = [];

    let m;

    while ((m = regexAll.exec(sourceCode)) !== null) {
        if (m.index === regexAll.lastIndex) {
            regexAll.lastIndex++;
        }

        sourceCodeComments.push(new SourceCodeComment(m.index, regexAll.lastIndex, getLineNumber(m.index, sourceCode), getLineNumber(regexAll.lastIndex, sourceCode)));
    }

    while ((m = regexInline.exec(sourceCode)) !== null) {
        if (m.index === regexInline.lastIndex) {
            regexInline.lastIndex++;
        }

        let line = getLineNumber(m.index, sourceCode);

        sourceCodeComments.forEach(element => {
            if (element.startingLine === line && element.isMultiLine === false) {
                element.isInline = true;
            }
        });
    }

    while ((m = regexClosingBracket.exec(sourceCode)) !== null) {
        if (m.index === regexClosingBracket.lastIndex) {
            regexClosingBracket.lastIndex++;
        }

        let bracket = new SourceCodeComment(m.index + 1, regexClosingBracket.lastIndex, getLineNumber(m.index + 1, sourceCode), getLineNumber(regexClosingBracket.lastIndex, sourceCode));

        bracket.isBracket = true;
        sourceCodeComments.push(bracket);
    }

    let comments = new Map();

    sourceCodeComments.forEach(element => {
        if (element.isMultiLine) {
            for (let i = element.startingLine; i <= element.endingLine; i++) {
                comments.set(i, element);
            }
        } else {
            comments.set(element.startingLine, element);
        }
    });

    return comments;
}