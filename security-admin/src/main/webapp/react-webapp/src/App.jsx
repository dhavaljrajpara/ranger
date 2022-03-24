import React, { Suspense, lazy, Component } from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ErrorBoundary from "Views/ErrorBoundary";
import { Loader } from "../src/components/CommonComponents";
import history from "Utils/history";
import { getUserProfile, setUserProfile } from "Utils/appState";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { isKeyAdmin } from "Utils/XAUtils";

const HeaderComp = lazy(() => import("Views/Header"));
const HomeComp = lazy(() => import("Views/Home"));
const ServiceFormComp = lazy(() => import("Views/ServiceManager/ServiceForm"));
const UserProfileComp = lazy(() => import("Views/UserProfile"));
const ZoneListingComp = lazy(() => import("Views/SecurityZone/ZoneListing"));
const CreateZoneComp = lazy(() => import("Views/SecurityZone/CreateZone"));
const UserListingComp = lazy(() =>
  import("Views/UserGroupRoleListing/UserGroupRoleListing")
);
const GroupListingComp = lazy(() =>
  import("Views/UserGroupRoleListing/UserGroupRoleListing")
);
const AuditLayout = lazy(() => import("Views/AuditEvent/AuditLayout"));
const UserForm = lazy(() =>
  import("Views/UserGroupRoleListing/users_details/AddUserView")
);
const EditUserView = lazy(() =>
  import("Views/UserGroupRoleListing/users_details/EditUserView")
);
const GroupForm = lazy(() =>
  import("Views/UserGroupRoleListing/groups_details/GroupForm")
);
const RoleForm = lazy(() =>
  import("Views/UserGroupRoleListing/role_details/RoleForm")
);
const PermissionsComp = lazy(() => import("Views/Permissions"));
const EditPermissionComp = lazy(() => import("Views/EditPermission"));
const PolicyListingTabView = lazy(() =>
  import("Views/PolicyListing/PolicyListingTabView")
);
const AddUpdatePolicyForm = lazy(() =>
  import("Views/PolicyListing/AddUpdatePolicyForm")
);
const EncryptionComp = lazy(() => import("Views/Encryption/KeyManager"));
const KeyCreateComp = lazy(() => import("Views/Encryption/KeyCreate"));

