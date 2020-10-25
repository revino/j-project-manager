import React, {useState} from 'react';

//Material UI
import 'date-fns';
import {Modal, makeStyles} from '@material-ui/core';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: "70%",
    height: "90%",
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    overflow: "auto"
  }
}));


function AddModal(props) {
  const {Body, open, handleClose, ...el} = props;
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      >
      <div style={modalStyle} className={classes.paper}>
        <Body handleClose={handleClose} {...el}/>
      </div>
    </Modal>
  );
}


export default (AddModal)