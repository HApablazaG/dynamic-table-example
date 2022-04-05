import useAppStore from './store';
import {
  Card,
  CardContent,
  CardHeader
} from '@mui/material';
import { DynamicTable } from './MobXComponent';

const appStyles = {
  container: theme => ({
    margin: theme.spacing(3)
  })
};

function App() {
  const store = useAppStore();

  return (
    <Card sx={appStyles.container}>
      <CardHeader
        title="Dynamic Table Example"
      />

      <CardContent>
        <DynamicTable
          id="example-table"
          name="exampleList"
          columnName="exampleColumn"
          title="Data list"
          onAddRow={store.addRow}
          onRemoveRow={store.removeRow}
          getLocalStore={store.generateRowStore}
          getOnChange={store.generateRowOnChange}
          store={store}
        />
      </CardContent>
    </Card>
  );
}

export default App;
