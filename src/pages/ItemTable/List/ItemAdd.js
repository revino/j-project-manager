import React, { useState } from "react";
import { connect } from "react-redux";

//Material UI
import "date-fns";
import {
  Grid,
  TextareaAutosize,
  Divider,
  TextField,
  Button,
  makeStyles,
  Typography,
} from "@material-ui/core";

import CloudUploadIcon from "@material-ui/icons/CloudUpload";

import DatePicker from "../../../components/DatePicker";

//Time
import moment from "moment";
import useSelect from "../../../hooks/useSelect";
import useInput from "../../../hooks/useInput";
import useSelectDate from "../../../hooks/useSelectDate";
import DropBox from "../../../components/DropBox";

const useStyles = makeStyles((theme) => ({
  section1: {
    margin: theme.spacing(1, 0),
  },
  section2: {
    margin: theme.spacing(1, 0),
  },
  section3: {
    margin: theme.spacing(0.5, 0),
  },
  textarea: {
    margin: theme.spacing(1),
    width: "98%",
  },
  button: {
    margin: theme.spacing(1),
    width: "100%",
  },
}));

const changFieldData = (data) =>
  data.map((el, idx) => ({ value: idx, label: el }));

function ItemAdd(props) {
  const { fieldData, insertTableData } = props;
  const classes = useStyles();

  //dropbox
  const [progress, onChangeProgress] = useSelect("");
  const [company, onChangeCompany] = useSelect("");
  const [pl, onChangePl] = useSelect("");
  const [pic, onChangePic] = useSelect("");
  const [line, onChangeLine] = useSelect("");

  //input
  const [pjtno, onChangePjtno, isPjtNoValid] = useInput({ initialValue: "" });
  const [pjtname, onChangePjtname, isPjtNameValid] = useInput({
    initialValue: "",
  });
  const [content, onChangeContent] = useInput({ initialValue: "" });

  //date picker
  const [startDate, onChangeStartDate] = useSelectDate(moment());
  const [endDate, onChangeEndDate] = useSelectDate(moment().add(20, "days"));

  //error
  const [selectError, setSelectError] = useState({
    progress: false,
    company: false,
    pl: false,
    pic: false,
    line: false,
    pjtno: false,
    pjtname: false,
  });
  const [formError, setformError] = useState(false);

  const checkForm = () => {
    const selectState = {
      progress: progress === "",
      company: company === "",
      pl: pl === "",
      pic: pic === "",
      line: line === "",
      pjtname: pjtname === "",
      pjtno: pjtno === "",
    };
    const selectError = Object.values(selectState).some((el) => el === true);

    if (selectError) {
      setSelectError({ ...selectState });
      setformError(true);
    }

    return selectError;
  };

  const handleSubmit = async (event) => {
    if (checkForm()) return;

    const dropboxValue = {
      progress: fieldData.progress[progress],
      company: fieldData.company[company],
      line: fieldData.line[line],
      pl: fieldData.pl[pl],
      pic: fieldData.pic[pic],
    };
    const inputValue = {
      project_name: pjtname,
      project_no: pjtno,
      content,
      images: [],
    };
    const item = {
      ...dropboxValue,
      ...inputValue,
      end_date: endDate,
      start_date: startDate,
    };

    await insertTableData(item);
    props.handleClose();
    event.preventDefault();
  };

  const body = (
    <React.Fragment>
      <h2 id="simple-modal-title">아이템 추가</h2>
      <Grid container className={classes.section1}>
        <Grid item lg={2} md={4} sm={4} xl={2} xs={12} container>
          <DropBox
            error={selectError.progress}
            componentKey="progress"
            list={changFieldData(fieldData.progress)}
            label="진행도"
            value={progress}
            onChange={onChangeProgress}
          />
        </Grid>
        <Grid item lg={2} md={4} sm={4} xl={2} xs={12} container>
          <DropBox
            error={selectError.company}
            componentKey="company"
            list={changFieldData(fieldData.company)}
            label="사이트"
            value={company}
            onChange={onChangeCompany}
          />
        </Grid>
        <Grid item lg={2} md={4} sm={4} xl={2} xs={12} container>
          <DropBox
            error={selectError.pl}
            componentKey="pl"
            list={changFieldData(fieldData.pl)}
            label="PL"
            value={pl}
            onChange={onChangePl}
          />
        </Grid>
        <Grid item lg={2} md={4} sm={4} xl={2} xs={12} container>
          <DropBox
            error={selectError.pic}
            componentKey="pic"
            list={changFieldData(fieldData.pic)}
            label="담당자"
            value={pic}
            onChange={onChangePic}
          />
        </Grid>
        <Grid item lg={2} md={4} sm={4} xl={2} xs={12} container>
          <DropBox
            error={selectError.line}
            componentKey="line"
            list={changFieldData(fieldData.line)}
            label="라인"
            value={line}
            onChange={onChangeLine}
          />
        </Grid>
        <Grid item lg={2} md={4} sm={4} xl={2} xs={12} container></Grid>
      </Grid>

      <Divider />

      <Grid container className={classes.section2}>
        <Grid item lg={2} md={6} sm={6} xl={2} xs={12} container>
          <DatePicker
            componentKey="start"
            label={"시작일"}
            value={startDate}
            onChange={onChangeStartDate}
          />
        </Grid>
        <Grid item lg={2} md={6} sm={6} xl={2} xs={12} container>
          <DatePicker
            componentKey="end"
            label={"종료일"}
            value={endDate}
            onChange={onChangeEndDate}
          />
        </Grid>
      </Grid>

      <Divider />

      <Grid container className={classes.section3}>
        <Grid item lg={12} md={12} sm={12} xl={12} xs={12} container>
          <TextField
            error={selectError.pjtno || !isPjtNoValid}
            className={classes.textarea}
            id="pjt no"
            label="PJT No"
            helperText="Project 번호"
            variant="standard"
            value={pjtno}
            onChange={onChangePjtno}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xl={12} xs={12} container>
          <TextField
            error={selectError.pjtname || !isPjtNameValid}
            className={classes.textarea}
            id="pjt name"
            label="PJT Name"
            helperText="Project 이름"
            variant="standard"
            value={pjtname}
            onChange={onChangePjtname}
          />
        </Grid>

        <Grid item lg={12} md={12} sm={12} xl={12} xs={12} container>
          <TextareaAutosize
            className={classes.textarea}
            aria-label="minimum height"
            rowsMin={10}
            rowsMax={50}
            placeholder="내용 입력"
            value={content}
            onChange={onChangeContent}
          />
        </Grid>
      </Grid>
      <Grid item lg={12} md={12} sm={12} xl={12} xs={12} container>
        {!!formError && <Typography>폼 에러</Typography>}
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          startIcon={<CloudUploadIcon />}
          onClick={handleSubmit}
        >
          Upload
        </Button>
      </Grid>
    </React.Fragment>
  );

  return body;
}

const mapStateToProps = (state) => ({
  selectSheetId: state.sheetInfo.selectSheetId,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ItemAdd);
