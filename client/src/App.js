import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';

import Box from '@mui/material/Box';
import Container from "@mui/material/Container";
import GlobalStyles from '@mui/material/GlobalStyles';

import Landing from './components/Landing';
import Login from './components/auth/Login';
import Homework from './components/Homework';
import SignUp from './components/auth/SignUp';


axios.defaults.baseURL = 'http://127.0.0.1:5000';

const App = () => (
  <Box mt={5}>
    <Container maxWidth="md">
      <Router>
        <Fragment>
          <Route exact path="/" component={Landing}/>
          <section className="container">
            <Switch>
              <Route exact path="/signup" component={SignUp}/>
              <Route exact path="/login" component={Login}/>
              <Route exact path="/homework" component={Homework}/>
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Container>
  </Box>
);

export default App;
