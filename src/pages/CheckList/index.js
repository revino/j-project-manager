import React,{useState, useEffect} from 'react';

//Maerial
import { makeStyles } from '@material-ui/styles';
import { Button} from '@material-ui/core';

//View
import MemoList from './MemoList'
import MemoAddModal from '../../components/MemoAddModal'

//Api
import {db} from '../../firebase'
import {getUid} from '../../auth'

//hooks
import useFirebaseListenCollection from '../../hooks/useFirebaseListenCollection';

const useStyles = makeStyles(theme => ({
    root: {
      padding: theme.spacing(2)
    }
  }));

export default function CheckList() {
  const classes = useStyles();

  const [modalOpen, setModalOpen] = useState(false);
  const [memoList, setMemoList] = useState(null);

  const {data} = useFirebaseListenCollection(db.collection(`users`).doc(getUid()).collection(`memos`).orderBy("updateDate", "desc"));

  const handleOpen  = () => { setModalOpen(true); }
  const handleClose = () => { setModalOpen(false); }

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
        <MemoAddModal open={modalOpen} handleClose={handleClose}/>
      }

      <Button className={classes.refreshButton}
        color = "primary"
        variant="outlined"
        onClick={handleOpen}
      > 추가
      </Button>

      <MemoList data={memoList}/>
    </div>
  );
}