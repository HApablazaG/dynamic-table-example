import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import {
  PlusBox as AddBoxIcon,
  Delete as DeleteIcon
} from 'mdi-material-ui';
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import {
  Checkbox,
  Select,
  TextField
} from './index';

const dynamicTableStyles = {
  listTitle: theme => ({
    paddingY: theme.spacing(1),
    paddingLeft: theme.spacing(2)
  }),
  smallColumn: {
    width: '15%'
  },
  mediumColumn: {
    width: '30%'
  },
  largeColumn: {
    width: '60%'
  },
  actionColumn: {
    width: 150
  },
  inputCell: theme => ({
    padding: theme.spacing(1)
  })
};

const DefaultCell = observer(
  ({ name, render, index, store }) => {
    if (render) {
      return render(store.data[name], index);
    }

    return store.data[name];
  }
);

function GetInput (props) {
  const { column, rowData, index, store, onChange } = props;

  switch (column.type) {
    case 'checkbox':
      return (
        <Checkbox
          id={`${rowData.uid}-checkbox-${column.field}`}
          name={column.field}
          labelPlacement="top"
          store={store}
          onChange={onChange}
        />
      );
    case 'select':
      return (
        <Select
          id={`${rowData.uid}-select-${column.field}`}
          name={column.field}
          optionName={column.optionName}
          store={store}
          onChange={onChange}
        />
      );
    case 'text':
    case 'email':
    case 'tel':
    case 'number':
      return (
        <TextField
          id={`${rowData.uid}-input-${column.field}`}
          name={column.field}
          type={column.type}
          inputProps={column.inputProps}
          store={store}
          onChange={onChange}
        />
      );
    default:
      return (
        <DefaultCell
          name={column.field}
          render={column.render}
          index={index}
          store={store}
        />
      );
  }
}

const TableToolbar = observer(
  ({ title, onAddRow }) => (
    <Typography
      sx={dynamicTableStyles.listTitle}
      variant="h6"
    >
      { title }

      <Tooltip title="Add">
        <IconButton onClick={onAddRow}>
          <AddBoxIcon />
        </IconButton>
      </Tooltip>
    </Typography>
  )
);

const TableListHead = observer(
  ({ id, store, columnName }) => {
    const { [columnName]: columns } = store;

    return (
      <TableHead>
        <TableRow>
          {
            columns.map(col => (
              <TableCell
                key={`${id}-table-head-${col.field}`}
                sx={{
                  ...(Boolean(col.isSmallColumn) && dynamicTableStyles.smallColumn),
                  ...(Boolean(col.isMediumColumn) && dynamicTableStyles.mediumColumn),
                  ...(Boolean(col.isLargeColumn) && dynamicTableStyles.largeColumn)
                }}
                align="center"
              >
                { col.title }
              </TableCell>
            ))
          }

          <TableCell
            sx={dynamicTableStyles.actionColumn}
            align="center"
          >
            Actions
          </TableCell>
        </TableRow>
      </TableHead>
    );
  }
);

const TableListBody = observer(
  ({
    id,
    name,
    columnName,
    store,
    page,
    rowsPerPage,
    emptyMessage,
    getLocalStore,
    getOnChange,
    onRemoveRow,
    setPage
  }) => {
    const {
      data: { [name]: data },
      [columnName]: columns
    } = store;

    let renderData = [];
    for (let i = page * rowsPerPage; i < data.length && i < ((page + 1) * rowsPerPage); i++) {
      renderData.push(data[i]);
    }

    const handleRemove = (id, index, rowData) => {
      return () => {
        if (page !== 0 && (data.length - 1) === page * rowsPerPage) {
          setPage(page - 1);
        }

        onRemoveRow(id, index, rowData);
      };
    };

    return (
      <TableBody>
        {
          renderData.length === 0 ? (
            <TableRow>
              <TableCell
                align="center"
                colSpan={columns.length + 1}
              >
                { emptyMessage }
              </TableCell>
            </TableRow>
          ) : renderData.map((row, index) => {
            const dataIndex = (page * rowsPerPage) + index;
            const localStore = getLocalStore(id, dataIndex, row);
            const onChange = getOnChange(dataIndex);

            return (
              <TableRow key={row.uid}>
                {
                  columns.map(col => (
                    <TableCell
                      key={`table-cell-${row.uid}-${col.field}`}
                      sx={dynamicTableStyles.inputCell}
                      align="center"
                      {...col.cellProps}
                    >
                      <GetInput
                        column={col}
                        rowData={row}
                        index={dataIndex}
                        store={localStore}
                        onChange={onChange}
                      />
                    </TableCell>
                  ))
                }

                <TableCell align="right" padding="none">
                  <Tooltip title="Delete">
                    <IconButton onClick={handleRemove(id, dataIndex)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            );
          })
        }
      </TableBody>
    )
  }
);

const TableListPagination = observer(
  ({ name, store, ...otherProps }) => {
    const {
      data: { [name]: data }
    } = store;

    return (
      <TablePagination
        component="div"
        count={data.length}
        {...otherProps}
      />
    );
  }
);

class DynamicTable extends PureComponent {
  constructor (props) {
    super(props);

    this.state = {
      page: 0,
      rowsPerPage: props.initialRowsPerPage
    };
  }

  setPage = page => {
    this.setPage({ page });
  };

  handleChangePage = (event, newPage) => {
    this.setState({
      page: newPage
    });
  };

  handleChangeRowsPerPage = event => {
    this.setState({
      page: 0,
      rowsPerPage: Number.parseInt(event.target.value, 10)
    });
  };

  handleAdd = () => {
    const { onAddRow } = this.props;

    onAddRow();
    this.setState({
      page: 0
    });
  };

  render () {
    const {
      page,
      rowsPerPage
    } = this.state;

    let {
      id,
      name,
      title,
      store,
      columnName,
      emptyMessage,
      getLocalStore,
      getOnChange,
      onRemoveRow,
      rowsPerPageOptions
    } = this.props;

    return (
      <Paper id={id}>
        <TableToolbar
          title={title}
          onAddRow={this.handleAdd}
        />

        <TableContainer>
          <Table>
            <TableListHead
              id={id}
              store={store}
              columnName={columnName}
            />

            <TableListBody
              id={id}
              name={name}
              store={store}
              page={page}
              rowsPerPage={rowsPerPage}
              columnName={columnName}
              emptyMessage={emptyMessage}
              getLocalStore={getLocalStore}
              getOnChange={getOnChange}
              onRemoveRow={onRemoveRow}
              setPage={this.setPage}
            />
          </Table>
        </TableContainer>

        <TableListPagination
          name={name}
          store={store}
          rowsPerPageOptions={rowsPerPageOptions}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={this.handleChangePage}
          onRowsPerPageChange={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

// Define default component props values.
DynamicTable.defaultProps = {
  title: '',
  emptyMessage: 'There are no records to show.',
  initialRowsPerPage: 5,
  rowsPerPageOptions: [5, 10, 20]
};

// Define received props types for validation.
DynamicTable.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  columnName: PropTypes.string.isRequired,
  store: PropTypes.shape({
    data: PropTypes.object.isRequired,
    error: PropTypes.object
  }).isRequired,
  title: PropTypes.string.isRequired,
  emptyMessage: PropTypes.string.isRequired,
  onAddRow: PropTypes.func,
  getLocalStore: PropTypes.func.isRequired,
  getOnChange: PropTypes.func.isRequired,
  onRemoveRow: PropTypes.func
};

export default DynamicTable;
