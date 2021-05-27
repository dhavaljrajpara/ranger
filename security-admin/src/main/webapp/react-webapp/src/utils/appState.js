const appState = {};

function getUserProfile() {
  return appState.userProfile;
}

function setUserProfile(profile = null) {
  appState.userProfile = profile;
}

export { getUserProfile, setUserProfile };
