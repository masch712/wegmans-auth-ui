import React, { Component } from 'react';
import TextField from "@material-ui/core/TextField";
import { Button, Paper, FormControl, FormLabel, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import * as request from 'request-promise-native';

class _LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailInputValue: '',
      passwordInputValue: '',
    };

    this.handleSubmitForm = this.handleSubmitForm.bind(this);
    this.handleEmailInputChange = this.handleEmailInputChange.bind(this);
    this.handlePasswordInputChange = this.handlePasswordInputChange.bind(this);
  }

  async login(email, password) {
    // hit our wegmans auth server (my lambda)
    const response = await request({
      method: 'POST',
      uri: process.env.REACT_APP_WEGMANS_AUTH_SERVER,
      body: {
        username: email,
        password: password,
      },
      json: true
    });

    const code = response.code;

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
    return await this.login(this.state.emailInputValue, this.state.passwordInputValue);
  }

  async handleEmailInputChange(event) {
    this.setState({ emailInputValue: event.target.value });
  }

  async handlePasswordInputChange(event) {
    this.setState({ passwordInputValue: event.target.value });
  }

  render() {
    const classes = this.props.classes;
    return (
      <Paper className={classes.root}>
        <form onSubmit={this.handleSubmitForm}>
          <Grid
            container
            className={classes.root}
            direction='column'>
            <Grid item>
              <FormLabel>Wegmans Login</FormLabel>
            </Grid>
            <Grid item>
              <TextField
                label='email'
                onChange={this.handleEmailInputChange}
                value={this.state.emailInputValue} />
            </Grid>
            <Grid item>
              <TextField
                label='password'
                onChange={this.handlePasswordInputChange}
                value={this.state.passwordInputValue}
                type='password' />
            </Grid>
            <Grid item>
              <Button type='submit' >submit</Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    )
  }
}

export const LoginForm = withStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  demo: {
    height: 240,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    height: '100%',
    color: theme.palette.text.secondary,
  },
  control: {
    padding: theme.spacing.unit * 2,
  },
}))(_LoginForm);