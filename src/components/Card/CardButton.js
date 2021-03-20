//React
import React from 'react';

//Material UI
import {Card,CardContent,Typography,makeStyles, CardActionArea, CardActions, Button} from '@material-ui/core';

//Style
const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      marginLeft: '5px',
      marginBottom:'10px'
    },
    highlight:{
      width: '100%',
      marginLeft: '5px',
      marginBottom:'10px',
      outlineStyle: 'dotted',
      outlineColor: theme.palette.primary.main
    }
  }));

function CardButton(props) {

  const classes = useStyles();

  const {body, title, primaryAction, primaryLabel, secondaryLabel, secondaryAction, highlight} = props;

  return (
    <Card className={!!highlight? classes.highlight:classes.root} raised={!highlight} >
      <CardActionArea onClick={props.onClick} >
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {body}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        {!!primaryLabel &&
        <Button variant="outlined" size="small" color="primary" onClick={primaryAction}>
          {primaryLabel}
        </Button>
        }
        {!!secondaryLabel &&
          <Button variant="outlined" size="small" color="secondary" onClick={secondaryAction}>
            {secondaryLabel}
          </Button>
        }
      </CardActions>
    </Card>
  );

}

/*
              
*/

export default CardButton;