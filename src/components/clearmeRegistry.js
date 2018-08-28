import web3 from '../web3';

const address = '0xB73c91319B6a771987dA6257D96E475f5667ACA9';

const abi = [{
    "constant": true,
    "inputs": [{"name": "_subject", "type": "address"}, {"name": "_issuer", "type": "address"}],
    "name": "getClaim",
    "outputs": [{"name": "", "type": "string"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "_subject", "type": "address"}, {"name": "_identifier", "type": "string"}],
    "name": "setClaim",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "", "type": "address"}, {"name": "", "type": "address"}],
    "name": "registry",
    "outputs": [{"name": "", "type": "string"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {"inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor"}];

export default new web3.eth.Contract(abi, address);