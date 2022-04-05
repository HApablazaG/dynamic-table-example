import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { TextField } from '@mui/material';

const MobXTextField = observer(
  ({
    name,
    store: { data, error },
    readOnly,
    onChange,
    ...otherProps
  }) => (
    <TextField
      id={name}
      name={name}
      value={data[name]}
      onChange={readOnly ? null : onChange}
      error={error && Boolean(error[name])}
      helperText={error && error[name]}
      readOnly={readOnly}
      {...otherProps}
    />
  )
);

// Define default component props values.
MobXTextField.defaultProps = {
  variant: 'standard',
  margin: 'dense',
  fullWidth: true
};

// Define received props types for validation.
MobXTextField.propTypes = {
  name: PropTypes.string.isRequired,
  store: PropTypes.shape({
    data: PropTypes.object.isRequired,
    error: PropTypes.object
  }).isRequired
};

export default MobXTextField;
