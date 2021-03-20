import { withStyles , makeStyles, TextField, InputAdornment } from '@material-ui/core';

import React from 'react';

//Style
const main_color = "#1a8fff";
const text_color = "#777";
const text_color_light = "#ccc";
const border_color = "#eee";
const bg_color = "#f9f9f9";
const neutral_color = "#fff";

const CssTextField = withStyles({
  root: {

  }
})(TextField);


export function RedditTextField(props) {

  return <CssTextField InputProps={{
    inputProps: { min: 0, max: 10, step:0.5 },
    endAdornment: <InputAdornment position="end">h</InputAdornment>,
  }} {...props} />;
}

export const useStyles = makeStyles((theme) => ({
  input_selected:{
    /*
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: theme.palette.primary.main,
        border: "3px solid"
      },
    },
    */
    margin: theme.spacing(1,4),
    //marginLeft: theme.spacing(4)-10

  },
  root:{

  },
  margin:{
    margin: theme.spacing(1,4),
  },


  icon: {
    color: theme.palette.icon,
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center'
  },

  //Calendar
  calendar: {
    display: "block",
    position: "relative",
    width: "100%",
    background: neutral_color,
    border: `1px solid ${border_color}}`,
    fontSize: 10
  },
  calendar_icon:{
    cursor: "pointer",
    transition: ".15s ease-out",
    '&:hover':{
      transform: "scale(1.75)",
      transition: ".25s ease-out",
      color: main_color
    },
    '&:first-of-type':{
      marginLeft: "1em"
    },
    '&:last-of-type':{
      marginRight: "1em"
    }
  },
  days:{
    textTransform: "uppercase",
    fontWeight: 400,
    color: `${text_color}`,
    fontSize: "70%",
    padding: ".75em 0",
    borderBottom: `1px solid ${border_color}`,
    '& .sunday':{
      color: `#f00`
    },
    '& .saturday':{
      color: `${main_color}`
    }
  },
  calendar_header:{
    textTransform: "uppercase",
    fontWeight: "700",
    fontSize: "115%",
    padding: ".5em 0",
    borderBottom: `1px solid ${border_color}`
  },

  //General
  body: {
    fontFamily:[
      'Open Sans',
      'Helvetica Neue',
      'Helvetica',
      'Arial',
      'sans-serif'
    ].join(","),
    fontSize: "1em",
    fontWeight: 300,
    lineHeight: 1.5,
    color: text_color,
    background: bg_color,
    position: "relative",
    '& .disabled':{
      color: `${text_color_light}`,
      pointerEvents: "none"
    },
    '& .sunday':{
      color: `#f00`
    },
    '& .saturday':{
      color: `${main_color}`
    }
  },
  header: {
    display: "box",
    width: "100%",
    padding: "1.75em 0",
    borderBottom: `1px solid ${border_color}`,
    background: neutral_color,
    '& #logo': {
      fontSize: "175%",
      textAlign: "center",
      color: main_color,
      lineHeight: 1,
      '& .icon':{
        paddingRight: ".25em"
      }
    }
  },
  main: {
    display: "block",
    margin: "0 auto",
    marginTop: "5em",
    maxWidth: "50em"
  },

  //Gid
  row: {
    margin: 0,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%"
  },
  row_middle: {
    alignItems: "center"
  },
  col: {
    flexGrow: 1,
    flexBasis: 0,
    maxWidth: "100%",
    '& .start-icon':{
      marginLeft: theme.spacing(1)
    },
    '& .end-icon':{
      marginRight: theme.spacing(1)
    }
  },
  col_start: {
    justifyContent: "flex-start",
    textAlign: "left"
  },
  col_center: {
    justifyContent: "center",
    textAlign: "center"
  },
  col_end: {
    justifyContent: "flex-end",
    textAlign: "right"
  },
  body_row:{
    borderBottom: `1px solid ${border_color}`,
    '&:last-child':{
      borderBottom: "none"
    }
  },
  body_col:{
    boxSizing: "border-box",
    flexGrow: 0,
    flexBasis: "calc(100%/7)",
    width: "calc(100%/7)"
  },

  cell:{
    position: "relative",
    height: "5em",
    borderRight: `1px solid ${border_color}`,
    borderTop: "None",
    borderBottom: "None",
    overflow: "hidden",
    //cursor: "pointer",
    background: `${neutral_color}`,
    //transition: `0.25s ease-out`,
    '&:hover':{
      background: `${bg_color}`,
      //transition: ".5s ease-out",
      '& .bg':{
        opacity: "0.05",
        transition: ".5s ease-in"
      }
    },

    '& .bg':{
      fontWeight: 700,
      lineHeight: 1,
      color: `${main_color}`,
      opacity: 0,
      fontSize: "8em",
      position: "absolute",
      top: "-.2em",
      right: "-.05em",
      transition: ".25s ease-out",
      letterSpacing: "-.07em",
      zIndex: -1
    },
    '& .number':{
      position: "absolute",
      fontSize: "82.5%",
      lineHeight: 1,
      top: ".75em",
      right: ".75em",
      fontWeight: 700,
    }
  },
  cell_selected:{
    border: "1px solid transparent",
    borderImage: `linear-gradient(45deg, ${theme.palette.primary.main} 0%,#1a8fff 40%)`,
    borderImageSlice: 1,
    '& .bg':{
      opacity: "0.3",
      transition: ".5s ease-in"
    },

  }

}));
