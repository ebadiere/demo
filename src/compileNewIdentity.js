// const path = require('path');
// const fs = require('fs');
// const solc = require('solc');
// const solc = require('BrowserSolc');
// let solc;
const web3 = require('web3');
console.log('DEBUG: web3: ' + web3);
// const contractsPath = path.resolve(__dirname, '../contracts', 'Identity.sol');
const source = "pragma solidity ^0.4.17;\n" +
    "\n" +
    "contract Identity {\n" +
    "    address public owner;\n" +
    "    modifier onlyOwner() {\n" +
    "        require(isOwner(msg.sender));\n" +
    "        _;\n" +
    "    }\n" +
    "\n" +
    "    // @dev constructor function. Sets contract owner\n" +
    "    function Identity() public {\n" +
    "        owner = msg.sender;\n" +
    "    }\n" +
    "\n" +
    "    function isOwner(address addr) public view returns(bool){\n" +
    "        return addr == owner;\n" +
    "    }\n" +
    "}\n";
const compiledOutput = web3.eth.compile.solidity(source);

module.exports = compiledOutput;