import React, {forwardRef, useEffect, useState} from 'react';

//Material Icons
import {
  ArrowDownward, Check, AddBox, ChevronLeft, ChevronRight, Clear, DeleteOutline, Edit, FilterList, FirstPage,
  LastPage, Remove, SaveAlt, Search, ViewColumn} from '@material-ui/icons';

//Material
import MaterialTable from 'material-table'
import {makeStyles, TextareaAutosize, Button, Typography} from '@material-ui/core';
import withWidth, {isWidthDown } from '@material-ui/core/withWidth';


//Style
const useStyles = makeStyles(theme => ({
  typo: {
    padding: theme.spacing(2),
  },
  textarea: {
    width: "98%"
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

const pcColumns = [
  { title: 'ID'      ,field: 'id'       , editable: 'never', width: '50'},
  
  { title: '상태'    , field: 'progress', editable: 'onUpdate',
    cellStyle: {minWidth: '160px'},
    headerStyle: {minWidth: '100px'}},
  { title: 'PJT 이름', field: 'pjtname' , editable: 'onUpdate',
    cellStyle: {minWidth: '450px'},
    headerStyle: {minWidth: '450px'}},
  { title: '사이트'  , field: 'company' , editable: 'onUpdate',
    cellStyle: {minWidth: '120px'},
    headerStyle: {minWidth: '120px'}},
  { title: '라인'    , field: 'line'    , editable: 'onUpdate',
    cellStyle: {minWidth: '140px'},
    headerStyle: {minWidth: '140px'}},
  { title: '담당자'  , field: 'pic'     , editable: 'onUpdate',
    cellStyle: {minWidth: '120'},
    headerStyle: {minWidth: '120px'}},
  { title: 'PL'      , field: 'pl'     , editable: 'onUpdate',
    cellStyle: {minWidth: '90px'},
    headerStyle: {minWidth: '90px'}},
  { title: '시작일'  , field: 'start'   , editable: 'onUpdate',
    cellStyle: {minWidth: '120px'},
    headerStyle: {minWidth: '120px'}},
  { title: '종료일'  , field: 'end'     , editable: 'onUpdate',
    cellStyle: {minWidth: '120px'},
    headerStyle: {minWidth: '120px'}},
  { title: '번호'    , field: 'pjtno'   , editable: 'onUpdate',
    cellStyle: {minWidth: '300px'},
    headerStyle: {minWidth: '300px'}}
]

const mobileColumns = [
  { title: '상태'    , field: 'progress', editable: 'onUpdate',
    cellStyle: {minWidth: '160px'},
    headerStyle: {minWidth: '100px'}},
  { title: '사이트'  , field: 'company' , editable: 'onUpdate',
    cellStyle: {minWidth: '120px'},
    headerStyle: {minWidth: '100px'}},
  { title: '라인'    , field: 'line'    , editable: 'onUpdate',
    cellStyle: {minWidth: '140px'},
    headerStyle: {minWidth: '140px'}},
  { title: 'PJT 이름', field: 'pjtname' , editable: 'onUpdate',
    cellStyle: {minWidth: '450px'},
    headerStyle: {minWidth: '450px'}},
  { title: '담당자'  , field: 'pic'     , editable: 'onUpdate',
  cellStyle: {minWidth: '120px'},
  headerStyle: {minWidth: '120px'}},
  { title: '시작일'  , field: 'start'   , editable: 'onUpdate',
  cellStyle: {minWidth: '120px'},
  headerStyle: {minWidth: '120px'}},
  { title: '종료일'  , field: 'end'     , editable: 'onUpdate',
  cellStyle: {minWidth: '120px'},
  headerStyle: {minWidth: '120px'}},
  { title: '번호'    , field: 'pjtno'   , editable: 'onUpdate',
  cellStyle: {minWidth: '300px'},
  headerStyle: {minWidth: '300px'}}
]

function CollapsibleTable(props) {
  const {onRowUpdate, onRowDelete, data, fieldData, summary} = props;
  const [columns, setColumns] = useState([]);
  const classes = useStyles();
  const isMobile = isWidthDown('sm', props.width);
  
  useEffect(() =>{

    const getHeader = (column) => (
      column.map(el =>{
        let item = el;
        for(var fieldKey in fieldData){
          if(el.field === fieldKey) {
            let lookup = {};
            for(var v of fieldData[fieldKey]){ lookup[v] = v;}
            item.lookup = lookup;
            }
        }
        return item
    }));
  
    setColumns(getHeader((isMobile && !summary)? mobileColumns:pcColumns));
  }, [fieldData,isMobile, summary]);

  const detailContent = (rowData) =>{
    let content;
    const handleChange = (e) => {
      content = e.target.value;
    }

    const handleContentUpdate = () => { 
      rowData.content = content;
      onRowUpdate(rowData)
    };
    return (
      <div className={classes.typo} display="block" >
        
        { //HTML 출력 기능
        /*rowData.content &&
          <div dangerouslySetInnerHTML={ {__html: rowData.content.replace(/(\n|\r\n)/g, '<br>')} }></div>
        */}
        <Typography variant="h5" component="div">내용</Typography>
        <TextareaAutosize id={rowData.id} className={classes.textarea} aria-label="minimum height" rowsMin={5} rowsMax={16} placeholder="내용 입력" onChange={handleChange}>
          {rowData.content}
        </TextareaAutosize>
        { !summary &&
        <Button
          variant="outlined"
          color="primary"
          size="large"
          className={classes.button}
          startIcon={<Edit/>}
          onClick={handleContentUpdate}
        > 수정
        </Button>
        }
        
      </div>
    )
  }

  return (
      <MaterialTable
        icons={tableIcons}
        columns={columns}
        data={data}
        title="전체 아이템"
        detailPanel={detailContent}
        editable={{onRowUpdate: onRowUpdate, onRowDelete: isMobile?null:onRowDelete}}
        options={{
          draggable: isMobile?false:true,
          sorting: isMobile?false:true, 
          pageSize:isMobile?5:10, 
          showTitle:(isMobile||summary)?false:true,
          search: summary?false:true,
          exportAllData: summary? false:true,
          exportButton: summary? false:true,
          paging: summary?false:true,
          toolbar: summary?false:true,
        }}
      />
  );
}

export default withWidth()(CollapsibleTable);