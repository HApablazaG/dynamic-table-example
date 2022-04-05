import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { Checkbox, FormControlLabel } from '@mui/material';

const MobXCheckbox = observer(
  ({
    name,
    label,
    labelPlacement,
    store: { data },
    onChange,
    ...otherProps
  }) => {
    const handleChange = (event, checked) => {
      if (onChange) {
        const { value } = event.target;

        onChange({
          target: {
            id: name,
            name,
            value: checked ? value || true : ''
          }
        });
      }
    };

    return (
      <FormControlLabel
        label={label}
        labelPlacement={labelPlacement}
        control={(
          <Checkbox
            id={name}
            name={name}
            checked={!!data[name]}
            onChange={handleChange}
            {...otherProps}
          />
        )}
      />
    );
  }
);

// Define default component props values.
MobXCheckbox.defaultProps = {
  label: ''
};

// Define received props types for validation.
MobXCheckbox.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelPlacement: PropTypes.string,
  store: PropTypes.shape({
    data: PropTypes.object.isRequired,
    error: PropTypes.object
  }).isRequired,
  onChange: PropTypes.func
};

export default MobXCheckbox;
