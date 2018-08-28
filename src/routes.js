import React from 'react';
import { Route } from 'react-router';
import { Switch } from 'react-router-dom';

import App from './components/App';
import EmailVerification from './components/email_verification';

export default (
    <Route>
            <Switch>
                <Route path="/" component={App} />
                <Route path="/t_/:token" component={EmailVerification} />                
            </Switch>
    </Route>
);
