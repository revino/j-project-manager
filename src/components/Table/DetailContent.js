import React, {useState, useEffect} from 'react';

//Material Icons
import {Edit} from '@material-ui/icons';

import {TextareaAutosize, Button, Typography} from '@material-ui/core';

import LineImageList from '../LineImageList'

export default function DetailContent (onRowUpdate,isSummary,classes,rowData) {
  console.log("rowdata",rowData);
  let content;
  const handleChange = (e) => { content = e.target.value;};

  const handleContentUpdate = () => { 
    rowData.content = content; 
    //onRowUpdate(rowData)
  };
  
  const handleImageUpdte = (id,e) => {
    let {images} = rowData;
    rowData.images=images.filter(image => image.id !== id);
  };

  return (
    <div className={classes.typo} display="block" >
      <p>{rowData.content}</p>
      <Typography variant="h5" component="div">내용</Typography>
      <TextareaAutosize id={rowData.id} className={classes.textarea} aria-label="minimum height" rowsMin={5} rowsMax={16} defaultValue={rowData.content} placeholder="내용 입력" onChange={handleChange}/>
      { !isSummary && rowData.images.length>0 && <LineImageList tileData={rowData.images} className={classes.list} onClickIcon={handleImageUpdte}/> }
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