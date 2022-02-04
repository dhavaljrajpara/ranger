export const UserRoles = {
  ROLE_SYS_ADMIN: {
    value: 0,
    label: "Admin"
  },
  ROLE_USER: {
    value: 1,
    label: "User"
  },
  ROLE_KEY_ADMIN: {
    value: 2,
    label: "KeyAdmin"
  },
  ROLE_ADMIN_AUDITOR: {
    value: 3,
    label: "Auditor"
  },
  ROLE_KEY_ADMIN_AUDITOR: {
    value: 4,
    label: "KMSAuditor"
  }
};

export const UserSource = {
  XA_PORTAL_USER: {
    value: 0,
    label: "Allowed",
    rbkey: "xa.enum.AccessResult.ACCESS_RESULT_ALLOWED",
    tt: "lbl.AccessResult_ACCESS_RESULT_ALLOWED"
  },
  XA_USER: {
    value: 1,
    label: "Denied",
    rbkey: "xa.enum.AccessResult.ACCESS_RESULT_DENIED",
    tt: "lbl.AccessResult_ACCESS_RESULT_DENIED"
  }
};

export const UserTypes = {
  USER_INTERNAL: {
    value: 0,
    label: "Internal",
    rbkey: "xa.enum.AccessResult.ACCESS_RESULT_ALLOWED",
    tt: "lbl.AccessResult_ACCESS_RESULT_ALLOWED"
  },
  USER_EXTERNAL: {
    value: 1,
    label: "External",
    rbkey: "xa.enum.AccessResult.ACCESS_RESULT_DENIED",
    tt: "lbl.AccessResult_ACCESS_RESULT_DENIED"
  }
};

export const UserSyncSource = {
  USER_SYNC_UNIX: {
    value: 0,
    label: "Unix",
    rbkey: "xa.enum.UserSyncSource.USER_SYNC_UNIX",
    tt: "lbl.USER_SYNC_UNIX"
  },
  USER_SYNC_LDAPAD: {
    value: 1,
    label: "LDAP/AD",
    rbkey: "xa.enum.UserSyncSource.USER_SYNC_LDAPAD",
    tt: "lbl.USER_SYNC_LDAPAD"
  },
  USER_SYNC_FILE: {
    value: 2,
    label: "File",
    rbkey: "xa.enum.UserSyncSource.USER_SYNC_FILE",
    tt: "lbl.USER_SYNC_FILE"
  }
};

export const VisibilityStatus = {
  STATUS_HIDDEN: {
    value: 0,
    label: "Hidden",
    rbkey: "xa.enum.VisibilityStatus.IS_HIDDEN",
    tt: "lbl.VisibilityStatus_IS_HIDDEN"
  },
  STATUS_VISIBLE: {
    value: 1,
    label: "Visible",
    rbkey: "xa.enum.VisibilityStatus.IS_VISIBLE",
    tt: "lbl.VisibilityStatus_IS_VISIBLE"
  }
};

/* For Group */
export const GroupSource = {
  XA_PORTAL_GROUP: {
    value: 0,
    label: "Allowed",
    rbkey: "xa.enum.AccessResult.ACCESS_RESULT_ALLOWED",
    tt: "lbl.AccessResult_ACCESS_RESULT_ALLOWED"
  },
  XA_GROUP: {
    value: 1,
    label: "Denied",
    rbkey: "xa.enum.AccessResult.ACCESS_RESULT_DENIED",
    tt: "lbl.AccessResult_ACCESS_RESULT_DENIED"
  }
};

export const GroupTypes = {
  GROUP_INTERNAL: {
    value: 0,
    label: "Internal",
    rbkey: "xa.enum.AccessResult.ACCESS_RESULT_ALLOWED",
    tt: "lbl.AccessResult_ACCESS_RESULT_ALLOWED"
  },
  GROUP_EXTERNAL: {
    value: 1,
    label: "External",
    rbkey: "xa.enum.AccessResult.ACCESS_RESULT_DENIED",
    tt: "lbl.AccessResult_ACCESS_RESULT_DENIED"
  }
};

