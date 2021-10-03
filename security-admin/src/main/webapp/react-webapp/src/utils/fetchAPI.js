import axios from "axios";

import history from "./history";
import {
  RANGER_REST_CSRF_ENABLED,
  RANGER_REST_CSRF_CUSTOM_HEADER,
  RANGER_REST_CSRF_IGNORE_METHODS
} from "./appConstants";

// Global axios defaults
axios.defaults.baseURL = "/service/";

let csrfEnabled = false;
let restCsrfCustomHeader = null;
let restCsrfIgnoreMethods = [];

async function fetchApi(axiosConfig = {}, otherConf = {}) {
  if (
    csrfEnabled &&
    restCsrfIgnoreMethods.indexOf(
      (axiosConfig.method || "GET").toLowerCase()
    ) === -1 &&
    restCsrfCustomHeader
  ) {
    axiosConfig.headers = {
      ...{ [restCsrfCustomHeader]: "" },
      ...axiosConfig.headers
    };
  }
  const config = {
    ...axiosConfig
    // auth: {username:"admin", password:"admin123"}
  };

  if (otherConf && otherConf.cancelRequest) {
    /*
      Below code add "source" attribute in second argument which is use to cancel request.
      To cancel request pass cancelRequest = true in second argument.
      If cancelRequest set to true use "then" instead of "await" keyword with request to get data.
      for e.g. 
      const otherConf = { cancelRequest: true };
      fetchApi({ url: "/api/" }, otherConf)
        .then((res) => {})
        .catch((err) => {});

      *** To cancel request
      otherConf.source.cancel('Operation canceled by the user.');

      *** Don't use await keyword with cancelRequest ***
      await fetchApi({ url: "/api/" }, otherConf);
    */
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    config.cancelToken = source.token;
    otherConf.source = source;
  }

  try {
    const resp = await axios(config);
    return resp;
  } catch (error) {
    if (error && error.response && error.response.status === 419) {
      // history.push("/signin");
      window.location.replace("login.html");
    }
    throw error;
  }
}

const handleCSRFHeaders = (data) => {
  if (data.hasOwnProperty(RANGER_REST_CSRF_ENABLED)) {
    csrfEnabled = data[RANGER_REST_CSRF_ENABLED] === true;
  }
  if (data.hasOwnProperty(RANGER_REST_CSRF_CUSTOM_HEADER)) {
    restCsrfCustomHeader = (data[RANGER_REST_CSRF_CUSTOM_HEADER] || "").trim();
  }
  if (data.hasOwnProperty(RANGER_REST_CSRF_IGNORE_METHODS)) {
    restCsrfIgnoreMethods = (data[RANGER_REST_CSRF_IGNORE_METHODS] || "")
      .split(",")
      .map((val) => (val || "").toLowerCase().trim());
  }
};

const fetchCSRFConf = async () => {
  let respData = null;
  try {
    const csrfResp = await fetchApi({
      url: "plugins/csrfconf"
    });
    respData = csrfResp.data || null;
    respData && handleCSRFHeaders(respData);
  } catch (error) {
    throw Error(error);
  }
  return respData;
};

export { fetchApi, fetchCSRFConf };
