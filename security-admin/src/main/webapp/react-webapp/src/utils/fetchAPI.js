import axios from "axios";

import history from "./history";

// Global axios defaults
axios.defaults.baseURL = "/service/";

async function fetchApi(axiosConfig = {}, otherConf = {}) {
  const config = { ...axiosConfig };

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
      history.push("/login");
    }
    throw Error(error);
  }
}

export { fetchApi };
