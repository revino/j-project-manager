import React from 'react';
import { connect } from 'react-redux';
import { withRouter, useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Grid, Button, IconButton, Typography, Backdrop, CircularProgress, TextField, Box } from '@material-ui/core';

import { Google as GoogleIcon } from '../../components/Icon';

import { Formik } from "formik"
import * as Yup from 'yup';
//Action
import { requestLogin } from '../../reducers/modules/auth'

const useStyles = makeStyles(theme => ({
  
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
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
  const {requestLogin, isLoading} = props;

  const handleBack   = () => {history.goBack();};
  const handleGoogleSignIn = async() => { 
    requestLogin({isLoginType:'google'});
  };
  const handleSubmit = async(e) => { 
    requestLogin({isLoginType:'email', email:e.email, password:e.password});

  };

  return (
    <div className={classes.root}>
          <Backdrop className={classes.backdrop} open={isLoading}>
            <CircularProgress color="inherit" />
          </Backdrop>
          <div className={classes.content}>
            <div className={classes.contentHeader}>
              <IconButton onClick={handleBack}>
                <ArrowBackIcon />
              </IconButton>
            </div>
            <div className={classes.contentBody}>
                <Grid
                  className={classes.socialButtons}
                  container
                  spacing={1}
                >
                  <Grid item>

                  <Formik
                    initialValues={{
                      email: 'test@test.com',
                      password: '123456'
                    }}
                    validationSchema={Yup.object().shape({
                      email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                      password: Yup.string().max(255).required('Password is required')
                    })}
                    onSubmit={handleSubmit}
                  >
                    {({
                      errors,
                      handleBlur,
                      handleChange,
                      handleSubmit,
                      isSubmitting,
                      touched,
                      values
                    }) => (
                      <form onSubmit={handleSubmit} className={classes.form}>
                        <Box mb={3}>
                          <Typography
                            color="textPrimary"
                            variant="h2"
                          >
                            로그인
                          </Typography>
                        </Box>

                        <Button
                          onClick={handleGoogleSignIn}
                          fullWidth
                          size="large"
                          variant="contained"
                        >
                          <GoogleIcon className={classes.socialIcon} />
                          Login with Google
                        </Button>

                        <TextField
                          error={Boolean(touched.email && errors.email)}
                          fullWidth
                          helperText={touched.email && errors.email}
                          label="Email Address"
                          margin="normal"
                          name="email"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          type="email"
                          value={values.email}
                          variant="outlined"
                        />
                        <TextField
                          error={Boolean(touched.password && errors.password)}
                          fullWidth
                          helperText={touched.password && errors.password}
                          label="Password"
                          margin="normal"
                          name="password"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          type="password"
                          value={values.password}
                          variant="outlined"
                        />
                        <Box my={2}>
                          <Button
                            color="primary"
                            disabled={isSubmitting}
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                          >
                            Sign in now
                          </Button>

                        </Box>
                        <Typography
                          color="textSecondary"
                          variant="body1"
                        >
                          Don&apos;t have an account?
                          {' '}
                        </Typography>
                      </form>
                    )}
                  </Formik>

                  </Grid>
                </Grid>
            </div>
          </div>
    </div>
  );
};

const mapStateToProps = state => ({
  isLoading: state.auth.fetchingUpdate,
})

const mapDispatchToProps = dispatch => ({
  requestLogin: (payload) => dispatch(requestLogin(payload))
})


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignIn))