/* Audit Admin */
export const ClassTypes = {
  CLASS_TYPE_NONE: {
    value: 0,
    label: "None",
    rbkey: "xa.enum.ClassTypes.CLASS_TYPE_NONE",
    tt: "lbl.ClassTypes_CLASS_TYPE_NONE"
  },
  CLASS_TYPE_MESSAGE: {
    value: 1,
    label: "Message",
    rbkey: "xa.enum.ClassTypes.CLASS_TYPE_MESSAGE",
    modelName: "VXMessage",
    type: "vXMessage",
    tt: "lbl.ClassTypes_CLASS_TYPE_MESSAGE"
  },
  CLASS_TYPE_USER_PROFILE: {
    value: 2,
    label: "User Profile",
    rbkey: "xa.enum.ClassTypes.CLASS_TYPE_USER_PROFILE",
    modelName: "VXPortalUser",
    type: "vXPortalUser",
    tt: "lbl.ClassTypes_CLASS_TYPE_USER_PROFILE"
  },
  CLASS_TYPE_AUTH_SESS: {
    value: 3,
    label: "Authentication Session",
    rbkey: "xa.enum.ClassTypes.CLASS_TYPE_AUTH_SESS",
    modelName: "VXAuthSession",
    type: "vXAuthSession",
    tt: "lbl.ClassTypes_CLASS_TYPE_AUTH_SESS"
  },
  CLASS_TYPE_DATA_OBJECT: {
    value: 4,
    label: "CLASS_TYPE_DATA_OBJECT",
    rbkey: "xa.enum.ClassTypes.CLASS_TYPE_DATA_OBJECT",
    modelName: "VXDataObject",
    type: "vXDataObject",
    tt: "lbl.ClassTypes_CLASS_TYPE_DATA_OBJECT"
  },
  CLASS_TYPE_NAMEVALUE: {
    value: 5,
    label: "CLASS_TYPE_NAMEVALUE",
    rbkey: "xa.enum.ClassTypes.CLASS_TYPE_NAMEVALUE",
    tt: "lbl.ClassTypes_CLASS_TYPE_NAMEVALUE"
  },
  CLASS_TYPE_LONG: {
    value: 6,
    label: "CLASS_TYPE_LONG",
    rbkey: "xa.enum.ClassTypes.CLASS_TYPE_LONG",
    modelName: "VXLong",
    type: "vXLong",
    tt: "lbl.ClassTypes_CLASS_TYPE_LONG"
  },
  CLASS_TYPE_PASSWORD_CHANGE: {
    value: 7,
    label: "Password Change",
    rbkey: "xa.enum.ClassTypes.CLASS_TYPE_PASSWORD_CHANGE",
    modelName: "VXPasswordChange",
    type: "vXPasswordChange",
    tt: "lbl.ClassTypes_CLASS_TYPE_PASSWORD_CHANGE"
  },
  CLASS_TYPE_STRING: {
    value: 8,
    label: "CLASS_TYPE_STRING",
    rbkey: "xa.enum.ClassTypes.CLASS_TYPE_STRING",
    modelName: "VXString",
    type: "vXString",
    tt: "lbl.ClassTypes_CLASS_TYPE_STRING"
  },
  CLASS_TYPE_ENUM: {
    value: 9,
    label: "CLASS_TYPE_ENUM",
    rbkey: "xa.enum.ClassTypes.CLASS_TYPE_ENUM",
    tt: "lbl.ClassTypes_CLASS_TYPE_ENUM"
  },
  CLASS_TYPE_ENUM_ELEMENT: {
    value: 10,
    label: "CLASS_TYPE_ENUM_ELEMENT",
    rbkey: "xa.enum.ClassTypes.CLASS_TYPE_ENUM_ELEMENT",
    tt: "lbl.ClassTypes_CLASS_TYPE_ENUM_ELEMENT"
  },
  CLASS_TYPE_RESPONSE: {
    value: 11,
    label: "Response",
    rbkey: "xa.enum.ClassTypes.CLASS_TYPE_RESPONSE",
    modelName: "VXResponse",
    type: "vXResponse",
    tt: "lbl.ClassTypes_CLASS_TYPE_RESPONSE"
  },
  CLASS_TYPE_XA_ASSET: {
    value: 1000,
    label: "Asset",
    rbkey: "xa.enum.ClassTypes.CLASS_TYPE_XA_ASSET",
    modelName: "VXAsset",
    type: "vXAsset",
    tt: "lbl.ClassTypes_CLASS_TYPE_XA_ASSET"
  },
  CLASS_TYPE_XA_RESOURCE: {
    value: 1001,
    label: "Resource",
    rbkey: "xa.enum.ClassTypes.CLASS_TYPE_XA_RESOURCE",
    modelName: "VXResource",
    type: "vXResource",
    tt: "lbl.ClassTypes_CLASS_TYPE_XA_RESOURCE"
  },
  CLASS_TYPE_XA_GROUP: {
    value: 1002,
    label: "Ranger Group",
    rbkey: "xa.enum.ClassTypes.CLASS_TYPE_XA_GROUP",
    modelName: "VXGroup",
    type: "vXGroup",
    tt: "lbl.ClassTypes_CLASS_TYPE_XA_GROUP"
  },
  CLASS_TYPE_XA_USER: {
    value: 1003,
    label: "Ranger User",
    rbkey: "xa.enum.ClassTypes.CLASS_TYPE_XA_USER",
    modelName: "VXUser",
    type: "vXUser",
    tt: "lbl.ClassTypes_CLASS_TYPE_XA_USER"
  },
  CLASS_TYPE_XA_GROUP_USER: {
    value: 1004,
    label: "XA Group of Users",
    rbkey: "xa.enum.ClassTypes.CLASS_TYPE_XA_GROUP_USER",
    modelName: "VXGroupUser",
    type: "vXGroupUser",
    tt: "lbl.ClassTypes_CLASS_TYPE_XA_GROUP_USER"
  },
  CLASS_TYPE_XA_GROUP_GROUP: {
    value: 1005,
    label: "XA Group of groups",
    rbkey: "xa.enum.ClassTypes.CLASS_TYPE_XA_GROUP_GROUP",
    modelName: "VXGroupGroup",
    type: "vXGroupGroup",
    tt: "lbl.ClassTypes_CLASS_TYPE_XA_GROUP_GROUP"
  },
  CLASS_TYPE_XA_PERM_MAP: {
    value: 1006,
    label: "XA permissions for resource",
    rbkey: "xa.enum.ClassTypes.CLASS_TYPE_XA_PERM_MAP",
    modelName: "VXPermMap",
    type: "vXPermMap",
    tt: "lbl.ClassTypes_CLASS_TYPE_XA_PERM_MAP"
  },
  CLASS_TYPE_XA_AUDIT_MAP: {
    value: 1007,
    label: "XA audits for resource",
    rbkey: "xa.enum.ClassTypes.CLASS_TYPE_XA_AUDIT_MAP",
    modelName: "VXAuditMap",
    type: "vXAuditMap",
    tt: "lbl.ClassTypes_CLASS_TYPE_XA_AUDIT_MAP"
  },
  CLASS_TYPE_XA_CRED_STORE: {
    value: 1008,
    label: "XA credential store",
    rbkey: "xa.enum.ClassTypes.CLASS_TYPE_XA_CRED_STORE",
    modelName: "VXCredentialStore",
    type: "vXCredentialStore",
    tt: "lbl.ClassTypes_CLASS_TYPE_XA_CRED_STORE"
  },
  CLASS_TYPE_XA_POLICY_EXPORT_AUDIT: {
    value: 1009,
    label: "XA Policy Export Audit",
    rbkey: "xa.enum.ClassTypes.CLASS_TYPE_XA_POLICY_EXPORT_AUDIT",
    modelName: "VXPolicyExportAudit",
    type: "vXPolicyExportAudit",
    tt: "lbl.ClassTypes_CLASS_TYPE_XA_POLICY_EXPORT_AUDIT"
  },
  CLASS_TYPE_TRX_LOG: {
    value: 1010,
    label: "Transaction log",
    rbkey: "xa.enum.ClassTypes.CLASS_TYPE_TRX_LOG",
    tt: "lbl.ClassTypes_CLASS_TYPE_TRX_LOG"
  },
  CLASS_TYPE_XA_ACCESS_AUDIT: {
    value: 1011,
    label: "Access Audit",
    rbkey: "xa.enum.ClassTypes.CLASS_TYPE_XA_ACCESS_AUDIT",
    modelName: "VXAccessAudit",
    type: "vXAccessAudit",
    tt: "lbl.ClassTypes_CLASS_TYPE_XA_ACCESS_AUDIT"
  },
  CLASS_TYPE_XA_TRANSACTION_LOG_ATTRIBUTE: {
    value: 1012,
    label: "Transaction log attribute",
    rbkey: "xa.enum.ClassTypes.CLASS_TYPE_XA_TRANSACTION_LOG_ATTRIBUTE",
    tt: "lbl.ClassTypes_CLASS_TYPE_XA_TRANSACTION_LOG_ATTRIBUTE"
  },
  CLASS_TYPE_RANGER_POLICY: {
    value: 1020,
    label: "Ranger Policy",
    rbkey: "xa.enum.ClassTypes.CLASS_TYPE_RANGER_POLICY",
    modelName: "VXRangerPolicy",
    type: "vXResource",
    tt: "lbl.ClassTypes_CLASS_TYPE_RANGER_POLICY"
  },
  CLASS_TYPE_RANGER_SERVICE: {
    value: 1030,
    label: "Ranger Service",
    rbkey: "xa.enum.ClassTypes.CLASS_TYPE_RANGER_SERVICE",
    modelName: "VXRangerService",
    type: "vXRangerService",
    tt: "lbl.ClassTypes_CLASS_TYPE_RANGER_SERVICE"
  },
  CLASS_TYPE_RANGER_SECURITY_ZONE: {
    value: 1056,
    label: "Ranger Security Zone",
    rbkey: "xa.enum.ClassTypes.CLASS_TYPE_RANGER_SECURITY_ZONE",
    modelName: "VXRangerService",
    type: "vXRangerService",
    tt: "lbl.ClassTypes_CLASS_TYPE_RANGER_SECURITY_ZONE"
  },
  CLASS_TYPE_RANGER_ROLE: {
    value: 1057,
    label: "Ranger Role",
    rbkey: "xa.enum.ClassTypes.CLASS_TYPE_RANGER_ROLE",
    modelName: "VXRole",
    type: "vXRole",
    tt: "lbl.ClassTypes_CLASS_TYPE_RANGER_ROLE"
  }
};

