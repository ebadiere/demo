import React, { Component } from 'react';
import clearmeRegistry from './clearmeRegistry';

class ClearmeRegistry extends Component {
    constructor(props){
        super(props);

        this.state = {
            clearmeWallet: '',
            registryAddress: '',
            entries: ''
        }    
    }

    async getRegistryEntries(){
        const entry = await clearmeRegistry.methods.getClaim('0xC9ca6B6EaeCfB28afCe08c411128c98b9cbFE280', this.state.clearmeWallet).call();
        return entry;
    }

    async componentDidMount(){
        const clearmeWallet = await clearmeRegistry.methods.owner().call();
        const reg = clearmeRegistry.options.address;
        this.setState({
            clearmeWallet: clearmeWallet,
            registry: reg });
    }

    render() {
        // this.getRegistryEntries();
        const registryOnEtherscan = `https://rinkeby.etherscan.io/address/${this.state.registryAddress}#code`;

        return(
            <div>
                <h2>Clearme Registry</h2>
                <p>Clearme wallet address from which the registry was deployed: {this.state.clearmeWallet}<br />
                    This Registry contract is deployed on rinkeby at:
                    <a href={registryOnEtherscan}>{this.state.registry}</a></p>
                <hr />
            </div>
        );
    }

}

export default ClearmeRegistry