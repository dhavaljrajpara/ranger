import React, { useState, useCallback, useRef } from "react";
import XATableLayout from "Components/XATableLayout";
import { AuditFilterEntries } from "Components/CommonComponents";
import moment from "moment-timezone";
import dateFormat from "dateformat";
import _, { isUndefined } from "lodash";
import { setTimeStamp } from "Utils/XAUtils";
import {
  CustomPopover,
  CustomTooltip,
  Loader
} from "../../components/CommonComponents";

function Plugin_Status() {
  const [pluginStatusListingData, setPluginStatusLogs] = useState([]);
  const [loader, setLoader] = useState(true);
  const [pageCount, setPageCount] = React.useState(0);
  const [entries, setEntries] = useState([]);
  const [updateTable, setUpdateTable] = useState(moment.now());
  const fetchIdRef = useRef(0);

  const fetchPluginStatusInfo = useCallback(
    async ({ pageSize, pageIndex }) => {
      let logsResp = [];
      let logs = [];
      let totalCount = 0;
      const fetchId = ++fetchIdRef.current;
      if (fetchId === fetchIdRef.current) {
        try {
          const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
          logsResp = await fetchApi({
            url: "plugins/plugins/info",
            params: {
              pageSize: pageSize,
              startIndex: pageIndex * pageSize
            }
          });
          logs = logsResp.data.pluginInfoList;
          totalCount = logsResp.data.totalCount;
        } catch (error) {
          console.error(
            `Error occurred while fetching Plugin Status logs! ${error}`
          );
        }
        setPluginStatusLogs(logs);
        setEntries(logsResp.data);
        setPageCount(Math.ceil(totalCount / pageSize));
        setLoader(false);
      }
    },
    [updateTable]
  );
  const isDateDifferenceMoreThanHr = (date1, date2) => {
    let diff = (date1 - date2) / 36e5;
    return diff < 0 ? true : false;
  };
  const refreshTable = () => {
    setPluginStatusLogs([]);
    setLoader(true);
    setUpdateTable(moment.now());
  };

  const contents = (val) => {
    return (
      <>
        <ul class="list-inline">
          <li class="list-inline-item">
            <strong>Last Update: </strong> Last updated time of{" "}
            {val == "Tag" ? "Tag-service" : "policy"}.
          </li>
          <li class="list-inline-item">
            <strong>Download: </strong>
            {val == "Tag"
              ? "Time when tag-based policies sync-up with Ranger."
              : "Time when policy actually downloaded(sync-up with Ranger)."}
          </li>
          <li class="list-inline-item">
            <strong>Active: </strong> Time when{" "}
            {val == "Tag" ? "tag-based" : "policy"} actually in use for
            enforcement.
          </li>
        </ul>
      </>
    );
  };

  const infoIcon = (val) => {
    return (
      <>
        <b>{val} ( Time )</b>

        <CustomPopover
          icon="fa-fw fa fa-info-circle info-icon"
          title={
            val == "Policy"
              ? "Policy (Time details)"
              : "Tag Policy (Time details)"
          }
          content={contents(val)}
          placement="left"
          trigger={["hover", "focus"]}
        />
      </>
    );
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Service Name",
        accessor: "serviceName"
      },
      {
        Header: "Service Type",
        accessor: "serviceType"
      },
      {
        Header: "Application",
        accessor: "appType"
      },
      {
        Header: "Host Name",
        accessor: "hostName"
      },
      {
        Header: "Plugin IP",
        accessor: "ipAddress"
      },
      {
        Header: "Cluster Name",
        accessor: "clusterName",
        Cell: ({ row: { original } }) => {
          return original.info.clusterName;
        }
      },

      {
        Header: infoIcon("Policy"),
        id: "policyinfo",
        columns: [
          {
            Header: "Last Update",
            accessor: "lastPolicyUpdateTime",
            Cell: ({ row: { original } }) => {
              return setTimeStamp(original.info.lastPolicyUpdateTime);
            }
          },
          {
            Header: "Download",
            accessor: "policyDownloadTime",
            Cell: ({ row: { original } }) => {
              var downloadDate = new Date(
                parseInt(original.info.policyDownloadTime)
              );

              dateFormat(
                parseInt(original.info.policyDownloadTime),
                "mm/dd/yyyy hh:MM:ss TT"
              );
              if (!isUndefined(original.info.lastPolicyUpdateTime)) {
                var lastUpdateDate = new Date(
                  parseInt(original.info.lastPolicyUpdateTime)
                );
                if (isDateDifferenceMoreThanHr(downloadDate, lastUpdateDate)) {
                  if (
                    moment(downloadDate).diff(
                      moment(lastUpdateDate),
                      "minutes"
                    ) >= -2
                  ) {
                    return (
                      <span className="text-warning">
                        <CustomTooltip
                          placement="bottom"
                          content={
                            "Policy is updated but not yet downloaded(sync-upwith Ranger)"
                          }
                          icon="fa-fw fa fa-exclamation-circle activePolicyAlert"
                        />
                        {setTimeStamp(original.info.policyDownloadTime)}
                      </span>
                    );
                  } else {
                    return (
                      <span className="text-error">
                        <CustomTooltip
                          placement="bottom"
                          content={
                            "Policy is updated but not yet downloaded(sync-upwith Ranger)"
                          }
                          icon="fa-fw fa fa-exclamation-circle activePolicyAlert"
                        />
                        {setTimeStamp(original.info.policyDownloadTime)}{" "}
                      </span>
                    );
                  }
                }
              }
              return setTimeStamp(original.info.policyDownloadTime);
            }
          },
          {
            Header: "Active",
            accessor: "policyActivationTime",
            Cell: ({ row: { original } }) => {
              let activeDate = new Date(
                parseInt(original.info.policyActivationTime)
              );

              if (!isUndefined(original.info.lastPolicyUpdateTime)) {
                let lastUpdateDate = new Date(
                  parseInt(original.info.lastPolicyUpdateTime)
                );

                if (isDateDifferenceMoreThanHr(activeDate, lastUpdateDate)) {
                  if (
                    moment(activeDate).diff(
                      moment(lastUpdateDate),
                      "minutes"
                    ) >= -2
                  ) {
                    return (
                      <span className="text-warning">
                        <CustomTooltip
                          placement="bottom"
                          content={
                            " Policy is updated but not yet used for any enforcement."
                          }
                          icon="fa-fw fa fa-exclamation-circle activePolicyAlert"
                        />
                        {setTimeStamp(original.info.policyActivationTime)}
                      </span>
                    );
                  } else {
                    return (
                      <span className="text-error">
                        <CustomTooltip
                          placement="bottom"
                          content={
                            " Policy is updated but not yet used for any enforcement."
                          }
                          icon="fa-fw fa fa-exclamation-circle activePolicyAlert"
                        />
                        {setTimeStamp(original.info.policyActivationTime)}
                      </span>
                    );
                  }
                }
              }
              return setTimeStamp(original.info.policyActivationTime);
            }
          }
        ]
      },
      {
        Header: infoIcon("Tag"),
        id: "taginfo",
        columns: [
          {
            Header: "Last Update",
            accessor: "lastTagUpdateTime",
            Cell: ({ row: { original } }) => {
              return setTimeStamp(original.info.lastTagUpdateTime);
            }
          },
          {
            Header: "Download",
            accessor: "tagDownloadTime",

            Cell: ({ row: { original } }) => {
              var downloadDate = new Date(
                parseInt(original.info.tagDownloadTime)
              );

              if (!isUndefined(original.info.lastTagUpdateTime)) {
                var lastUpdateDate = new Date(
                  parseInt(original.info.lastTagUpdateTime)
                );
                if (isDateDifferenceMoreThanHr(downloadDate, lastUpdateDate)) {
                  if (
                    moment(downloadDate).diff(
                      moment(lastUpdateDate),
                      "minutes"
                    ) >= -2
                  ) {
                    return (
                      <span className="text-warning">
                        <CustomTooltip
                          placement="bottom"
                          content={
                            "Policy is updated but not yet downloaded(sync-upwith Ranger)"
                          }
                          icon="fa-fw fa fa-exclamation-circle activePolicyAlert"
                        />
                        {setTimeStamp(original.info.tagDownloadTime)}
                      </span>
                    );
                  } else {
                    return (
                      <span className="text-error">
                        <CustomTooltip
                          placement="bottom"
                          content={
                            "Policy is updated but not yet downloaded(sync-upwith Ranger)"
                          }
                          icon="fa-fw fa fa-exclamation-circle activePolicyAlert"
                        />
                        {setTimeStamp(original.info.tagDownloadTime)}{" "}
                      </span>
                    );
                  }
                }
              }
              return setTimeStamp(original.info.tagDownloadTime);
            }
          },
          {
            Header: "Active",
            accessor: "tagActivationTime",

            Cell: ({ row: { original } }) => {
              var downloadDate = new Date(
                parseInt(original.info.tagActivationTime)
              );

              if (!isUndefined(original.info.lastTagUpdateTime)) {
                var lastUpdateDate = new Date(
                  parseInt(original.info.lastTagUpdateTime)
                );
                if (isDateDifferenceMoreThanHr(downloadDate, lastUpdateDate)) {
                  if (
                    moment(downloadDate).diff(
                      moment(lastUpdateDate),
                      "minutes"
                    ) >= -2
                  ) {
                    return (
                      <span className="text-warning">
                        <CustomTooltip
                          placement="bottom"
                          content={
                            "Policy is updated but not yet used for anyenforcement."
                          }
                          icon="fa-fw fa fa-exclamation-circle activePolicyAlert"
                        />
                        {setTimeStamp(original.info.tagActivationTime)}
                      </span>
                    );
                  } else {
                    return (
                      <span className="text-error">
                        <CustomTooltip
                          placement="bottom"
                          content={
                            "Policy is updated but not yet used for anyenforcement."
                          }
                          icon="fa-fw fa fa-exclamation-circle activePolicyAlert"
                        />
                        {setTimeStamp(original.info.tagActivationTime)}{" "}
                      </span>
                    );
                  }
                }
              }
              return setTimeStamp(original.info.tagActivationTime);
            }
          }
        ]
      }
    ],
    []
  );
  return (
    <>
      <AuditFilterEntries entries={entries} refreshTable={refreshTable} />
      <br />
      <br />
      <XATableLayout
        data={pluginStatusListingData}
        columns={columns}
        loading={loader}
        fetchData={fetchPluginStatusInfo}
        pageCount={pageCount}
      />
    </>
  );
}

export default Plugin_Status;