/* Audit  LoginSession */
export const AuthStatus = {
  AUTH_STATUS_UNKNOWN: {
    value: 0,
    label: "Unknown",
    rbkey: "xa.enum.AuthStatus.AUTH_STATUS_UNKNOWN",
    tt: "lbl.AuthStatus_AUTH_STATUS_UNKNOWN"
  },
  AUTH_STATUS_SUCCESS: {
    value: 1,
    label: "Success",
    rbkey: "xa.enum.AuthStatus.AUTH_STATUS_SUCCESS",
    tt: "lbl.AuthStatus_AUTH_STATUS_SUCCESS"
  },
  AUTH_STATUS_WRONG_PASSWORD: {
    value: 2,
    label: "Wrong Password",
    rbkey: "xa.enum.AuthStatus.AUTH_STATUS_WRONG_PASSWORD",
    tt: "lbl.AuthStatus_AUTH_STATUS_WRONG_PASSWORD"
  },
  AUTH_STATUS_DISABLED: {
    value: 3,
    label: "Account Disabled",
    rbkey: "xa.enum.AuthStatus.AUTH_STATUS_DISABLED",
    tt: "lbl.AuthStatus_AUTH_STATUS_DISABLED"
  },
  AUTH_STATUS_LOCKED: {
    value: 4,
    label: "Locked",
    rbkey: "xa.enum.AuthStatus.AUTH_STATUS_LOCKED",
    tt: "lbl.AuthStatus_AUTH_STATUS_LOCKED"
  },
  AUTH_STATUS_PASSWORD_EXPIRED: {
    value: 5,
    label: "Password Expired",
    rbkey: "xa.enum.AuthStatus.AUTH_STATUS_PASSWORD_EXPIRED",
    tt: "lbl.AuthStatus_AUTH_STATUS_PASSWORD_EXPIRED"
  },
  AUTH_STATUS_USER_NOT_FOUND: {
    value: 6,
    label: "User not found",
    rbkey: "xa.enum.AuthStatus.AUTH_STATUS_USER_NOT_FOUND",
    tt: "lbl.AuthStatus_AUTH_STATUS_USER_NOT_FOUND"
  }
};

