import React from 'react';
import {Switch} from 'react-router-dom';

import Layout from "./Hoc/Layout";
import Home from "./Components/Home";
import SignIn from "./Components/signIn";
import Dashboard from "./Components/admin/Dashboard";
import PrivateRoute from "./Components/authRoutes/privateRoute";
import PublicRoute from "./Components/authRoutes/publicRoute";
import AdminMatches from "./Components/admin/matches";
import AddEditMatch from "./Components/admin/matches/addEditMatch";

const Routes = (props) => {
  return (
      <Layout>
        <Switch>
          <PrivateRoute {...props} path="/admin_matches/edit_match/:id" exact component={AddEditMatch}/>
          <PrivateRoute {...props} path="/admin_matches" exact component={AdminMatches}/>
          <PrivateRoute {...props} path="/dashboard" exact component={Dashboard}/>
          <PublicRoute {...props} restricted={true} path="/sign_in" exact component={SignIn}/>
          <PublicRoute {...props} restricted={false} path="/" exact component={Home}/>
        </Switch>
      </Layout>
  );
};

export default Routes;
