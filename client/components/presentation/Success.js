import React from 'react';
import PropTypes from 'prop-types';

const Success = ({ message = ''}) => (
	<div className = "success-msg alert-success alert">
		{message}
	</div>
);

Success.propTypes = {
	message: PropTypes.string.isRequired
};
  
export default Success;