export const AuthType = {
  AUTH_TYPE_UNKNOWN: {
    value: 0,
    label: "Unknown",
    rbkey: "xa.enum.AuthType.AUTH_TYPE_UNKNOWN",
    tt: "lbl.AuthType_AUTH_TYPE_UNKNOWN"
  },
  AUTH_TYPE_PASSWORD: {
    value: 1,
    label: "Username/Password",
    rbkey: "xa.enum.AuthType.AUTH_TYPE_PASSWORD",
    tt: "lbl.AuthType_AUTH_TYPE_PASSWORD"
  },
  AUTH_TYPE_KERBEROS: {
    value: 2,
    label: "Kerberos",
    rbkey: "xa.enum.AuthType.AUTH_TYPE_KERBEROS",
    tt: "lbl.AuthType_AUTH_TYPE_KERBEROS"
  },
  AUTH_TYPE_SSO: {
    value: 3,
    label: "SingleSignOn",
    rbkey: "xa.enum.AuthType.AUTH_TYPE_SSO",
    tt: "lbl.AuthType_AUTH_TYPE_SSO"
  },
  AUTH_TYPE_TRUSTED_PROXY: {
    value: 4,
    label: "Trusted Proxy",
    rbkey: "xa.enum.AuthType.AUTH_TYPE_TRUSTED_PROXY",
    tt: "lbl.AuthType_AUTH_TYPE_TRUSTED_PROXY"
  }
};

