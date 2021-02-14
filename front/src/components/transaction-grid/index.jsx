import * as React from 'react';
import Proptypes from 'prop-types';
import { DataGrid } from '@material-ui/data-grid';

// own
import Tags from '../tags';

const columns = [
  { field: 'description', headerName: 'Description', width: 280 },
  { field: 'emitterName', headerName: 'Emitter', width: 130 },
  { field: 'receiverName', headerName: 'Receiver', width: 130 },
  { field: 'amount', headerName: 'Amount', width: 130, type: 'number' },
  { field: 'date', headerName: 'Date', width: 130, type: 'date',
    valueGetter: (params) => new Date(params.row.date)
  },
  { field: 'account', headerName: 'Account', width: 130,
     valueGetter: (params) => params.row.account.name
  },
  { field: 'tags', headerName: 'Tags', width: 130, renderCell: (params) => { console.log(params);return <Tags tags={params.row.tags} />} },
];

export default function TransactionGrid({ transactions }) {
  return (
    <div style={{ height: '85vh', width: '100%' }}>
      {
        transactions &&
        <DataGrid rows={transactions} columns={columns} autoPageSize={true} />
      }

    </div>
  );
}

TransactionGrid.propTypes = {
  transactions: Proptypes.array,
}