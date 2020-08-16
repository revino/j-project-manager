import React,{useState, useEffect} from 'react';

//Maerial
import { makeStyles } from '@material-ui/styles';
import { Button, CircularProgress} from '@material-ui/core';

//View
import MemoList from './MemoList'
import MemoAddModal from '../../components/MemoAddModal'

//Api
import {db} from '../../api/firebase'
import {getUid} from '../../auth'

const useStyles = makeStyles(theme => ({
    root: {
      padding: theme.spacing(2)
    }
  }));

export default function CheckList() {
  const classes = useStyles();

  const [modalOpen, setModalOpen] = useState(false);
  const [memoList, setMemoList] = useState(null);

  const [loading, setLoading] = useState(false);

  //Request Data
  const getMemoList = async() =>{
    try{
      setLoading(true);
      console.log("리스트요청");

      const memosRef    = db.collection(`users`).doc(getUid()).collection(`memos`);
      const memosOrder  = memosRef.orderBy("updateDate", "desc");
      
      const response = await memosOrder.get();

      const data = response.docs.map((doc) => {
        let d = doc.data();
        d.docId= doc.id;
        return d;
      });
      
      setMemoList(data);
      setLoading(false);
    }catch(err){
      console.log(err);
    }
  }

  const handleOpen  = () => { setModalOpen(true); }
  const handleClose = () => { setModalOpen(false); }

  useEffect(() =>{
    getMemoList()
  }, [])

  return (
    <div className={classes.root}>
      { loading && <CircularProgress />}
      { modalOpen &&
        <MemoAddModal open={modalOpen} handleClose={handleClose} onUpdate={getMemoList}/>
      }
            
      { !loading &&
        <Button className={classes.refreshButton}
          color = "primary"
          variant="outlined"
          onClick={handleOpen}
        > 추가
        </Button>
      }
      { !loading && !!memoList && <MemoList data={memoList} onUpdate={getMemoList}/>}
    </div>
  );
}