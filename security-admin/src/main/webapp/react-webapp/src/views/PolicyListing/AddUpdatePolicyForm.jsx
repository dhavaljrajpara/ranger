import React, { useEffect, useReducer, useRef } from "react";
import { Form as FormB, Row, Col, Button, Badge } from "react-bootstrap";
import { Form, Field } from "react-final-form";
import AsyncCreatableSelect from "react-select/async-creatable";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import arrayMutators from "final-form-arrays";
import { groupBy, find, isEmpty, pick } from "lodash";
import { toast } from "react-toastify";
import { Loader } from "Components/CommonComponents";
import { fetchApi } from "Utils/fetchAPI";
import { RangerPolicyType, getEnumElementByValue } from "Utils/XAEnums";
import ResourceComp from "../Resources/ResourceComp";
import PolicyPermissionItem from "../PolicyListing/PolicyPermissionItem";
import { useParams, useHistory } from "react-router-dom";
import PolicyValidityPeriodComp from "./PolicyValidityPeriodComp";
import { getAllTimeZoneList } from "Utils/XAUtils";
import moment from "moment";
import { commonBreadcrumb } from "../../utils/XAUtils";

const noneOptions = {
  label: "None",
  value: "none"
};

const initialState = {
  loader: true,
  serviceDetails: null,
  serviceCompDetails: null,
  policyData: null,
  formData: {}
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_DATA":
      return {
        ...state,
        loader: false,
        serviceDetails: action.serviceDetails,
        serviceCompDetails: action.serviceCompDetails,
        policyData: action.policyData,
        formData: action.formData
      };
    default:
      throw new Error();
  }
}

const Condition = ({ when, is, children }) => (
  <Field name={when} subscription={{ value: true }}>
    {({ input: { value } }) => (value === is ? children : null)}
  </Field>
);

