import React,{useState} from 'react';

//Material Icons
import {ExpandMore} from '@material-ui/icons';

import clsx from 'clsx';

//Material Icons
import { Edit, Delete, Save, Link, Cancel} from '@material-ui/icons';

//Material
import {makeStyles, Button, Typography, Divider , Accordion, AccordionDetails, 
AccordionSummary, AccordionActions, TextareaAutosize, FormControl, Input,CircularProgress, Popover} from '@material-ui/core';

//API
import SheetApi from '../../api/SpreadSheetApi';
import {db} from '../../api/firebase'
import {getUid} from '../../auth'

//Time
import moment from 'moment'
import "moment/locale/ko";

moment.locale('ko');

//Style
const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2),
  },
  summary:{
    minHeight: 80
  },
  summaryColumn: {
    flexBasis: '44.33%',
    overflow:"hidden"

  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  detailsHeader: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightBold,
  },
  detailsTitle: {
    minHeight: 50,
  },
  detailsLink: {
    minHeight: 50,
    display: "flex"
  },
  detailsContent: {
    fontSize: theme.typography.pxToRem(11),
    color: theme.palette.secondary.main,
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  details: {
    display: "block"
  },
  column: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
    
  },
  detailsHeaderColumn: {
    alignItems: 'center',
    minWidth: 70,
    paddingRight: theme.spacing(1),
  },
  detailsContentColumn: {
    width: "95%",
    paddingLeft: theme.spacing(4),
    minHeight: 90,
    wordBreak:"break-all"
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(2),
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    }
  },
  detailsBody:{
    paddingTop: theme.spacing(2),
    display: "flex"
  },
  textarea: {
    width: "100%"
  },
  typography: {
    padding: theme.spacing(2),
  },
  popover:{
    overflow: "scroll",
  }
}));

function createMemo(title, content, updateDate, linkId) {
  
  if(!!linkId) return {title, content, updateDate, linkId};
  else         return {title, content, updateDate};
}


export default function MemoItem(props) {
  let {item, onUpdate} = props;
  const classes = useStyles();

  const [editable,setEditable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [memoTitle, setMemoTitle] = useState("");
  const [memoContent, setMemoContent] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [linkContent, setLinkContent] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  //Request Data
  const getTableData = async(id) =>{
    try{
    setLoading(true);

    const queryObject = { tq: `select A, J, K where A = ${id}`, sheet: `Item_Tables`}
    
    //API REQUEST
    const resJson = await SheetApi.getQueryData(queryObject);

    setLinkTitle(resJson.table.rows[0].c[1].v);
    setLinkContent(resJson.table.rows[0].c[2].v);

    setLoading(false);
    }catch(err){
      console.log(err);
    }
  }

  const handleEditChange    = (e) => { 
    if(!editable) {
      setMemoContent(item.contetn);
      setMemoTitle(item.title);
    }
    setEditable(!editable)
  };
  const handleTitleChange   = (e) => { setMemoTitle(e.target.value)};
  const handleContentChange = (e) => { setMemoContent(e.target.value)};
  const handleLinkClick     = (e) => { setAnchorEl(e.currentTarget);};
  const handleClose         = ()  => { setAnchorEl(null);
  };

  const handleEditSave = async(e) => {
    try{
      const memoData = createMemo(memoTitle, memoContent, moment().format());
      const memosRef = db.collection(`users`).doc(getUid()).collection(`memos`).doc(item.docId);
      await memosRef.update(memoData);
      item.title= memoTitle;
      item.content=memoContent;
      handleEditChange();
      
    }catch(err){
      console.log(err);
    }
  };

  const handleMemoRemove  = async(e) => {
    try{
      const memosRef = db.collection(`users`).doc(getUid()).collection(`memos`).doc(item.docId);
      await memosRef.delete();
      onUpdate();
    }catch(err){
      console.log(err);
    }
  };

  const handleExpendCahnge = (e,expanded) => {
    if(!expanded) setEditable(false);
    else if(expanded && !!item.linkId){
      getTableData(item.linkId);
    }
  }

  return (
    
    <div className={classes.root}>
    {item &&
    <Accordion  onChange={handleExpendCahnge}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1c-content"
        id="panel1c-header"
        className={classes.summary}
      >
        <div className={classes.summaryColumn}> <Typography className={classes.heading}>[{moment(item.updateDate).format('ll')}]</Typography></div>
        <div className={classes.summaryColumn}> <Typography className={classes.secondaryHeading}>{item.title}</Typography></div> 
      </AccordionSummary>
      
      <AccordionDetails className={classes.details}>
      {loading? <CircularProgress />:
        <React.Fragment>
        <div className={classes.detailsTitle}>
          { editable? 
          <FormControl fullWidth className={classes.margin}>
            <Input
              id="standard-adornment-amount"
              defaultValue={item.title}
              onChange={handleTitleChange}
            />
          </FormControl>:
          <Typography variant="h4">{item.title}</Typography>
          }
        </div>
        { !!item.linkId &&
        <div className={classes.detailsLink}>
            <React.Fragment>
              <Link color="primary"/><Typography color="primary" onClick={handleLinkClick}> {linkTitle}</Typography>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <div className={classes.popover}>
                  <Typography className={classes.typography}>
                    {linkContent.split('\n').map( (line,idx) => {
                        return (<span key={idx}>{line}<br/></span>)
                    })}
                  </Typography>
                </div>
              </Popover>
            </React.Fragment>
        </div>
        }
        <div className={classes.detailsBody}>
          <div className={classes.detailsHeaderColumn}>
              <Typography className={classes.detailsHeader }>수정일</Typography>
              <Typography className={classes.detailsContent}>{moment(item.updateDate).fromNow()}</Typography>
              <Typography className={classes.detailsHeader }>생성일</Typography>
              <Typography className={classes.detailsContent}>{moment(item.createdDate).fromNow()}</Typography>
            </div>
            
            <div className={clsx(classes.detailsContentColumn, classes.helper)}>
              { editable? 
                <TextareaAutosize className={classes.textarea} aria-label="minimum height" rowsMin={5} placeholder="내용 입력" defaultValue={item.content} onChange={handleContentChange}/>:
                <Typography variant="caption">
                  { item.content.split('\n').map( (line,idx) => {
                      return (<span key={idx}>{line}<br/></span>)
                  })}
                </Typography>
              }
            </div>
        </div>
        </React.Fragment>
      }
      </AccordionDetails>
      
      <Divider />
      <AccordionActions>
        { editable? 
          <Button variant="contained" size="large" color="primary" onClick={handleEditSave}   startIcon={<Save />}>저장</Button>:
          <Button variant="outlined" size="large" color="primary"  onClick={handleEditChange} startIcon={<Edit />}>수정</Button>
        } 
        { editable?  
          <Button variant="outlined" size="large" color="secondary" onClick={handleEditChange} startIcon={<Cancel />} >취소</Button>:
          <Button variant="outlined" size="large" color="secondary" onClick={handleMemoRemove} startIcon={<Delete />} >삭제</Button>
        }
      </AccordionActions>
    </Accordion>
    }
    </div>
    
  )
}
