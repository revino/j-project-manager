import React, {useState, useEffect} from 'react';

//Material
import MaterialTable from 'material-table'
import withWidth, {isWidthDown } from '@material-ui/core/withWidth';

//default data
import {mobileColumns, pcColumns, tableIcons} from './defaultData'

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
  const {onRowUpdate, onRowDelete, data, fieldData, detailContent, isSummary, width} = props;

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