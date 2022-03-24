import { getUserProfile, setUserProfile } from "Utils/appState";
import { UserRoles } from "Utils/XAEnums";
import { filter } from "lodash";

export const LoginUser = (role) => {
  const userProfile = getUserProfile();
  const currentUserRoles = userProfile.userRoleList[0];
  if (!currentUserRoles && currentUserRoles == "") {
    return false;
  }
  return currentUserRoles.indexOf(role) > -1;
};

export const isSystemAdmin = () => {
  return LoginUser("ROLE_SYS_ADMIN") ? true : false;
};
export const isKeyAdmin = () => {
  return LoginUser("ROLE_KEY_ADMIN") ? true : false;
};
export const isUser = () => {
  return LoginUser("ROLE_USER") ? true : false;
};
export const isAuditor = () => {
  return LoginUser("ROLE_ADMIN_AUDITOR") ? true : false;
};
export const isKMSAuditor = () => {
  return LoginUser("ROLE_KEY_ADMIN_AUDITOR") ? true : false;
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
  filter(UserRoles, function (val, key) {
    if (
      isKeyAdmin() &&
      UserRoles.ROLE_SYS_ADMIN.value != val.value &&
      UserRoles.ROLE_ADMIN_AUDITOR.value != val.value
    ) {
      userRoleList.push({ value: key, label: val.label });
    } else if (
      isSystemAdmin() &&
      UserRoles.ROLE_KEY_ADMIN.value != val.value &&
      UserRoles.ROLE_KEY_ADMIN_AUDITOR.value != val.value
    ) {
      userRoleList.push({ value: key, label: val.label });
    } else if (isUser() && UserRoles.ROLE_USER.value == val.value) {
      userRoleList.push({ value: key, label: val.label });
    } else if (
      isAuditor() &&
      UserRoles.ROLE_KEY_ADMIN.value != val.value &&
      UserRoles.ROLE_KEY_ADMIN_AUDITOR.value != val.value
    ) {
      userRoleList.push({ value: key, label: val.label });
    } else if (
      isKMSAuditor() &&
      UserRoles.ROLE_SYS_ADMIN.value != val.value &&
      UserRoles.ROLE_ADMIN_AUDITOR.value != val.value
    ) {
      userRoleList.push({ value: key, label: val.label });
    }
  });
  return userRoleList;
};
