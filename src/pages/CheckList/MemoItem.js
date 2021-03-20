import React,{useState} from 'react';
import { connect } from 'react-redux';

//Material Icons
import {ExpandMore} from '@material-ui/icons';

import clsx from 'clsx';

//Material Icons
import { Edit, Delete, Save, Link, Cancel} from '@material-ui/icons';

//Material
import {makeStyles, Button, Typography, Divider , Accordion, AccordionDetails, 
AccordionSummary, AccordionActions, TextareaAutosize, FormControl, Input, Popover} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';


//UI
import { useSnackbar } from 'notistack';

//API
import {db} from '../../firebase'
import {getUid} from '../../firebase/auth'

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

const talbeConverter = {
  fromFirestore:(snapshot,options) => {
    const data = snapshot.data(options);
    return {id:snapshot.id,project_name:data.project_name,content:data.content};
  }
};

function MemoItem(props) {
  const {enqueueSnackbar} = useSnackbar();
  let {item, skeleton, selectSheetId, isShare} = props;
  const classes = useStyles();

  const [editable,setEditable] = useState(false);
  const [memoTitle, setMemoTitle] = useState("");
  const [memoContent, setMemoContent] = useState("");
  const [sheetData, setSheetData] = useState({project_name:'',content:''});
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

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
  const handleClose         = ()  => { setAnchorEl(null);};

  const handleEditSave = async(e) => {
    try{
      const memoData = createMemo(memoTitle, memoContent, moment().format());
      const memosRef = isShare? db.collection(`tables`).doc(selectSheetId).collection(`memos`).doc(item.docId) :db.collection(`users`).doc(getUid()).collection(`memos`).doc(item.docId);
      await memosRef.update(memoData);
      item.title= memoTitle;
      item.content=memoContent;
      handleEditChange();
      enqueueSnackbar('업데이트 성공', { variant: 'success' } );
    }catch(err){
      enqueueSnackbar('업데이트 실패 다시 시도 해주세요', { variant: 'error' } );
      console.log(err);
    }
  };

  const handleMemoRemove  = async(e) => {
    try{

      const memosRef = isShare? db.collection(`tables`).doc(selectSheetId).collection(`memos`).doc(item.docId) :db.collection(`users`).doc(getUid()).collection(`memos`).doc(item.docId);
      await memosRef.delete();
      enqueueSnackbar('삭제 성공', { variant: 'success' } );
    }catch(err){
      enqueueSnackbar('삭제 실패 다시 시도 해주세요', { variant: 'error' } );
      console.log(err);
    }
  };

  const handleExpendCahnge = (e,expanded) => {
    if(!expanded) setEditable(false);
    else if(expanded && !!item.linkId){
      db.collection(`tables`).doc(selectSheetId).collection(`items`).doc(item.linkId).withConverter(talbeConverter).get().then( el => {

        setSheetData(el.data());
      }).catch((error) => {
        console.log("Error getting documents: ", error);
      });
    }
  }

  if(skeleton) {
    return(
      <div className={classes.root}>
     <Accordion >
        <AccordionSummary expandIcon={<Skeleton variant="circle" width={20} height={20} />} aria-controls="panel1c-content" id="panel1c-header">
          <div className={classes.summaryColumn}><Skeleton animation="wave" height={50} width={200} /></div>
          <div className={classes.summaryColumn}><Skeleton animation="wave" height={50} width={120} /></div>
        </AccordionSummary>
      </Accordion></div>)}
  else return (
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
              <Link color="primary"/><Typography color="primary" onClick={handleLinkClick}> {sheetData.project_name}</Typography>
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

                    {!!sheetData.content &&
                      <div className={classes.typography} dangerouslySetInnerHTML={ {__html: sheetData.content.replace(/(\n|\r\n)/g, '<br>')} }></div>}
                    {/*sheetData.content.split('\n').map( (line,idx) => {
                        return (<span key={idx}>{line}<br/></span>)
                    })*/}

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
                <TextareaAutosize className={classes.textarea} aria-label="minimum height" rowsMax={40} rowsMin={5} placeholder="내용 입력" defaultValue={item.content} onChange={handleContentChange}/>:
                <Typography variant="caption">
                  {!!item.content &&
                  <div dangerouslySetInnerHTML={ {__html: item.content.replace(/(\n|\r\n)/g, '<br>')} }></div>}
                </Typography>
              }
            </div>
        </div>
        </React.Fragment>
      </AccordionDetails>
      <AccordionActions className={classes.AccordionActions}>
        { editable?
          <Button variant="contained" size="large" color="primary" onClick={handleEditSave}   startIcon={<Save />}>저장</Button>:
          <Button variant="outlined" size="large" color="primary"  onClick={handleEditChange} startIcon={<Edit />}>수정</Button>
        }
        { editable?
          <Button variant="outlined" size="large" color="secondary" onClick={handleEditChange} startIcon={<Cancel />} >취소</Button>:
          <Button variant="outlined" size="large" color="secondary" onClick={handleMemoRemove} startIcon={<Delete />} >삭제</Button>
        }
      </AccordionActions>
      <Divider />

    </Accordion>
    }
    </div>
  )
}
const mapStateToProps = state => ({
  selectSheetId: state.sheetInfo.selectSheetId
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(MemoItem)