//React
import React,{useCallback} from 'react';
import {useDropzone} from 'react-dropzone'

//Material UI
import { GridList, GridListTile, GridListTileBar, IconButton, CircularProgress } from '@material-ui/core';
import { DeleteOutline, AddAPhoto} from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { indigo } from '@material-ui/core/colors';


//Style
const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,

    },
    addtile:{
      display:'table-cell',
      textAlign:'center',
      color: theme.palette.getContrastText(indigo[500]),
      backgroundColor: indigo[500],
    },
    addtileicon:{
      color: theme.palette.getContrastText(indigo[500]),
      marginTop: theme.spacing(1),
    },
    gridList: {
      flexWrap: 'nowrap',
      width: '100%',
      margin: theme.spacing(0),

      transform: 'translateZ(0)'
      
    },
    title: {
      color: theme.palette.primary.light,
    },
    titleBar: {
      background:
        'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
    indigo: {
      color: theme.palette.getContrastText(indigo[500]),
      backgroundColor: indigo[500],
    },
}));

function LineImageList(props) {

  const classes = useStyles();
  const {onClickIcon, tileData} = props;

  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles)

    
  }, [])

  const {getRootProps, getInputProps, isDragActive,isDragAccept , acceptedFiles} = useDropzone({
    onDrop, noKeyboard: true, accept: 'image/jpeg, image/png'})

  const onClickMain = (e)=>{
    console.log("image click");
  }
  return (
    <div className={classes.root}>
      <GridList className={classes.gridList} cols={12} cellHeight={100}>

        <GridListTile key="Subheader" className={classes.addtile} component='div' {...getRootProps()}>
          <input {...getInputProps()} />
          { 
            isDragActive? 
              (isDragAccept?
              <React.Fragment><CircularProgress className={classes.addtileicon} /><p>Drop Here</p></React.Fragment>:
              <p>이미지가 아니야</p>
              ):(
              !!acceptedFiles && acceptedFiles.length>0? 
              <img src={ URL.createObjectURL(acceptedFiles[0])} alt={"addimage"} onClick={onClickMain}/>:
              <React.Fragment><AddAPhoto className={classes.addtileicon}  fontSize='large'/><p>Drag & Click</p></React.Fragment>)
          }
        </GridListTile>
        {tileData.map((tile) => (
        <GridListTile key={tile.title}>
          <img src={tile.img} alt={tile.title} onClick={onClickMain}/>
          <GridListTileBar
            title={tile.title}
            classes={{
              root: classes.titleBar,
              title: classes.title,
            }}
            actionIcon={
              <IconButton aria-label={`star ${tile.title}`} onClick={onClickIcon}>
                <DeleteOutline className={classes.title} />
              </IconButton>
            }
          />
        </GridListTile>
        ))}
      </GridList>
    </div>
  );

}



export default React.memo(LineImageList);