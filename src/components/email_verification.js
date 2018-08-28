import React, { Component } from 'react';
import MetaMask from './meta_mask';
import ClearmeRegistry from './clearme_registry';
import clearmeRegistry from "./clearmeRegistry";
import IPFSAgent from "clear-me-lib/lib/storage/IPFSAgent";
import JWT from 'jsonwebtoken';
import Resolver from "clear-me-resolver/lib/resolver";
//Import CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/clearme.css'
import { Row, Col, Button, Card } from 'reactstrap';
//Images
import clearmelogo from '../img/logo.png'
import web3 from '../web3';
import { decode } from 'jsonwebtoken';

class EmailVerification extends Component{

    constructor(props) {
        super(props);
        this.state = {
            identity: props.identity,
            deployed: props.deployed,
            firstName: '',
            lastName: '',
            email: '',
            ddoDocRetrieved: ''
        };
    }

    async deployNewId(){

        const accounts = await web3.eth.getAccounts();
        const abi = [{
            "constant": true,
            "inputs": [{"name": "addr", "type": "address"}],
            "name": "isOwner",
            "outputs": [{"name": "", "type": "bool"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "owner",
            "outputs": [{"name": "", "type": "address"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {"inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor"}];

        const byteCode = '6060604052341561000f57600080fd5b60008054600160a060020a033316600160a060020a03199091161790556101358061003b6000396000f30060606040526004361061004b5763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416632f54bf6e81146100505780638da5cb5b14610090575b600080fd5b341561005b57600080fd5b61007c73ffffffffffffffffffffffffffffffffffffffff600435166100cc565b604051901515815260200160405180910390f35b341561009b57600080fd5b6100a36100ed565b60405173ffffffffffffffffffffffffffffffffffffffff909116815260200160405180910390f35b60005473ffffffffffffffffffffffffffffffffffffffff90811691161490565b60005473ffffffffffffffffffffffffffffffffffffffff16815600a165627a7a72305820b380d9ec673645b8a5e7b31f3def9f0fc120b1fe4c10ac740d1a9b83c4a6e8db0029';

        const result = await new web3.eth.Contract(JSON.parse(JSON.stringify(abi)))
            .deploy({ data: byteCode})
            .send({ gas: '1000000', from: accounts[0] });

        this.setState({
            identity: result.options.address,
            message: 'Identity has been deployed! ',
            loading: false
        });

        return result.options.address;
    }

    async saveIdToIPFS(){
        const identityClaim = {firstName: this.state.firstName, lastName: this.state.lastName,
            email: this.state.email};
        const token = JWT.sign({
            data: identityClaim
        }, 'clearmeSecret', {expiresIn: 60 * 60});
        const ipfsAgent = new IPFSAgent('ipfs.infura.io', '5001', 'https');
        const identityClaimHash = await ipfsAgent.saveEncodedData(token);
        return identityClaimHash;
    }

    async recordToRegistry(identityAddress, identityClaimHash){
        const accounts = await web3.eth.getAccounts();
        await clearmeRegistry.methods.setClaim(identityAddress, identityClaimHash).send({ from: accounts[0]});
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name]: value
        });
    }

    async fetchIPFSHash(identityAddress) {
        const accounts = await web3.eth.getAccounts();
        const hash = await clearmeRegistry.methods.getClaim(identityAddress, accounts[0]).call();
        this.setState({
            ipfsHashFromReg: hash
        });
    }

    onRender = async (event) => {
        // event.preventDefault();
        const identityAddress = await this.deployNewId();
        this.setState({
            identity: identityAddress
        });
        const identityClaimHash = await this.saveIdToIPFS();
        await this.recordToRegistry(identityAddress, identityClaimHash);
        await this.fetchIPFSHash(identityAddress);
    }

    onResolve = async(event) => {
        event.preventDefault();
        const did = `did:clear:${this.state.ipfsHashFromReg}`;
        let resolver = new Resolver('ipfs.infura.io', '5001', 'https');
        const ddoDoc = await resolver.resolve(did);
        const ddoDocRetrieved = JWT.verify(ddoDoc, 'clearmeSecret');
        this.setState({
            encodedJWT: JSON.stringify(ddoDoc),
            ddoDocRetrieved: JSON.stringify(ddoDocRetrieved)
        });
    }

    async componentWillMount() {
        const token = this.props.params.token

        const payload = decode(token);

        this.setState({
            firstName: payload.data.firstName,
            lastName: payload.data.lastName,
            email: payload.data.email
        });

        const clearmeWallet = await clearmeRegistry.methods.owner().call();
        const reg = clearmeRegistry.options.address;
        this.setState({
            clearmeWallet: clearmeWallet,
            registry: reg 
        });

        this.onRender();
    }

    render() {

        const identityOnEtherscan = `https://rinkeby.etherscan.io/address/${this.state.identity}#code`;
        const isDeployed = this.state.identity;
        const footerMessage = isDeployed ? (
            <p>This Identity contract is deployed on Rinkeby TestNet: <a href={identityOnEtherscan}>{this.state.identity}</a>
            It may take a minute to render on the blockexplorer.  Now storing claim and updating the registry.</p>
        ) : (
            <p>Fillout and submit to create an identity.</p>
        );
  
        return( <div>
                        <Row>
                        <Col className="appScreen">
                            <Card className="app-card">
                                <Col sm={{ size: 4, offset: 4 }} className="logoRow">
                                    <img src={clearmelogo} className="logo" />
                            </Col>
                            <Col sm={{ size: 10, offset: 1 }}>
                                <h4 style={{ fontColor: '#FFF' }}>Create a Verified Claim</h4>
                            </Col>

                            <div>
                                Waiting for new identity to be deployed to the blockchain which requires a transaction confirmation and block to be mined.
                            </div> 
                            </Card>
                    
                            <Card className="app-card">
                                <Col sm={{ size: 4, offset: 4 }} className="logoRow">
                                    <img src={clearmelogo} className="logo" />
                            </Col>
                            <Col sm={{ size: 10, offset: 1 }}>
                                <form onSubmit={this.onResolve}>
                                    <h4>Fetch using ClearMe resolver:</h4>
                                    <Button color="primary">Resolve &raquo;</Button>
                                </form>
                            </Col>
                        </Card>
                        </Col>
                    
                        <Col className="codeScreen">
                            <Row>
                                <MetaMask />
                            </Row>
                        <Row><p>{footerMessage}</p></Row>
                        <Row>
                                <ClearmeRegistry />
                            </Row>
                        <Row>
                            <p>IPFS Hash: {this.state.ipfsHashFromReg}</p>
                                <p>did = did:clear:{this.state.ipfsHashFromReg}</p>
                            
                                <p>Encoded JWT saved to IPFS: {this.state.encodedJWT}</p>
                                <p>DDO verified claim with Key: {this.state.ddoDocRetrieved}</p>
                        </Row>
                        </Col>
                    </Row>
                    {this.props.children}
                </div>);

    }
}

export default EmailVerification;