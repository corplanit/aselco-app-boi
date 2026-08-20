import { IonApp, IonRouterOutlet, IonSpinner, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { MembershipProvider, useMembership } from './membership/MembershipContext';
import Assistant from './pages/Assistant';
import Complaints from './pages/Complaints';
import Login from './pages/Login';
import MainTabs from './pages/MainTabs';
import MembershipSetup from './pages/membership/MembershipSetup';
import Notifications from './pages/Notifications';
import Register from './pages/Register';
import Support from './pages/Support';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Keep light theme for this UI lesson */
/* import '@ionic/react/css/palettes/dark.system.css'; */

import './theme/variables.css';
import './theme/global.css';
import './pages/Auth.css';

setupIonicReact();

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { status, needsMembershipStepper } = useMembership();

  // Only block the shell until first membership status arrives — never on later refreshes.
  const bootLoading = authLoading || (isAuthenticated && status === null);

  if (bootLoading) {
    return (
      <div className="auth-loading">
        <IonSpinner name="crescent" color="primary" />
      </div>
    );
  }

  return (
    <IonRouterOutlet>
      {!isAuthenticated ? (
        <>
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
          <Route>
            <Redirect to="/login" />
          </Route>
        </>
      ) : needsMembershipStepper ? (
        <>
          <Route exact path="/membership/setup" component={MembershipSetup} />
          <Route exact path="/login">
            <Redirect to="/membership/setup" />
          </Route>
          <Route exact path="/register">
            <Redirect to="/membership/setup" />
          </Route>
          <Route exact path="/">
            <Redirect to="/membership/setup" />
          </Route>
          <Route>
            <Redirect to="/membership/setup" />
          </Route>
        </>
      ) : (
        <>
          <Route path="/tabs" component={MainTabs} />
          <Route exact path="/notifications" component={Notifications} />
          <Route exact path="/assistant" component={Assistant} />
          <Route exact path="/complaints" component={Complaints} />
          <Route exact path="/support" component={Support} />
          <Route exact path="/membership/setup" component={MembershipSetup} />
          <Route exact path="/login">
            <Redirect to="/tabs/home" />
          </Route>
          <Route exact path="/register">
            <Redirect to="/tabs/home" />
          </Route>
          <Route exact path="/">
            <Redirect to="/tabs/home" />
          </Route>
        </>
      )}
    </IonRouterOutlet>
  );
};

/**
 * App shell:
 * - Unauthenticated → /login, /register
 * - Authenticated without membership info → /membership/setup (blocks dashboard)
 * - Authenticated with membership submitted → /tabs/*
 */
const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <MembershipProvider>
        <IonReactRouter>
          <AppRoutes />
        </IonReactRouter>
      </MembershipProvider>
    </AuthProvider>
  </IonApp>
);

export default App;