// export const enumValueToLabel = (myEnum, value) => {
//   var element =
//     (myEnum,
//     function (element) {
//       return element.value == value;
//     });
//   return typeof element === "undefined" ? "--" : element.label;
// };

export const ActivationStatus = {
  ACT_STATUS_DISABLED: {
    value: 0,
    label: "Disabled",
    rbkey: "xa.enum.ActivationStatus.ACT_STATUS_DISABLED",
    tt: "lbl.ActivationStatus_ACT_STATUS_DISABLED"
  },
  ACT_STATUS_ACTIVE: {
    value: 1,
    label: "Active",
    rbkey: "xa.enum.ActivationStatus.ACT_STATUS_ACTIVE",
    tt: "lbl.ActivationStatus_ACT_STATUS_ACTIVE"
  }
};

/*Permission Edit Page */
export const AccessResult = {
  ACCESS_RESULT_DENIED: {
    value: 0,
    label: "Denied",
    rbkey: "xa.enum.AccessResult.ACCESS_RESULT_DENIED",
    tt: "lbl.AccessResult_ACCESS_RESULT_DENIED",
    auditFilterLabel: "DENIED"
  },
  ACCESS_RESULT_ALLOWED: {
    value: 1,
    label: "Allowed",
    rbkey: "xa.enum.AccessResult.ACCESS_RESULT_ALLOWED",
    tt: "lbl.AccessResult_ACCESS_RESULT_ALLOWED",
    auditFilterLabel: "ALLOWED"
  },
  ACCESS_RESULT_NOT_DETERMINED: {
    value: 2,
    label: "Not Determined",
    rbkey: "xa.enum.AccessResult.ACCESS_RESULT_NOT_DETERMINED",
    tt: "lbl.AccessResult_ACCESS_RESULT_NOT_DETERMINED",
    auditFilterLabel: "NOT_DETERMINED"
  }
};

export const RangerPolicyType = {
  RANGER_ACCESS_POLICY_TYPE: {
    value: 0,
    label: "Access",
    rbkey: "xa.enum.AccessResult.ACCESS_RESULT_ALLOWED",
    tt: "lbl.AccessResult_ACCESS_RESULT_ALLOWED"
  },
  RANGER_MASKING_POLICY_TYPE: {
    value: 1,
    label: "Masking",
    rbkey: "xa.enum.AccessResult.ACCESS_RESULT_DENIED",
    tt: "lbl.AccessResult_ACCESS_RESULT_DENIED"
  },
  RANGER_ROW_FILTER_POLICY_TYPE: {
    value: 2,
    label: "Row Level Filter",
    rbkey: "xa.enum.AccessResult.ACCESS_RESULT_DENIED",
    tt: "lbl.AccessResult_ACCESS_RESULT_DENIED"
  }
};

export const getEnumElementByValue = (enumObj, value) => {
  let obj;
  for (const key in enumObj) {
    if (enumObj[key].value === value) {
      obj = enumObj[key];
      break;
    }
  }
  return obj;
};

export const enumValueToLabel = (myEnum, value) => {
  var element;
  for (const key in myEnum) {
    if (myEnum[key].value === value) {
      element = myEnum[key];
    }
  }
  return element;
};
