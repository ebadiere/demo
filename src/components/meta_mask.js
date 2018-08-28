import React, { Component } from 'react';
import web3 from '../web3';

class MetaMask extends Component {
    constructor(props){
        super(props);
        this.state = { accounts: ''};
    }

    async componentDidMount(){
        const accounts = await web3.eth.getAccounts();
        this.setState({
            accounts: accounts
        });
    }

    render() {
        let accounts = this.state.accounts;

        return(
            <div className="meta-mask">
                <h2>MetaMask</h2>
                <p><b>mnemonic:</b> forum elite gallery effort thunder refuse acid punch mansion tuition safe ghost</p><br/>

                <p>Address 1 in MetaMask: Clearme wallet address: 0x61a8a73E33EFdF04a12DF8cdFb1F833BDACCC1b2<br />

                Address 2 in MetaMask: User's Identity wallet address: 0x4deAE0140Bb156078dA9A50387c231D3DB53d6Ea<br /></p>

                Your current MetaMask account is: {accounts}

                <hr />
            </div>
        );
    }

}

export default MetaMask;