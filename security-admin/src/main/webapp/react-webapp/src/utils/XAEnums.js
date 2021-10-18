export const UserRoles = {
  ROLE_SYS_ADMIN: {
    value: 0,
    label: "Admin",
    rbkey: "xa.enum.AccessResult.ACCESS_RESULT_ALLOWED",
    tt: "lbl.AccessResult_ACCESS_RESULT_ALLOWED",
  },
  ROLE_USER: {
    value: 1,
    label: "User",
    rbkey: "xa.enum.AccessResult.ACCESS_RESULT_DENIED",
    tt: "lbl.AccessResult_ACCESS_RESULT_DENIED",
  },
  ROLE_KEY_ADMIN: {
    value: 2,
    label: "KeyAdmin",
    rbkey: "xa.enum.AccessResult.ACCESS_RESULT_ALLOWED",
    tt: "lbl.AccessResult_ACCESS_RESULT_ALLOWED",
  },
  ROLE_ADMIN_AUDITOR: {
    value: 3,
    label: "Auditor",
    rbkey: "xa.enum.AccessResult.ACCESS_RESULT_ALLOWED",
    tt: "lbl.AccessResult_ACCESS_RESULT_ALLOWED",
  },
  ROLE_KEY_ADMIN_AUDITOR: {
    value: 4,
    label: "KMSAuditor",
    rbkey: "xa.enum.AccessResult.ACCESS_RESULT_ALLOWED",
    tt: "lbl.AccessResult_ACCESS_RESULT_ALLOWED",
  },
};
