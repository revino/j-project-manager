//React
import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from "react-router-dom";

//Material UI
import {CardActions, CardHeader, Button, Card, Divider} from '@material-ui/core';
import BookmarkIcon from '@material-ui/icons/Bookmark';
function CardFavorite(props) {

  //props

  const history = useHistory();

  return (
    <Card>
      <CardHeader title="즐겨 찾기" />
      <Divider />
      <CardActions>
        <Button variant="contained" startIcon={<BookmarkIcon>worktime</BookmarkIcon>} size="small" color="primary" onClick={(e)=> history.push("/worktime")}>
          근무 시간
        </Button>
        <Button variant="contained" startIcon={<BookmarkIcon>memo</BookmarkIcon>} size="small" color="primary" onClick={(e)=> history.push("/checklist")}>
          메모
        </Button>
      </CardActions>
    </Card>
  );

}

const mapStateToProps = state => ({
  selectSheetId: state.sheetInfo.selectSheetId
})

const mapDispatchToProps = dispatch => ({
})


export default connect(mapStateToProps, mapDispatchToProps)(CardFavorite)