function AuthRoute({ path, component: Comp, userProfile, compProps, ...rest }) {
  if (!getUserProfile()) {
    window.location.replace("login.jsp");
    return;
  }
  return (
    <Route
      {...rest}
      exact
      render={(routeProps) => <Comp {...routeProps} {...compProps} />}
    />
  );
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: true
    };
  }

  componentDidMount() {
    this.fetchUserProfile();
  }

  fetchUserProfile = async () => {
    try {
      const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
      const profResp = await fetchApi({
        url: "users/profile"
      });
      await fetchCSRFConf();
      setUserProfile(profResp.data);
    } catch (error) {
      setUserProfile(null);
      console.error(
        `Error occurred while fetching profile or CSRF headers! ${error}`
      );
    }
    this.setState({
      loader: false
    });
  };

  render() {
    const userProfile = getUserProfile();
    const defaultProps = { userProfile };
    return (
      <ErrorBoundary>
        <Router history={history}>
          <Suspense fallback={<Loader />}>
            {!this.state.loader && <HeaderComp />}
            <section className="container-fluid">
              <div className="row mt-2">
                <div className="col-auto mr-auto">
                  <div className="col-auto mr-auto">
                    <Breadcrumb>
                      <Breadcrumb.Item href="#"></Breadcrumb.Item>
                    </Breadcrumb>
                  </div>
                </div>
                <div className="col-auto">
                  <b>Last Response Time: </b>
                  {new Date().toLocaleString("en-US", { hour12: true })}
                </div>
              </div>
              <div id="ranger-content">
                {this.state.loader ? (
                  <Loader />
                ) : (
                  <Switch>
                    <AuthRoute
                      exact
                      path="/policymanager/resource"
                      component={HomeComp}
                      userProfile={userProfile}
                      compProps={{ isTagView: false, key: "resourceHomeComp" }}
                      {...defaultProps}
                    />
                    <AuthRoute
                      exact
                      path="/userprofile"
                      component={UserProfileComp}
                      {...defaultProps}
                    />
                    <AuthRoute
                      exact
                      path="/service/:serviceDefId/create"
                      component={ServiceFormComp}
                      {...defaultProps}
                    />
                    <AuthRoute
                      exact
                      path="/service/:serviceDefId/edit/:serviceId"
                      component={ServiceFormComp}
                      {...defaultProps}
                    />
                    <AuthRoute
                      exact
                      path="/service/:serviceId/policies/:policyType"
                      component={PolicyListingTabView}
                      {...defaultProps}
                    />
                    <AuthRoute
                      path="/policymanager/tag"
                      component={HomeComp}
                      userProfile={userProfile}
                      compProps={{ isTagView: true, key: "tagHomeComp" }}
                      {...defaultProps}
                    ></AuthRoute>
                    <AuthRoute
                      exact
                      path="/service/:serviceId/policies/create/:policyType"
                      component={AddUpdatePolicyForm}
                      {...defaultProps}
                    />
                    <AuthRoute
                      exact
                      path="/service/:serviceId/policies/:policyId/edit"
                      component={AddUpdatePolicyForm}
                      {...defaultProps}
                    />
                    <AuthRoute
                      exact
                      path="/zones/zone/list"
                      component={ZoneListingComp}
                      {...defaultProps}
                    />
                    <AuthRoute
                      exact
                      path="/zones/zone/:id"
                      component={ZoneListingComp}
                      {...defaultProps}
                    />
                    <AuthRoute
                      exact
                      path="/zones/create"
                      component={CreateZoneComp}
                      {...defaultProps}
                    />
                    <AuthRoute
                      exact
                      path="/zones/edit/:id"
                      component={CreateZoneComp}
                      {...defaultProps}
                    />
                    <AuthRoute
                      exact
                      path="/users/usertab"
                      component={UserListingComp}
                      {...defaultProps}
                    />
                    <AuthRoute
                      exact
                      path="/user/create"
                      component={UserForm}
                      {...defaultProps}
                    />
                    <AuthRoute
                      exact
                      path="/user/:userID"
                      component={EditUserView}
                      {...defaultProps}
                    />
                    <AuthRoute
                      exact
                      path="/users/grouptab"
                      component={GroupListingComp}
                      {...defaultProps}
                    />
                    <AuthRoute
                      exact
                      path="/groupCreate"
                      component={GroupForm}
                      {...defaultProps}
                    />
                    <AuthRoute
                      exact
                      path="/group/:groupId"
                      component={GroupForm}
                      {...defaultProps}
                    />
                    <AuthRoute
                      exact
                      path="/users/roletab"
                      component={UserListingComp}
                      {...defaultProps}
                    />
                    <AuthRoute
                      exact
                      path="/roleCreate"
                      component={RoleForm}
                      {...defaultProps}
                    />
                    <AuthRoute
                      exact
                      path="/permissions"
                      component={PermissionsComp}
                      {...defaultProps}
                    />
                    <AuthRoute
                      exact
                      path="/bigData"
                      component={AuditLayout}
                      {...defaultProps}
                    />
                    <AuthRoute
                      exact
                      path="/kms/keys/:kmsManagePage/manage/:kmsServiceName"
                      component={EncryptionComp}
                      {...defaultProps}
                    />
                    <AuthRoute
                      exact
                      path="/kms/keys/:serviceName/create"
                      component={KeyCreateComp}
                      {...defaultProps}
                    />
                    <AuthRoute
                      exact
                      path="/permissions/:permissionId/edit"
                      component={EditPermissionComp}
                      {...defaultProps}
                    />
                    <Redirect from="/" to="/policymanager/resource" />
                  </Switch>
                )}
              </div>
              <footer>
                <div className="main-footer">
                  <div className="pull-left copy-right-text">
                    <p className="text-left">
                      <a
                        target="_blank"
                        href="http://www.apache.org/licenses/LICENSE-2.0"
                        rel="noopener noreferrer"
                      >
                        Licensed under the Apache License, Version 2.0
                      </a>
                    </p>
                  </div>
                </div>
              </footer>
            </section>
          </Suspense>
        </Router>
        <ToastContainer />
      </ErrorBoundary>
    );
  }
}
