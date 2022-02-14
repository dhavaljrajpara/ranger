import { getUserProfile, setUserProfile } from "Utils/appState";
import { UserRoles } from "Utils/XAEnums";

export const LoginUser = (role) => {
  const userProfile = getUserProfile();
  const currentUserRoles = userProfile.userRoleList;
  currentUserRoles = userProfile.userRoleList;
  if (!currentUserRoles && currentUserRoles == "") {
    return false;
  }
  if (currentUserRoles.constructor != Array) {
    currentUserRoles = [currentUserRoles];
  }
  return currentUserRoles.indexOf(role) > -1;
};

export const isSystemAdmin = () => {
  return this.LoginUser("ROLE_SYS_ADMIN") ? true : false;
};
export const isKeyAdmin = () => {
  return this.LoginUser("ROLE_KEY_ADMIN") ? true : false;
};
export const isUser = () => {
  return this.LoginUser("ROLE_USER") ? true : false;
};
export const isAuditor = () => {
  return this.LoginUser("ROLE_ADMIN_AUDITOR") ? true : false;
};
export const isKMSAuditor = () => {
  return this.LoginUser("ROLE_KEY_ADMIN_AUDITOR") ? true : false;
};
export const isRenderMasking = (dataMaskDef) => {
  return dataMaskDef &&
    dataMaskDef.maskTypes &&
    dataMaskDef.maskTypes.length > 0
    ? true
    : false;
};
export const isRenderRowFilter = (rowFilterDef) => {
  return rowFilterDef &&
    rowFilterDef.resources &&
    rowFilterDef.resources.length > 0
    ? true
    : false;
};

export const getUserAccessRoleList = () => {
  var userRoleList = [];
  _.each(UserRoles, function (val, key) {
    if (
      this.isKeyAdmin() &&
      UserRoles.ROLE_SYS_ADMIN.value != val.value &&
      UserRoles.ROLE_ADMIN_AUDITOR.value != val.value
    ) {
      userRoleList.push(key);
    } else if (
      this.isSystemAdmin() &&
      UserRoles.ROLE_KEY_ADMIN.value != val.value &&
      UserRoles.ROLE_KEY_ADMIN_AUDITOR.value != val.value
    ) {
      userRoleList.push(key);
    } else if (this.isUser() && UserRoles.ROLE_USER.value == val.value) {
      userRoleList.push(key);
    } else if (
      this.isAuditor() &&
      UserRoles.ROLE_KEY_ADMIN.value != val.value &&
      UserRoles.ROLE_KEY_ADMIN_AUDITOR.value != val.value
    ) {
      userRoleList.push(key);
    } else if (
      this.isKMSAuditor() &&
      UserRoles.ROLE_SYS_ADMIN.value != val.value &&
      UserRoles.ROLE_ADMIN_AUDITOR.value != val.value
    ) {
      userRoleList.push(key);
    }
  });
  return { userRoleList: userRoleList };
};
