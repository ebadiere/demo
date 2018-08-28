import React, { Component } from 'react';
import MetaMask from './meta_mask';
import ClearmeRegistry from './clearme_registry';
import clearmeRegistry from "./clearmeRegistry";
//Import CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/clearme.css'
import { Row, Col, Button, Card } from 'reactstrap';
//Images
import clearmelogo from '../img/logo.png'
import Identity from './identity';
import { setApiKey, send } from "@sendgrid/mail";
import { Client } from '@sendgrid/client';
import { decode, sign } from 'jsonwebtoken';
import axios from 'axios';
import { Route } from 'react-router';

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            identity: '',
            email: '',
            firstName: '',
            lastName: '',
            token: ''
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        
  }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name]: value
        });
    }

    onSubmit = async (event) => {
        event.preventDefault();
        
        const payload = {};
        payload.firstName = this.state.firstName;
        payload.lastName = this.state.lastName;
        payload.email = this.state.email; 
        
        const token = sign({
            data: payload
        }, 'clearmeSecret', { expiresIn: 60 * 60 });   
 
        // const endpoint = 'http://localhost:8081/validate';
        const endpoint = 'http://clear-me-email-validator-dev.us-west-2.elasticbeanstalk.com/validate';
        let encodedJWT = {};
        encodedJWT.jwt = `${token}`;
        const jsonBody = JSON.stringify(encodedJWT);
      
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            }
          };

        const response = await axios.post(endpoint, jsonBody, axiosConfig);
        
        this.setState({
            token: token
        });
        window.location.reload(); 
    }

    async componentDidMount(){
        const clearmeWallet = await clearmeRegistry.methods.owner().call();
        const reg = clearmeRegistry.options.address;
        this.setState({
            clearmeWallet: clearmeWallet,
            registry: reg });
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

      let disable;
      if ((true === this.state.loading) || (isDeployed)){
          disable = true;
      }
      const jwt = this.state.token;

      return <div>
		  <Row>
		  <Col className="appScreen">
		  	<Card className="app-card">
		  		<Col sm={{ size: 4, offset: 4 }} className="logoRow">
		  			<img src={clearmelogo} className="logo" />
				</Col>
				<Col sm={{ size: 10, offset: 1 }}>
					<h4 style={{ fontColor: '#FFF' }}>Create a Verified Claim</h4>
				</Col>

                 <Identity
                    disable={disable} 
                    identity={this.identity} 
                    handleInputChange={event => this.handleInputChange(event)}
                    onSubmit={event => this.onSubmit(event)}
                    message={this.state.message}/>
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
			<Row>{footerMessage}</Row>
			<Row>
            	<p>IPFS Hash: {this.state.ipfsHashFromReg}</p>
              	<p>did = did:clear:{this.state.ipfsHashFromReg}</p>
              
              	<p>Encoded JWT saved to IPFS: {this.state.encodedJWT}</p>
              	<p>DDO verified claim with Key: {this.state.ddoDocRetrieved}</p>
			</Row>
		  </Col>
		</Row>
        {jwt}
        {this.props.children}
      </div>;
  }
}

export default App;
