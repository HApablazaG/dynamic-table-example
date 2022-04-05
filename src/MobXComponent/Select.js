import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { Autocomplete, TextField } from '@mui/material';

const selectStyles = {
  chip: {
    '&.Mui-disabled': {
      opacity: 0.7
    }
  }
};

function getOptionValueFromList (optionList, value) {
  const option = optionList.find(
    d => typeof d === 'string' ? d === value : d.id === value
  );

  return option || null;
}

function getMultipleValueList (optionList, valueList) {
  if (!Array.isArray(valueList)) {
    return [];
  }

  return valueList.map(
    value => getOptionValueFromList(optionList, value) || []
  );
}

function getStandardValue (newValue) {
  if (Array.isArray(newValue)) {
    return newValue.length === 0
      ? ''
      : newValue.map(d => typeof d === 'string' ? d : d.id)
  } else {
    return newValue === null
      ? ''
      : typeof newValue === 'string'
        ? newValue
        : newValue.id
  }
}

const MobXReactSelect = observer(
  ({
    name,
    optionName,
    store,
    label,
    multiple,
    readOnly,
    required,
    onChange,
    inputProps,
    ...otherProps
  }) => {
    const {
      data,
      error,
      [optionName]: optionList
    } = store;

    const value = useMemo(() => {
      return multiple
        ? getMultipleValueList(optionList, data[name], multiple)
        : getOptionValueFromList(optionList, data[name], multiple)
    }, [optionList, data[name], multiple]);

    const handleChange = (event, newValue) => {
      if (readOnly || !onChange) {
        return;
      }

      onChange({
        ...event,
        target: {
          ...event.target,
          name,
          value: getStandardValue(newValue)
        }
      });
    };

    const withError = error && Boolean(error[name]);
    const helperText = error && error[name];

    return (
      <Autocomplete
        id={name}
        options={optionList}
        value={value}
        onChange={handleChange}
        multiple={multiple}
        renderInput={({ disabled, ...params }) => (
          <TextField
            {...params}
            name={name}
            label={label}
            margin="dense"
            variant="standard"
            error={withError}
            helperText={helperText}
            required={required}
            readOnly={disabled}
            {...inputProps}
          />
        )}
        ChipProps={{
          sx: selectStyles.chip
        }}
        disabled={readOnly}
        {...otherProps}
      />
    )
  }
);

// Define default component props values.
MobXReactSelect.defaultProps = {
  blurOnSelect: true,
  fullWidth: true
};

// Define received props types for validation.
MobXReactSelect.propTypes = {
  name: PropTypes.string.isRequired,
  optionName: PropTypes.string.isRequired,
  store: PropTypes.shape({
    data: PropTypes.object.isRequired,
    error: PropTypes.object
  }).isRequired,
  inputProps: PropTypes.object
};

export default MobXReactSelect;
