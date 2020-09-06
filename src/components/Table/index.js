import React, {useState, useEffect} from 'react';

//Material Icons
import {Edit} from '@material-ui/icons';

//Material
import MaterialTable from 'material-table'
import {makeStyles, TextareaAutosize, Button, Typography} from '@material-ui/core';
import withWidth, {isWidthDown } from '@material-ui/core/withWidth';

//default data
import {mobileColumns, pcColumns, tableIcons} from './defaultData'

//component
import LineImageList from '../LineImageList'

//Style
const useStyles = makeStyles(theme => ({
  typo: {
    padding: theme.spacing(2),
  },
  textarea: {
    width: "98%"
  },
  button:{
    margin: theme.spacing(0.5, 0), 
  }
}));

const getHeader = (column,fieldData) => (
  column.map(el => {
    const lookupData = fieldData[el.field]
    let   resultTdata;
    if(!!fieldData[el.field]){
      resultTdata = lookupData.reduce(function(result, item, index, array) {
        result[item] = item;
        return result;
      }, {});
    }
    return {...el, lookup:resultTdata} 
  })
);

const getColumns = (isMobile,isSummary,fieldData) =>{
  const columns = (isMobile && !isSummary)? mobileColumns:pcColumns
  const column  = !!fieldData? getHeader(columns,fieldData): columns;
  return column

}

function Table(props) {
  const {onRowUpdate, onRowDelete, data, fieldData, isSummary, width} = props;
  const isMobile = isWidthDown('sm', width);
  
  const [tableConfig,setTableConfig] = useState({
    columns: mobileColumns,
    onRowDelete: isMobile?null:onRowDelete
  });

  useEffect(()=>{
    const column = getColumns(isMobile,isSummary,fieldData)
    setTableConfig(prevState =>({columns:column})
    );
  },[fieldData,isMobile,isSummary,setTableConfig])

  const classes = useStyles();
  
  const detailContent = (rowData) =>{
    let content;
    const handleChange = (e) => { content = e.target.value;};
    const handleContentUpdate = () => { rowData.content = content; onRowUpdate(rowData)};

    return (
      <div className={classes.typo} display="block" >
        <Typography variant="h5" component="div">내용</Typography>
        <TextareaAutosize id={rowData.id} className={classes.textarea} aria-label="minimum height" rowsMin={5} rowsMax={16} defaultValue={rowData.content} placeholder="내용 입력" onChange={handleChange}/>
        { !isSummary && rowData.image.length>0 && <LineImageList tileData={rowData.image}/> }
        { !isSummary &&
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
      columns={tableConfig.columns}
      data={ !!data? data: []}
      title="전체 아이템"
      detailPanel={detailContent}
      editable={{onRowUpdate: onRowUpdate, onRowDelete: isMobile?null:onRowDelete}}
      options={{
        draggable: false,
        sorting: isMobile?false:true, 
        pageSize:isMobile?5:10, 
        showTitle:(isMobile||isSummary)?false:true,
        search: isSummary?false:true,
        exportAllData: isSummary? false:true,
        exportButton: isSummary? false:true,
        paging: isSummary?false:true,
        toolbar: isSummary?false:true,
        paginationType: "stepped"
      }}
      localization={{body:{editRow:{deleteText: "삭제할까요?"}}}}
    />
  );
}

export default React.memo(withWidth()(Table));