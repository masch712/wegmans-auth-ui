import React, { Component } from 'react';
import { Button, Paper, FormControl, FormLabel, Grid, TextField, InputAdornment, IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'

import * as request from 'request-promise-native';

class _LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailInputValue: '',
      passwordInputValue: '',
      showPassword: false,
    };

    this.handleSubmitForm = this.handleSubmitForm.bind(this);
    this.handleEmailInputChange = this.handleEmailInputChange.bind(this);
    this.handlePasswordInputChange = this.handlePasswordInputChange.bind(this);
    this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
    this.handleMouseDownPassword = this.handleMouseDownPassword.bind(this);
  }

  async login(email, password) {
    // hit our wegmans auth server (my lambda)
    let code;
    try {
      const response = await request({
        method: 'POST',
        uri: process.env.REACT_APP_WEGMANS_AUTH_SERVER,
        body: {
          username: email,
          password: password,
        },
        json: true
      });

      code = response.code;
    } catch (err) {
      console.log(err);
    }

    // redirect
    //TODO: validate that redirect_url is one of the expected ones from the alexa skill.  for security
    // parse query params
    const params = new URL(window.location.href).searchParams;

    let redirectUrl = new URL(params.get('redirect_uri'));
    redirectUrl.searchParams.set('state', params.get('state'));
    redirectUrl.searchParams.set('code', code);
    window.location.href = redirectUrl.href;

    return;
  }

  async handleSubmitForm(event) {
    event.preventDefault();
    await this.login(this.state.emailInputValue, this.state.passwordInputValue);
    return false;
  }

  async handleEmailInputChange(event) {
    this.setState({ emailInputValue: event.target.value });
  }

  async handlePasswordInputChange(event) {
    this.setState({ passwordInputValue: event.target.value });
  }

  handleMouseDownPassword(event) {
    event.preventDefault();
  }

  handleClickShowPassword(event) {
    this.setState({ showPassword: !this.state.showPassword });
  }

  render() {
    const classes = this.props.classes;
    return (
      <Paper className={classes.root}>
        <form onSubmit={this.handleSubmitForm}>
          <Grid
            container
            direction='column'>
            <Grid item>
              <FormLabel>Wegmans Login</FormLabel>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='email'
                className={classes.textField}
                onChange={this.handleEmailInputChange}
                value={this.state.emailInputValue} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='password'
                className={classes.textField}
                onChange={this.handlePasswordInputChange}
                value={this.state.passwordInputValue}
                type={this.state.showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment:
                    <InputAdornment>
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={this.handleClickShowPassword}
                        onMouseDown={this.handleMouseDownPassword}>
                        {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                }}
              />
            </Grid>
            <Grid item>
              <Button type='submit' >submit</Button>
            </Grid>
          </Grid>
        </form>
      </Paper >
    )
  }
}

export const LoginForm = withStyles(theme => ({
  root: {
  },
  demo: {
    height: 240,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    height: '100%',
    color: theme.palette.text.secondary,
  },
  textField: {
    padding: 20,
  }
}))(_LoginForm);