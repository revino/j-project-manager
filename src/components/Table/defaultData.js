
import React, {forwardRef} from 'react';

//Material Icons
import {
  ArrowDownward, Check, AddBox, ChevronLeft, ChevronRight, Clear, DeleteOutline, Edit, FilterList, FirstPage,
  LastPage, Remove, SaveAlt, Search, ViewColumn} from '@material-ui/icons';

export const tableIcons = {
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

export const pcColumns = [
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

export const mobileColumns = [
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

export const getOptions = (isMobile,isSummary) =>({
  draggable: isMobile?false:true,
  sorting: isMobile?false:true, 
  pageSize:isMobile?5:10, 
  showTitle:(isMobile||isSummary)?false:true,
  search: isSummary?false:true,
  exportAllData: isSummary? false:true,
  exportButton: isSummary? false:true,
  paging: isSummary?false:true,
  toolbar: isSummary?false:true,
  paginationType: "stepped"
});