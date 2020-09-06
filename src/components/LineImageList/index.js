//React
import React from 'react';

//UI

//Material UI
import { GridList, GridListTile, GridListTileBar, IconButton } from '@material-ui/core';
import { DeleteOutline } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

//Style
const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,

    },
    gridList: {
      flexWrap: 'nowrap',
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: 'translateZ(0)'
    },
    title: {
      color: theme.palette.primary.light,
    },
    titleBar: {
      background:
        'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
    tile:{
           
    }
}));

/*
const tileData = [
    {
        img: 'https://lh3.googleusercontent.com/a-/AOh14GjBKAHbl_gX-jRsAm4dJ91bm1zlHpZnR9f8cFDO',
        title: '이미지1',
        author: 'author',
    },
    {
        img: 'https://lh3.googleusercontent.com/a-/AOh14GjBKAHbl_gX-jRsAm4dJ91bm1zlHpZnR9f8cFDO',
        title: '이미지2',
        author: 'author',
    }
];

*/
  


function LineImageList(props) {

  const classes = useStyles();

  const {onClickIcon, tileData} = props;

  const onClickMain = (e)=>{
    console.log("image click");
  }

  return (
    <div className={classes.root}>
      <GridList className={classes.gridList} cols={5} cellHeight={100}>
        {tileData.map((tile) => (
          <GridListTile key={tile.title} className={classes.tile}>
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