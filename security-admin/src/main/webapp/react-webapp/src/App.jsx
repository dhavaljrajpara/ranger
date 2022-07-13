import React, { Suspense, lazy, Component } from "react";
import { Route, Routes, HashRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ErrorBoundary from "Views/ErrorBoundary";
import ErrorPage from "./views/ErrorPage";
import { CommonScrollButton, Loader } from "../src/components/CommonComponents";
import history from "Utils/history";
import { getUserProfile, setUserProfile } from "Utils/appState";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { hasAccessToPath } from "Utils/XAUtils";

import LayoutComp from "Views/Layout";
const HomeComp = lazy(() => import("Views/Home"));
const ServiceFormComp = lazy(() => import("Views/ServiceManager/ServiceForm"));
const UserProfileComp = lazy(() => import("Views/UserProfile"));
const ZoneListingComp = lazy(() => import("Views/SecurityZone/ZoneListing"));
const SecurityZoneFormComp = lazy(() =>
  import("Views/SecurityZone/SecurityZoneForm")
);
const UserGroupRoleListing = lazy(() =>
  import("Views/UserGroupRoleListing/UserGroupRoleListing")
);
const UserListingComp = lazy(() =>
  import("Views/UserGroupRoleListing/users_details/UserListing")
);
const GroupListingComp = lazy(() =>
  import("Views/UserGroupRoleListing/groups_details/GroupListing")
);
const RoleListingComp = lazy(() =>
  import("Views/UserGroupRoleListing/role_details/RoleListing")
);
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
const Permissions = lazy(() => import("Views/PermissionsModule/Permissions"));
const EditPermissionComp = lazy(() =>
  import("Views/PermissionsModule/EditPermission")
);
const AuditLayout = lazy(() => import("Views/AuditEvent/AuditLayout"));
const AccessLogs = lazy(() => import("Views/AuditEvent/AccessLogs"));
const AdminLogs = lazy(() => import("Views/AuditEvent/AdminLogs"));
const LoginSessionsLogs = lazy(() =>
  import("Views/AuditEvent/LoginSessionsLogs")
);
const PluginsLog = lazy(() => import("Views/AuditEvent/PluginsLog"));
const PluginStatusLogs = lazy(() =>
  import("Views/AuditEvent/PluginStatusLogs")
);
const UserSyncLogs = lazy(() => import("Views/AuditEvent/UserSync"));

const PolicyListingTabView = lazy(() =>
  import("Views/PolicyListing/PolicyListingTabView")
);
const AddUpdatePolicyForm = lazy(() =>
  import("Views/PolicyListing/AddUpdatePolicyForm")
);
const EncryptionComp = lazy(() => import("Views/Encryption/KeyManager"));
const KeyCreateComp = lazy(() => import("Views/Encryption/KeyCreate"));
const AccesLogDetailComp = lazy(() =>
  import("Views/AuditEvent/AccessLogDetail")
);
const UserAccessLayoutComp = lazy(() =>
  import("Views/Reports/UserAccessLayout")
);
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
      <ErrorBoundary history={history}>
        <Suspense fallback={<Loader />}>
          {this.state.loader ? (
            <Loader />
          ) : (
            <HashRouter>
              <Routes>
                <Route path="/" element={<LayoutComp />}>
                  {/*RANGER UI HOME Page*/}
                  <Route path="/policymanager">
                    <Route
                      path="resource"
                      element={
                        <HomeComp isTagView={false} key="resourceHomeComp" />
                      }
                    />
                    <Route
                      path="tag"
                      element={<HomeComp isTagView={true} key="tagHomeComp" />}
                    />
                  </Route>
                  <Route
                    path="/reports/userAccess"
                    element={<UserAccessLayoutComp />}
                  />
                  <Route path="/service">
                    {/* SERVICE MANAGER */}
                    <Route path=":serviceDefId">
                      {/* SERVICE CREATE */}
                      <Route path="create" element={<ServiceFormComp />} />
                      {/* SERVICE EDIT */}
                      <Route path="edit">
                        <Route
                          path=":serviceId"
                          element={<ServiceFormComp />}
                        />
                      </Route>
                    </Route>
                    {/* POLICY MANAGER */}
                    <Route path=":serviceId">
                      <Route path="policies">
                        {/* POLICY LISTING */}
                        <Route
                          path=":policyType"
                          element={<PolicyListingTabView />}
                        />
                        {/* POLICY CREATE */}
                        <Route path="create">
                          <Route
                            path=":policyType"
                            element={<AddUpdatePolicyForm />}
                          />
                        </Route>
                        {/* POLICY EDIT */}
                        <Route path=":policyId">
                          <Route
                            path="edit"
                            element={<AddUpdatePolicyForm />}
                          />
                        </Route>
                      </Route>
                    </Route>
                  </Route>
                  {/* AUDIT LOGS  */}
                  <Route path="/reports/audit" element={<AuditLayout />}>
                    <Route path="bigData" element={<AccessLogs />} />
                    <Route path="admin" element={<AdminLogs />} />
                    <Route
                      path="loginSession"
                      element={<LoginSessionsLogs />}
                    />
                    <Route path="agent" element={<PluginsLog />} />
                    <Route path="pluginStatus" element={<PluginStatusLogs />} />
                    <Route path="userSync" element={<UserSyncLogs />} />
                  </Route>
                  {/* AUDIT LOGS DETAILS VIEW */}
                  <Route
                    path="/reports/audit/eventlog/:eventId"
                    element={<AccesLogDetailComp />}
                  ></Route>
                  {/* USER/GROUP/ROLE LISTING*/}
                  <Route path="/users" element={<UserGroupRoleListing />}>
                    <Route path="usertab" element={<UserListingComp />} />
                    <Route path="grouptab" element={<GroupListingComp />} />
                    <Route path="roletab" element={<RoleListingComp />} />
                  </Route>
                  {/* USER CREATE / EDIT */}
                  <Route path="/user">
                    <Route path="create" element={<UserForm />} />
                    <Route path=":userID" element={<EditUserView />} />
                  </Route>
                  {/* GROUP CREATE / EDIT */}
                  <Route path="/group">
                    <Route path="create" element={<GroupForm />} />
                    <Route path=":groupID" element={<GroupForm />} />
                  </Route>
                  {/* ROLE CREATE / EDIT */}
                  <Route path="/role">
                    <Route path="create" element={<RoleForm />} />
                    <Route path=":roleID" element={<RoleForm />} />
                  </Route>
                  {/* PERMISSION */}
                  <Route path="/permissions">
                    <Route path="models" element={<Permissions />} />
                    <Route
                      path=":permissionId/edit"
                      element={<EditPermissionComp />}
                    />
                  </Route>
                  {/* ZONE LISTING / CREATE / EDIT */}
                  <Route path="/zones">
                    <Route path="zone/list" element={<ZoneListingComp />} />
                    <Route path="zone/:zoneId" element={<ZoneListingComp />} />
                    <Route path="create" element={<SecurityZoneFormComp />} />
                    <Route
                      path="edit/:zoneId"
                      element={<SecurityZoneFormComp />}
                    />
                  </Route>
                  {/* ENCRYPTION KEY LISTING / CREATE*/}
                  <Route path="/kms/keys">
                    <Route
                      path=":kmsManagePage/manage/:kmsServiceName"
                      element={<EncryptionComp />}
                    />
                    <Route
                      path=":serviceName/create"
                      element={<KeyCreateComp />}
                    />
                  </Route>
                  {/* USER PROFILE */}
                  <Route path="/userprofile" element={<UserProfileComp />} />
                </Route>
              </Routes>
            </HashRouter>
          )}
        </Suspense>
        <ToastContainer />
        <CommonScrollButton />
      </ErrorBoundary>
    );
  }
}
