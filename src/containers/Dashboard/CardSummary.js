//React
import React, {useState, useEffect, useCallback} from 'react';
import browserHistory from '../../history'

//Material UI
import {Avatar,Card,CardContent,Grid,Typography,colors,makeStyles, List, ListItem, ListItemAvatar, ListItemText} from '@material-ui/core';
import { deepOrange, teal, indigo, brown, blueGrey } from '@material-ui/core/colors';

//UI
import { useSnackbar } from 'notistack';

//API
import SheetApi from '../../api/SpreadSheetApi';

//Style
const useStyles = makeStyles((theme) => ({
    root: {
      height: '100%'
    },
    avatar: {
      backgroundColor: colors.red[600],
      height: 56,
      width: 56
    },
    differenceIcon: {
      color: colors.red[900]
    },
    differenceValue: {
      color: colors.red[900],
      marginRight: theme.spacing(1)
    },

    orange: {
        color: theme.palette.getContrastText(deepOrange[700]),
        backgroundColor: deepOrange[700],
      },
    teal: {
        color: theme.palette.getContrastText(teal[500]),
        backgroundColor: teal[500],
      },
    indigo: {
        color: theme.palette.getContrastText(indigo[500]),
        backgroundColor: indigo[500],
    },
    brown:{
        color: theme.palette.getContrastText(brown[500]),
        backgroundColor: brown[500],
    },
    blueGrey:{
      color: theme.palette.getContrastText(blueGrey[500]),
      backgroundColor: blueGrey[500],
    },
  }));



export default function CardSummary(props) {
  const {enqueueSnackbar} = useSnackbar();
  const classes = useStyles();
  const avatarColor =[classes.indigo,classes.orange, classes.blueGrey, classes.teal ,classes.brown];
  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState([]);
  const {total, company} = props;
  //Request Data
  const getTotalSummaryData = useCallback(async() =>{
    try{
    setLoading(true);
    const queryObject   = { tq: `select B,count(B) where B is not null group by B order by B desc`};

    //API REQUEST
    const response      = await SheetApi.getQueryData(queryObject);

    if(response === "403") {
      browserHistory.push("/settings");
      enqueueSnackbar('권한이 없습니다.', { variant: 'error' } );
      throw new Error(response)
    }
    else if(response === "401") {
      enqueueSnackbar('인증이 실패하였습니다.', { variant: 'error' } );
      browserHistory.push("/login");
      
      throw new Error(response)
    }

    const itemArray = response.table.rows.map (el => [el.c[0].v, el.c[1].v])

    setSummaryData(itemArray);

    setLoading(false);
    }catch(err){
      enqueueSnackbar('데이터 로드 실패', { variant: 'error' } );
      console.log(err);
    }
  },[enqueueSnackbar])

  const getCompnaySummaryData = useCallback(async() =>{
    try{
    setLoading(true);
    const queryObject   = { tq: `select C,count(C) where C is not null and B != "완료" group by C`};

    //API REQUEST
    const response       = await SheetApi.getQueryData(queryObject);

    if(response === "403") {
      browserHistory.push("/settings");
      enqueueSnackbar('권한이 없습니다.', { variant: 'error' } );
      throw new Error(response)
    }
    else if(response === "401") {
      browserHistory.push("/login");
      enqueueSnackbar('인증이 실패하였습니다.', { variant: 'error' } );
      throw new Error(response)
    }

    const itemArray = response.table.rows.map (el => [el.c[0].v, el.c[1].v])

    setSummaryData(itemArray);

    setLoading(false);
    }catch(err){
      enqueueSnackbar('데이터 로드 실패', { variant: 'error' } );
      console.log(err);
    }
  },[enqueueSnackbar])


  useEffect(() =>{
         if(total  ) getTotalSummaryData();
    else if(company) getCompnaySummaryData();
  }, [company,total,getTotalSummaryData,getCompnaySummaryData]);

  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid
          container
          justify="space-between"
          spacing={3}
        >
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h6">
            { total && "전체 상태" }
            { company && "사이트 상태" }

            </Typography>
            <List dense={true}>
              {!loading && summaryData.map( (el,idx) => 
                <ListItem key={idx}>
                  <ListItemAvatar>
                    <Avatar className={avatarColor[idx]}>
                      {el[1]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={`${el[0]}`}/>
                </ListItem>   
              )}
            </List>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

}