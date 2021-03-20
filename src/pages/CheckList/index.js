import React,{useState, useEffect, useCallback} from 'react';
import { connect } from 'react-redux';

//Maerial
import { makeStyles } from '@material-ui/styles';
import { Button, AppBar, Tabs, Tab, Typography} from '@material-ui/core';
import { Person, Share}  from '@material-ui/icons';

//View
import MemoList from './MemoList'
import MemoAddModal from '../../components/MemoAddModal'

//Api
import {db} from '../../firebase'
import {getUid} from '../../firebase/auth'

//hooks
import useFirebaseListenCollection from '../../hooks/useFirebaseListenCollection';

const useStyles = makeStyles(theme => ({
    root: {
      padding: theme.spacing(2)
    },
    container: {
      margin: theme.spacing(1)
    }
  }));

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
          <Typography
          component="div"
          role="tabpanel"
          >
            {children}
          </Typography>
      )}
    </div>
  );
}

function CheckList(props) {
  const classes = useStyles();

  const {selectSheetId} = props;

  const [modalOpen, setModalOpen] = useState(false);
  const [memoList, setMemoList] = useState(null);
  const [value    , setValue    ] = useState(0);

  const {data, setRef} = useFirebaseListenCollection(db.collection(`users`).doc(getUid()).collection(`memos`).orderBy("updateDate", "desc"));

  const handleOpen  = () => { setModalOpen(true); }
  const handleClose = () => { setModalOpen(false); }
  const handleChange = (event, newValue) => {
    if(newValue === 1) setRef(db.collection(`tables`).doc(selectSheetId).collection(`memos`));
    else               setRef(db.collection(`users`).doc(getUid()).collection(`memos`).orderBy("updateDate", "desc"));
    setValue(newValue);
  };

  const getMemoList = useCallback(async(isShare) =>{
    try{
      const memosRef  = isShare?
                        db.collection(`tables`).doc(selectSheetId).collection(`memos`) : 
                        db.collection(`users`).doc(getUid()).collection(`memos`);
      const memosOrder  = memosRef.orderBy("updateDate", "desc");

      const response = await memosOrder.get();

      const data = response.docs.map((doc) => {
        let d = doc.data();
        d.docId= doc.id;
        return d;
      });

      setMemoList(data);
    }catch(err){
      console.log(err);
    }
  },[selectSheetId])

  useEffect(()=>{
    if(!!data){
      const result = data.docs.map((doc) => {
        let d = doc.data();
        d.docId= doc.id;
        return d;
      });
      setMemoList(result);
    }

  },[data]);

  return (
    <div className={classes.root}>
      { modalOpen &&
        <MemoAddModal open={modalOpen} handleClose={handleClose} onUpdate={getMemoList}/>
      }
      <AppBar position="static" color="default" id="back-to-top-anchor">
        <Tabs
          value={value} onChange={handleChange}
          aria-label="simple tabs example"
          indicatorColor="primary"
          textColor="primary"
            >
          <Tab icon={<Person />} label="개인" {...a11yProps(0)} />
          <Tab icon={<Share />} label="공유" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <div className={classes.container}>
          <Button className={classes.refreshButton}
            color = "primary"
            variant="outlined"
            onClick={handleOpen}
          > 개인 추가
          </Button>
          <MemoList data={memoList}/>
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
      <div className={classes.container}>
        <Button className={classes.refreshButton}
          color = "primary"
          variant="outlined"
          onClick={handleOpen}
        >공유 추가
        </Button>
        <MemoList data={memoList} isShare/>
        </div>
      </TabPanel>
    </div>
  );
}

const mapStateToProps = state => ({
  selectSheetId: state.sheetInfo.selectSheetId,
  userName: state.auth.user.name
})

const mapDispatchToProps = dispatch => ({
})


export default connect(mapStateToProps, mapDispatchToProps)(CheckList)