export default function AddUpdatePolicyForm() {
  let { serviceId, policyType, policyId } = useParams();
  const history = useHistory();
  const [policyState, dispatch] = useReducer(reducer, initialState);
  const { loader, serviceDetails, serviceCompDetails, policyData, formData } =
    policyState;
  const usersDataRef = useRef(null);
  const grpDataRef = useRef(null);
  const rolesDataRef = useRef(null);

  useEffect(() => {
    fetchInitalData();
  }, []);

  const fetchUsersData = async (inputValue) => {
    let params = { name: inputValue || "", isVisible: 1 };
    let op = [];
    if (usersDataRef.current === null || inputValue) {
      const userResp = await fetchApi({
        url: "xusers/lookup/users",
        params: params
      });
      op = userResp.data.vXStrings;
      if (!inputValue) {
        usersDataRef.current = op;
      }
    } else {
      op = usersDataRef.current;
    }

    return op.map((obj) => ({
      label: obj.value,
      value: obj.value
    }));
  };
  const fetchGroupsData = async (inputValue) => {
    let params = { name: inputValue || "", isVisible: 1 };
    let op = [];
    if (grpDataRef.current === null || inputValue) {
      const userResp = await fetchApi({
        url: "xusers/lookup/groups",
        params: params
      });
      op = userResp.data.vXStrings;
      if (!inputValue) {
        grpDataRef.current = op;
      }
    } else {
      op = grpDataRef.current;
    }

    return op.map((obj) => ({
      label: obj.value,
      value: obj.value
    }));
  };
  const fetchRolesData = async (inputValue) => {
    let params = { name: inputValue || "", isVisible: 1 };
    let op = [];
    if (rolesDataRef.current === null || inputValue) {
      const roleResp = await fetchApi({
        url: "roles/roles",
        params: params
      });
      op = roleResp.data.roles;
      if (!inputValue) {
        rolesDataRef.current = op;
      }
    } else {
      op = rolesDataRef.current;
    }

    return op.map((obj) => ({
      label: obj.name,
      value: obj.name
    }));
  };

  const fetchInitalData = async () => {
    let serviceData = await fetchServiceDetails();
    let serviceCompData = await fetchRangerServiceDefComp(serviceData);
    await fetchUsersData();
    await fetchGroupsData();
    await fetchRolesData();
    let policyData = null;
    if (policyId) {
      policyData = await fetchPolicyData();
    }
    dispatch({
      type: "SET_DATA",
      serviceDetails: serviceData,
      serviceCompDetails: serviceCompData,
      policyData: policyData || null,
      formData: generateFormData(policyData, serviceCompData)
    });
  };

  const fetchServiceDetails = async () => {
    let data = null;
    try {
      const resp = await fetchApi({
        url: `plugins/services/${serviceId}`
      });
      data = resp.data || null;
    } catch (error) {
      console.error(`Error occurred while fetching service details ! ${error}`);
    }
    return data;
  };

  const fetchRangerServiceDefComp = async (serviceData) => {
    let data = null;
    if (serviceData) {
      try {
        const resp = await fetchApi({
          url: `plugins/definitions/name/${serviceData.type}`
        });
        data = resp.data || null;
      } catch (error) {
        console.error(
          `Error occurred while fetching service defination data ! ${error}`
        );
      }
    }
    return data;
  };

  const fetchPolicyData = async () => {
    let data = null;
    try {
      const resp = await fetchApi({
        url: `plugins/policies/${policyId}`
      });
      data = resp.data || null;
    } catch (error) {
      console.error(`Error occurred while fetching service details ! ${error}`);
    }
    return data;
  };

  const fetchPolicyLabel = async (inputValue) => {
    let params = {};
    if (inputValue) {
      params["policyLabel"] = inputValue || "";
    }
    const policyLabalResp = await fetchApi({
      url: "plugins/policyLabels",
      params: params
    });

    return policyLabalResp.data.map((name) => ({
      label: name,
      value: name
    }));
  };

  const generateFormData = (policyData, serviceCompData) => {
    let data = {};
    data.policyType = policyId ? policyData.policyType : policyType;
    data.policyItems =
      policyId && policyData.policyItems.length > 0
        ? setPolicyItemVal(policyData.policyItems, serviceCompData.accessTypes)
        : [{}];
    data.allowExceptions =
      policyId && policyData.allowExceptions.length > 0
        ? setPolicyItemVal(
            policyData.allowExceptions,
            serviceCompData.accessTypes
          )
        : [{}];
    data.denyPolicyItems =
      policyId && policyData.denyPolicyItems.length > 0
        ? setPolicyItemVal(
            policyData.denyPolicyItems,
            serviceCompData.accessTypes
          )
        : [{}];
    data.denyExceptions =
      policyId && policyData.denyExceptions.length > 0
        ? setPolicyItemVal(
            policyData.denyExceptions,
            serviceCompData.accessTypes
          )
        : [{}];
    data.dataMaskPolicyItems =
      policyId && policyData.dataMaskPolicyItems.length > 0
        ? setPolicyItemVal(
            policyData.dataMaskPolicyItems,
            serviceCompData.dataMaskDef.accessTypes,
            serviceCompData.dataMaskDef.maskTypes
          )
        : [{}];
    data.rowFilterPolicyItems =
      policyId && policyData.rowFilterPolicyItems.length > 0
        ? setPolicyItemVal(
            policyData.rowFilterPolicyItems,
            serviceCompData.rowFilterDef.accessTypes
          )
        : [{}];
    if (policyId) {
      data.policyName = policyData.name;
      data.isEnabled = policyData.isEnabled;
      data.policyPriority = policyData.policyPriority == 0 ? false : true;
      data.description = policyData.description;
      data.isAuditEnabled = policyData.isAuditEnabled;
      data.policyLabel = policyData.policyLabels.map((val) => {
        return { label: val, value: val };
      });
      let serviceCompResourcesDetails;
      if (
        RangerPolicyType.RANGER_MASKING_POLICY_TYPE.value ==
        policyData.policyType
      ) {
        serviceCompResourcesDetails = serviceCompData.dataMaskDef.resources;
      } else if (
        RangerPolicyType.RANGER_ROW_FILTER_POLICY_TYPE.value ==
        policyData.policyType
      ) {
        serviceCompResourcesDetails = serviceCompData.rowFilterDef.resources;
      } else {
        serviceCompResourcesDetails = serviceCompData.resources;
      }
      if (policyData.resources) {
        Object.entries(policyData.resources).map(([key, value]) => {
          let setResources = find(serviceCompResourcesDetails, ["name", key]);
          data[`resourceName-${setResources.level}`] = setResources;
          data[`value-${setResources.level}`] = value.values.map((m) => {
            return { label: m, value: m };
          });
          if (setResources.excludesSupported) {
            data[`isExcludesSupport-${setResources.level}`] = value.isExcludes;
          }
          if (setResources.recursiveSupported) {
            data[`isRecursiveSupport-${setResources.level}`] =
              value.isRecursive;
          }
        });
      }
      if (policyData.validitySchedules) {
        data["validitySchedules"] = [];
        policyData.validitySchedules.filter((val) => {
          let obj = {};
          if (val.endTime) {
            obj["endTime"] = moment(val.endTime, "YYYY/MM/DD HH:mm:ss");
          }
          if (val.startTime) {
            obj["startTime"] = moment(val.startTime, "YYYY/MM/DD HH:mm:ss");
          }
          if (val.timeZone) {
            obj["timeZone"] = getAllTimeZoneList().find((tZoneVal) => {
              return tZoneVal.id == val.timeZone;
            });
          }
          data["validitySchedules"].push(obj);
        });
      }
    }
    data.isDenyAllElse = policyData?.isDenyAllElse || false;
    return data;
  };

  const getPolicyItemsVal = (formData, name) => {
    var policyResourceItem = [];
    for (let key of formData[name]) {
      if (!isEmpty(key) && Object.entries(key).length > 0) {
        let obj = {};
        console.log(key);
        if (key.delegateAdmin != "undefined" && key.delegateAdmin != null) {
          obj.delegateAdmin = key.delegateAdmin;
        }
        if (key.accesses) {
          obj.accesses = key.accesses.map(({ value }) => ({
            type: value,
            isAllowed: true
          }));
        }
        if (key.users && key.users.length > 0) {
          obj.users = key.users.map(({ value }) => value);
        }
        if (key.groups && key.groups.length > 0) {
          obj.groups = key.groups.map(({ value }) => value);
        }
        if (key.roles && key.roles.length > 0) {
          obj.roles = key.roles.map(({ value }) => value);
        }
        if (key.rowFilterInfo != "undefined" && key.rowFilterInfo != null) {
          obj.rowFilterInfo = {};
          obj.rowFilterInfo.filterExpr = key.rowFilterInfo;
        }
        if (key.dataMaskInfo != "undefined" && key.dataMaskInfo != null) {
          obj.dataMaskInfo = {};
          obj.dataMaskInfo.dataMaskType = key.dataMaskInfo.value;
          obj.dataMaskInfo.valueExpr = "";
        }
        policyResourceItem.push(obj);
      }
    }
    return policyResourceItem;
  };

  const setPolicyItemVal = (formData, accessTypes, maskTypes) => {
    return formData.map((val) => {
      let obj = {},
        accessTypesObj = [];

      if (val.hasOwnProperty("delegateAdmin")) {
        obj.delegateAdmin = val.delegateAdmin;
      }
      for (let i = 0; val.accesses.length > i; i++) {
        accessTypes.map((opt) => {
          if (val.accesses[i].type == opt.name) {
            accessTypesObj.push({ label: opt.label, value: opt.name });
          }
        });
      }
      obj["accesses"] = accessTypesObj;
      if (val.groups.length > 0) {
        obj.groups = val.groups.map((opt) => {
          return { label: opt, value: opt };
        });
      }
      if (val.users.length > 0) {
        obj.users = val.users.map((opt) => {
          return { label: opt, value: opt };
        });
      }
      if (val.roles.length > 0) {
        obj.roles = val.roles.map((opt) => {
          return { label: opt, value: opt };
        });
      }
      if (
        val.hasOwnProperty("rowFilterInfo") &&
        val.rowFilterInfo &&
        val.rowFilterInfo.filterExpr
      ) {
        obj.rowFilterInfo = val.rowFilterInfo.filterExpr;
      }
      if (
        val.hasOwnProperty("dataMaskInfo") &&
        val.dataMaskInfo &&
        val.dataMaskInfo.dataMaskType
      ) {
        obj.dataMaskInfo = {};
        let maskDataType = maskTypes.find((m) => {
          return m.name == val.dataMaskInfo.dataMaskType;
        });
        obj.dataMaskInfo.label = maskDataType.label;
        obj.dataMaskInfo.value = maskDataType.name;
      }
      return obj;
    });
  };

  const handleSubmit = async (values) => {
    let data = {};
    data.allowExceptions = getPolicyItemsVal(values, "allowExceptions");
    data.denyExceptions = getPolicyItemsVal(values, "denyExceptions");
    data.policyItems = getPolicyItemsVal(values, "policyItems");
    data.denyPolicyItems = getPolicyItemsVal(values, "denyPolicyItems");
    data.dataMaskPolicyItems = getPolicyItemsVal(values, "dataMaskPolicyItems");
    data.rowFilterPolicyItems = getPolicyItemsVal(
      values,
      "rowFilterPolicyItems"
    );
    data.description = values.description;
    data.isAuditEnabled = values.isAuditEnabled;
    data.isDenyAllElse = values.isDenyAllElse;
    data.isEnabled = values.isEnabled;
    data.name = values.policyName;
    data.policyLabels = (values.policyLabel || []).map(({ value }) => value);
    data.policyPriority = values.policyPriority ? "1" : "0";
    data.policyType = values.policyType;
    data.service = serviceDetails.name;
    let serviceCompRes;
    if (values.policyType != null) {
      if (
        values.policyType == RangerPolicyType.RANGER_MASKING_POLICY_TYPE.value
      )
        serviceCompRes = serviceCompDetails.dataMaskDef.resources;
      if (
        values.policyType ==
        RangerPolicyType.RANGER_ROW_FILTER_POLICY_TYPE.value
      )
        serviceCompRes = serviceCompDetails.rowFilterDef.resources;
      if (values.policyType == RangerPolicyType.RANGER_ACCESS_POLICY_TYPE.value)
        serviceCompRes = serviceCompDetails.resources;
    }
    const grpResources = groupBy(serviceCompRes || [], "level");
    let grpResourcesKeys = [];
    for (const resourceKey in grpResources) {
      grpResourcesKeys.push(+resourceKey);
    }
    grpResourcesKeys = grpResourcesKeys.sort();
    data.resources = {};
    for (const level of grpResourcesKeys) {
      if (
        values[`resourceName-${level}`] &&
        values[`resourceName-${level}`].value !== noneOptions.value
      ) {
        let defObj = serviceCompRes.find(function (m) {
          if (m.name == values[`resourceName-${level}`].name) {
            return m;
          }
        });
        data.resources[values[`resourceName-${level}`].name] = {
          isExcludes:
            defObj.excludesSupported &&
            !(values[`isExcludesSupport-${level}`] === false),
          isRecursive:
            defObj.recursiveSupported &&
            !(values[`isRecursiveSupport-${level}`] === false),
          values: values[`value-${level}`].map(({ value }) => value)
        };
      }
    }
    if (values?.validitySchedules) {
      data["validitySchedules"] = [];

      values.validitySchedules.filter((val) => {
        if (val) {
          let timeObj = {};
          if (val.startTime) {
            timeObj["startTime"] = moment(val.startTime).format(
              "YYYY/MM/DD HH:mm:ss"
            );
          }
          if (val.endTime) {
            timeObj["endTime"] = moment(val.endTime).format(
              "YYYY/MM/DD HH:mm:ss"
            );
          }
          if (val.timeZone) {
            timeObj["timeZone"] = val.timeZone.id;
          }
          data["validitySchedules"].push(timeObj);
        }
      });
    }
    if (policyId) {
      let dataVal = {
        ...policyData,
        ...data
      };
      try {
        const resp = await fetchApi({
          url: `plugins/policies/${policyId}`,
          method: "PUT",
          data: dataVal
        });
        toast.success("Policy updated successfully!!");
        history.push(`/service/${serviceId}/policies/${policyData.policyType}`);
      } catch (error) {
        toast.error("Failed to save policy form!!");
        console.error(`Error while saving policy form!!! ${error}`);
      }
    } else {
      try {
        const resp = await fetchApi({
          url: "plugins/policies",
          method: "POST",
          data
        });
        toast.success("Policy save successfully!!");
        history.push(`/service/${serviceId}/policies/${policyType}`);
      } catch (error) {
        toast.error("Failed to save policy form!!");
        console.error(`Error while saving policy form!!! ${error}`);
      }
    }
  };

  // const required = (value) => (value ? undefined : "Required");

  const closeForm = () => {
    let polType = policyId ? policyData.policyType : policyType;
    history.push(`/service/${serviceId}/policies/${polType}`);
  };
  const policyBreadcrumb = () => {
    let policyDetails = {};
    policyDetails["serviceId"] = serviceId;
    policyDetails["policyType"] = policyId ? policyData.policyType : policyType;
    policyDetails["serviceName"] = serviceDetails.displayName;
    policyDetails["selectedZone"] = JSON.parse(
      localStorage.getItem("zoneDetails")
    );
    if (serviceCompDetails.name === "tag") {
      if (policyDetails.selectedZone) {
        return commonBreadcrumb(
          [
            "TagBasedServiceManager",
            "ManagePolicies",
            policyId ? "PolicyEdit" : "PolicyCreate"
          ],
          policyDetails
        );
      } else {
        return commonBreadcrumb(
          [
            "TagBasedServiceManager",
            "ManagePolicies",
            policyId ? "PolicyEdit" : "PolicyCreate"
          ],
          pick(policyDetails, ["serviceId", "policyType", "serviceName"])
        );
      }
    } else {
      if (policyDetails.selectedZone) {
        return commonBreadcrumb(
          [
            "ServiceManager",
            "ManagePolicies",
            policyId ? "PolicyEdit" : "PolicyCreate"
          ],
          policyDetails
        );
      } else {
        return commonBreadcrumb(
          [
            "ServiceManager",
            "ManagePolicies",
            policyId ? "PolicyEdit" : "PolicyCreate"
          ],
          pick(policyDetails, ["serviceId", "policyType", "serviceName"])
        );
      }
    }
  };
  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <div>
          {policyBreadcrumb()}
          <h5>{`${policyId ? "Edit" : "Create"} Policy`}</h5>
          <div className="wrap">
            <Form
              onSubmit={handleSubmit}
              mutators={{
                ...arrayMutators
              }}
              initialValues={formData}
              validate={(values) => {
                const errors = {};
                if (!values.policyName) {
                  errors.policyName = {
                    required: true,
                    text: "Required"
                  };
                }
                return errors;
              }}
              render={({
                handleSubmit,
                submitting,
                values,
                form: {
                  mutators: { push: addPolicyItem, pop: removePolicyItem }
                }
              }) => (
                <form onSubmit={handleSubmit}>
                  <fieldset>
                    <p className="formHeader">Policy Details</p>
                  </fieldset>
                  <Field
                    className="form-control"
                    name="policyType"
                    render={({ input }) => (
                      <FormB.Group
                        as={Row}
                        className="mb-3"
                        controlId="policyType"
                      >
                        <FormB.Label column sm={2}>
                          Policy Type
                        </FormB.Label>
                        <Col sm={4}>
                          <Badge variant="primary">
                            {
                              getEnumElementByValue(
                                RangerPolicyType,
                                +input.value
                              ).label
                            }
                          </Badge>
                        </Col>
                        <Col sm={6}>
                          <PolicyValidityPeriodComp
                            addPolicyItem={addPolicyItem}
                          />
                        </Col>
                      </FormB.Group>
                    )}
                  />
                  {policyId && (
                    <FormB.Group as={Row} className="mb-3" controlId="policyId">
                      <FormB.Label column sm={2}>
                        Policy ID*
                      </FormB.Label>
                      <Col sm={4}>
                        <Badge variant="primary">{policyData.id}</Badge>
                      </Col>
                    </FormB.Group>
                  )}
                  <FormB.Group
                    as={Row}
                    className="mb-3"
                    controlId="policyNames"
                  >
                    <Field
                      className="form-control"
                      name="policyName"
                      // validate={required}
                      render={({ input, meta }) => (
                        <>
                          <FormB.Label column sm={2}>
                            Policy Name*
                          </FormB.Label>
                          <>
                            <Col sm={4}>
                              <FormB.Control
                                {...input}
                                placeholder="Policy Name"
                                className={
                                  meta.error && meta.touched
                                    ? "form-control border border-danger"
                                    : "form-control"
                                }
                              />
                              {meta.touched && meta.error && (
                                <span className="invalid-field">
                                  {meta.error.text}
                                </span>
                              )}
                            </Col>
                          </>
                        </>
                      )}
                    />
                    <Col sm={4}>
                      <Row>
                        <Col sm={4}>
                          <Field
                            className="form-control"
                            name="isEnabled"
                            render={({ input }) => (
                              <BootstrapSwitchButton
                                {...input}
                                checked={!(input.value === false)}
                                onlabel="Enabled"
                                onstyle="primary"
                                offlabel="Disabled"
                                offstyle="outline-secondary"
                                style="w-100"
                                size="xs"
                                key="isEnabled"
                              />
                            )}
                          />
                        </Col>
                        <Col sm={4}>
                          <Field
                            className="form-control"
                            name="policyPriority"
                            render={({ input }) => (
                              <BootstrapSwitchButton
                                {...input}
                                checked={input.value}
                                onlabel="Override"
                                onstyle="primary"
                                offlabel="Normal"
                                offstyle="outline-secondary"
                                style="w-100"
                                size="xs"
                                key="policyPriority"
                              />
                            )}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </FormB.Group>
                  <Field
                    className="form-control"
                    name="policyLabel"
                    render={({ input }) => (
                      <FormB.Group
                        as={Row}
                        className="mb-3"
                        controlId="policyLabel"
                      >
                        <FormB.Label column sm={2}>
                          Policy Label
                        </FormB.Label>
                        <Col sm={4}>
                          <AsyncCreatableSelect
                            {...input}
                            defaultOptions
                            isMulti
                            loadOptions={fetchPolicyLabel}
                          />
                        </Col>
                      </FormB.Group>
                    )}
                  />
                  <ResourceComp
                    serviceDetails={serviceDetails}
                    serviceCompDetails={serviceCompDetails}
                    formValues={values}
                    policyType={policyId ? policyData.policyType : policyType}
                    policyItem={true}
                  />
                  <Field
                    className="form-control"
                    name="description"
                    render={({ input }) => (
                      <FormB.Group
                        as={Row}
                        className="mb-3"
                        controlId="description"
                      >
                        <FormB.Label column sm={2}>
                          Description
                        </FormB.Label>
                        <Col sm={4}>
                          <FormB.Control {...input} as="textarea" rows={3} />
                        </Col>
                      </FormB.Group>
                    )}
                  />
                  <Field
                    className="form-control"
                    name="isAuditEnabled"
                    render={({ input }) => (
                      <FormB.Group
                        as={Row}
                        className="mb-3"
                        controlId="description"
                      >
                        <FormB.Label column sm={2}>
                          Audit Logging*
                        </FormB.Label>
                        <Col sm={4}>
                          <BootstrapSwitchButton
                            {...input}
                            checked={!(input.value === false)}
                            onlabel="Yes"
                            onstyle="primary"
                            offlabel="No"
                            offstyle="outline-secondary"
                            size="xs"
                            key="isAuditEnabled"
                          />
                        </Col>
                      </FormB.Group>
                    )}
                  />
                  {/* {conditio == 0 ? <div></div> : condgiotn === 1 ? <div></div> : null : null } */}
                  {values.policyType == 0 ? (
                    <div>
                      <div>
                        <fieldset>
                          <p className="formHeader">Allow Conditions:</p>
                        </fieldset>
                        <div className="wrap">
                          <PolicyPermissionItem
                            serviceDetails={serviceDetails}
                            serviceCompDetails={serviceCompDetails}
                            formValues={values}
                            addPolicyItem={addPolicyItem}
                            attrName="policyItems"
                            fetchUsersData={fetchUsersData}
                            fetchGroupsData={fetchGroupsData}
                            fetchRolesData={fetchRolesData}
                          />
                        </div>
                        <fieldset>
                          <p className="formHeader">
                            Exclude from Allow Conditions:
                          </p>
                        </fieldset>
                        <div className="wrap">
                          <PolicyPermissionItem
                            serviceDetails={serviceDetails}
                            serviceCompDetails={serviceCompDetails}
                            formValues={values}
                            addPolicyItem={addPolicyItem}
                            attrName="allowExceptions"
                            fetchUsersData={fetchUsersData}
                            fetchGroupsData={fetchGroupsData}
                            fetchRolesData={fetchRolesData}
                          />
                        </div>
                      </div>
                      <Field
                        className="form-control"
                        name="isDenyAllElse"
                        render={({ input }) => (
                          <FormB.Group
                            as={Row}
                            className="mb-3"
                            controlId="description"
                          >
                            <FormB.Label column sm={2}>
                              Deny All Other Accesses: *
                            </FormB.Label>
                            <Col sm={1}>
                              <BootstrapSwitchButton
                                {...input}
                                checked={input.value}
                                onlabel="True"
                                onstyle="primary"
                                offlabel="False"
                                offstyle="outline-secondary"
                                size="xs"
                                style="w-100"
                                key="isDenyAllElse"
                              />
                            </Col>
                          </FormB.Group>
                        )}
                      />
                      <Condition when="isDenyAllElse" is={false}>
                        <div>
                          <fieldset>
                            <p className="formHeader">Deny Conditions:</p>
                          </fieldset>
                          <div className="wrap">
                            <PolicyPermissionItem
                              serviceDetails={serviceDetails}
                              serviceCompDetails={serviceCompDetails}
                              formValues={values}
                              addPolicyItem={addPolicyItem}
                              attrName="denyPolicyItems"
                              fetchUsersData={fetchUsersData}
                              fetchGroupsData={fetchGroupsData}
                              fetchRolesData={fetchRolesData}
                            />
                          </div>
                          <fieldset>
                            <p className="formHeader">
                              Exclude from Allow Conditions:
                            </p>
                          </fieldset>
                          <div className="wrap">
                            <PolicyPermissionItem
                              serviceDetails={serviceDetails}
                              serviceCompDetails={serviceCompDetails}
                              formValues={values}
                              addPolicyItem={addPolicyItem}
                              attrName="denyExceptions"
                              fetchUsersData={fetchUsersData}
                              fetchGroupsData={fetchGroupsData}
                              fetchRolesData={fetchRolesData}
                            />
                          </div>
                        </div>
                      </Condition>
                    </div>
                  ) : values.policyType == 1 ? (
                    <div>
                      <fieldset>
                        <p className="formHeader">Mask Conditions:</p>
                      </fieldset>
                      <div className="wrap">
                        <PolicyPermissionItem
                          serviceDetails={serviceDetails}
                          serviceCompDetails={serviceCompDetails}
                          formValues={values}
                          addPolicyItem={addPolicyItem}
                          attrName="dataMaskPolicyItems"
                          fetchUsersData={fetchUsersData}
                          fetchGroupsData={fetchGroupsData}
                          fetchRolesData={fetchRolesData}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div>
                        <fieldset>
                          <p className="formHeader">Row Filter Conditions:</p>
                        </fieldset>
                        <div className="wrap">
                          <PolicyPermissionItem
                            serviceDetails={serviceDetails}
                            serviceCompDetails={serviceCompDetails}
                            formValues={values}
                            addPolicyItem={addPolicyItem}
                            attrName="rowFilterPolicyItems"
                            fetchUsersData={fetchUsersData}
                            fetchGroupsData={fetchGroupsData}
                            fetchRolesData={fetchRolesData}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="row form-actions">
                    <div className="col-md-9 offset-md-3">
                      <Button type="submit" variant="primary" size="sm">
                        Save
                      </Button>
                      <Button
                        variant="secondary"
                        type="button"
                        size="sm"
                        onClick={() => {
                          closeForm();
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            />
          </div>
        </div>
      )}
    </>
  );
}
