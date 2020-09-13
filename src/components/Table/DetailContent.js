import React, {useState, useCallback, useLayoutEffect} from 'react';

//Material Icons
import {Edit} from '@material-ui/icons';

import {TextareaAutosize, Button, Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core';

import LineImageList from '../LineImageList'

import moment from 'moment'

//Style
const useStyles = makeStyles(theme => ({
  typo: {
    padding: theme.spacing(2),
  },
  textarea: {
    width: "98%"
  },
  list:{
    margin: theme.spacing(0.5, 0), 
  },
  button:{
    margin: theme.spacing(0.5, 0), 
  }
}));

export default function DetailContent (props) {
  const classes = useStyles();
  const {onRowUpdate, deleteImage, uploadImage, getImgUrl, isSummary,rowData} = props;
  const [content, setContent] = useState(rowData.content);
  const [images, setImages] = useState([]);

  //const handleChange = (e) => { content = e.target.value;};
  const handleChange = (e) => { setContent(e.target.value);};
  const handleContentUpdate = () => {
    const newData = {...rowData} 
    newData.content = content; 
    onRowUpdate(newData,rowData)
  };

  const addUploadFile = useCallback(async(newFile) => {
    const currentTime = moment().format("YYMMDDhhmmss");
    const fileName = currentTime + '_' + newFile[0].name
    const uploadResponse = await uploadImage({path:`WorkManager/${fileName}`, files:newFile[0]});

    if(!!uploadResponse){
      const newData = {...rowData};
      const lastImageId = newData.images.length>0? newData.images[newData.images.length-1].id+1 : 0; 
      const newImages = {id:lastImageId, title:lastImageId, img: `gs://j-project-manager.appspot.com/WorkManager/${fileName}`}
      newData.images  = newData.images.concat(newImages);
      onRowUpdate(newData,rowData)
    }
  },[onRowUpdate,rowData,uploadImage]);
  
  const handleDeleteImage = useCallback(async(id,e) => {
    const image = rowData.images.filter((el) => { return el.id === id; })
    if(image.length>0){
      const deleteResponse = await deleteImage({path:image[0].img})
      if(!!deleteResponse){
        const newData = {...rowData} 
        const newImages = newData.images.filter(image => image.id !== id)
        newData.images  = newImages;
        onRowUpdate(newData,rowData)
      }
    }
  },[onRowUpdate,deleteImage,rowData]);
      
  useLayoutEffect(()=>{
    const getUrl = async (images) => {
      const imagesUrl = await Promise.all(images.map(image => (getImgUrl(image))))
      setImages(imagesUrl);
    }
    getUrl(rowData.images);
  },[getImgUrl,rowData.images])

  return (
    <div className={classes.typo} display="block" >
      <Typography variant="h5" component="div">내용</Typography>
      <TextareaAutosize id={rowData.id} className={classes.textarea} aria-label="minimum height" rowsMin={5} rowsMax={16} defaultValue={content} placeholder="내용 입력" onChange={handleChange}/>
      { !isSummary && <LineImageList tileData={images} className={classes.list} addUploadFile={addUploadFile} onClickIcon={handleDeleteImage}/> }
      { !isSummary &&
      <Button
        variant="outlined"
        color="primary"
        size="large"
        className={classes.button}
        startIcon={<Edit/>}
        onClick={handleContentUpdate}
      > 적용
      </Button>
      }
    </div>
  )
}