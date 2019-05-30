import React from 'react';
import PropTypes from 'prop-types';

const Error = ({ message = ''}) => (
    <div className = "alert alert-danger fade in">
        {message}
    </div>
);

Error.propTypes = {
    message: PropTypes.string.isRequired
}
  
export default Error;