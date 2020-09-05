import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { useHistory } from "react-router-dom";

import { makeStyles } from '@material-ui/styles';
import { Grid, Button, IconButton, Typography } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { Google as GoogleIcon } from '../../components/Icon';

//Action
import { requestLogin } from '../../reducers/modules/auth'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%'
  },
  grid: {
    height: '100%'
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  quote: {
    backgroundColor: theme.palette.neutral,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(/images/auth.jpg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  },
  quoteInner: {
    textAlign: 'center',
    flexBasis: '600px'
  },
  quoteText: {
    color: theme.palette.white,
    fontWeight: 300
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.white
  },
  bio: {
    color: theme.palette.white
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  logoImage: {
    marginLeft: theme.spacing(4)
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',

    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  form: {
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 125,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
  },
  socialButtons: {
    marginTop: theme.spacing(3)
  },
  socialIcon: {
    marginRight: theme.spacing(1)
  },
  sugestion: {
    marginTop: theme.spacing(2)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  signInButton: {
    margin: theme.spacing(2, 0)
  }
}));

function SignIn(props) {

  const classes = useStyles();
  const history = useHistory();
  const {requestLogin} = props;

  const handleBack   = () => {history.goBack();};
  const handleSignIn = async() => { requestLogin();};

  return (
    <div className={classes.root}>
          <div className={classes.content}>
            <div className={classes.contentHeader}>
              <IconButton onClick={handleBack}>
                <ArrowBackIcon />
              </IconButton>
            </div>
            <div className={classes.contentBody}>
              <form
                className={classes.form}
                onSubmit={handleSignIn}
              >
                <Typography
                  className={classes.title}
                  variant="h2"
                >
                  로그인
                </Typography>

                <Grid
                  className={classes.socialButtons}
                  container
                  spacing={1}
                >
                  <Grid item>
                    <Button
                      onClick={handleSignIn}
                      size="large"
                      variant="contained"
                    >
                      <GoogleIcon className={classes.socialIcon} />
                      Login with Google
                    </Button>
                  </Grid>
                </Grid>
        
              </form>
            </div>
          </div>
    </div>
  );
};

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
  requestLogin: () => dispatch(requestLogin())
})


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignIn))

