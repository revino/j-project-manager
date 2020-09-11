//React
import React from 'react';

//Material UI
import { GridListTile, GridListTileBar, IconButton } from '@material-ui/core';
import { DeleteOutline} from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

//Style
const useStyles = makeStyles((theme) => ({
    title: {
      color: theme.palette.primary.light,
    },
    titleBar: {
      background:
        'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    }
}));

function ImageTile(props) {

  const classes = useStyles();
  const {onClickImage, onClickIcon, title, img} = props;

  return (
    <GridListTile key={title}>
      <img src={img} alt={title} onClick={onClickImage}/>
      <GridListTileBar
        title={title}
        classes={{root: classes.titleBar,title: classes.title,}}
        actionIcon={
          <IconButton aria-label={`star ${title}`} onClick={onClickIcon}>
            <DeleteOutline className={classes.title} />
          </IconButton>
        }
      />
    </GridListTile>
  );

}



export default React.memo(ImageTile);