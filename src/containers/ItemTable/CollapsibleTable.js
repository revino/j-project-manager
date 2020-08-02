import React, {forwardRef} from 'react';

//Material Icons
import {
  ArrowDownward, Check, AddBox, ChevronLeft, ChevronRight, Clear, DeleteOutline, Edit, FilterList, FirstPage,
  LastPage, Remove, SaveAlt, Search, ViewColumn} from '@material-ui/icons';

//Material
import MaterialTable from 'material-table'
import {makeStyles, Typography } from '@material-ui/core';

//Style
const useStyles = makeStyles(theme => ({
  typo: {
    padding: theme.spacing(4),
  }
}));

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const cloumns = [
  { title: 'ID',field: 'id', editable: 'never', width: 15
  },
  { title: '상태'    , field: 'progress', editable: 'onUpdate' , width: 100},
  { title: 'PJT 이름', field: 'pjtname' , editable: 'onUpdate' },
  { title: '사이트'  , field: 'company' , editable: 'onUpdate' , width: 110},
  { title: '담당자'  , field: 'pic'     , editable: 'onUpdate' , width: 110},
  { title: '시작일'  , field: 'start'   , editable: 'onUpdate'},
  { title: '종료일'  , field: 'end'     , editable: 'onUpdate'},
  { title: '번호'    , field: 'pjtno'   , editable: 'onUpdate'}
]

export default function CollapsibleTable(props) {
  const tableData = props.data;
  const {onRowUpdate, onRowDelete} = props;
  const classes = useStyles();

  const detailContent = (rowData) =>{
    return (
      <Typography className={classes.typo} variant="h7" display="block" gutterBottom component="div">
        { rowData.content &&
          <div dangerouslySetInnerHTML={ {__html: rowData.content.replace(/(\n|\r\n)/g, '<br>')} }></div>
        }
      </Typography>
    )
  }

  return (
    <MaterialTable
      icons={tableIcons}
      columns={cloumns}
      data={tableData}
      title="전체 아이템"
      detailPanel={detailContent}
      editable={{onRowUpdate: onRowUpdate, onRowDelete: onRowDelete}}
      options={{draggable: true, pageSize:10}}
    />
  );
}