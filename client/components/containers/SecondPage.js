import React, { Component } from 'react';
import { RequestManager } from '../helpers/';
import { Link } from 'react-router-dom';

class SecondPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			object: ''
		};
	}

	componentDidMount() {
		RequestManager.getObject(4)
			.then((res) => {
				console.log(res);
				this.setState({
					object: res.data
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}

	render() {
		return(
			<div className='container'>
				<h1> Hello world!</h1>
				<button><Link to="/">Back to Landing page</Link></button>
			</div>
		);
	}
}

export default SecondPage;