import React, { Component } from 'react';
//Import CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/clearme.css'
import { Col, Button, Input, Form } from 'reactstrap';
//Images

class Identity extends Component {

    constructor(props) {
        super(props);
        this.state = {
            identity: props.identity,
            deployed: props.deployed,
        };
    }

    render() {
       
        return <div>
 
				<Form onSubmit={this.props.onSubmit}>
	  				<Col sm={{ size: 10, offset: 1 }}>
					  <Input name="firstName"
						  className="input"
						  type="text"
						  placeholder="First Name"
						  value={this.state.value}
						  onChange={this.props.handleInputChange}
					  />
					</Col>
					<Col sm={{ size: 10, offset: 1 }}>
					  <Input name="lastName"
						  className="input"
						  placeholder="Last Name"
						  type="text"
						  value={this.state.value}
						  onChange={this.props.handleInputChange}
					  />
					</Col>
					<Col sm={{ size: 10, offset: 1 }}>
					  <Input name="email"
						  className="input"
						  placeholder="you@email.com"
						  type="text"
						  value={this.state.value}
						  onChange={this.props.handleInputChange}
					  />
					</Col>
	  			  	<Col sm={{ size: 10, offset: 1 }}>
				  		<Button disabled={this.props.disable} color="primary">Submit &raquo;</Button><br />
				  	</Col>
			  </Form>
          <hr />
        </div>;
    }
}

export default Identity