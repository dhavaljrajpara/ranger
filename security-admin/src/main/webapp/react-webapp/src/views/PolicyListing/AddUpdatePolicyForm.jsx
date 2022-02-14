import React, { useEffect, useReducer, useRef } from "react";
import { Form as FormB, Row, Col, Button, Badge } from "react-bootstrap";
import { Form, Field } from "react-final-form";
import AsyncCreatableSelect from "react-select/async-creatable";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import arrayMutators from "final-form-arrays";
import { groupBy } from "lodash";
import { toast } from "react-toastify";

import { fetchApi } from "Utils/fetchAPI";
import { RangerPolicyType, getEnumElementByValue } from "Utils/XAEnums";
import ResourceComp from "../Resources/ResourceComp";
import PolicyPermissionItem from "../PolicyListing/PolicyPermissionItem";
import { useParams, useHistory } from "react-router-dom";

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
    let policyData;
    if (policyId) {
      policyData = await fetchPolicyData();
    }
    dispatch({
      type: "SET_DATA",
      serviceDetails: serviceData,
      serviceCompDetails: serviceCompData,
      policyData: policyData || null,
      formData: generateFormData()
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
    const userResp = await fetchApi({
      url: "plugins/policyLabels",
      params: params
    });

    return userResp.data.vXUsers.map((name) => ({
      label: name,
      value: name
    }));
  };

  const generateFormData = () => {
    let data = {};
    data.policyType = policyId ? policyData.policyType : policyType;
    if (!policyData) {
      data.policyItem = [{}];
      data.allowExceptions = [{}];
      data.denyPolicyItems = [{}];
      data.denyExceptions = [{}];
    }
    data.isDenyAllElse = policyData?.isDenyAllElse || false;
    return data;
  };

  const getPolicyItemsVal = (formData, name) => {
    return formData[name].map((val) => {
      let obj = {
        delegateAdmin: val.delegateAdmin
      };
      if (val.accesses) {
        obj.accesses = val.accesses.map(({ value }) => ({
          type: value,
          isAllowed: true
        }));
      }
      if (val.groups.length > 0) {
        obj.groups = val.groups.map(({ value }) => value);
      }
      if (val.roles.length > 0) {
        obj.roles = val.roles.map(({ value }) => value);
      }
      if (val.users.length > 0) {
        obj.users = val.users.map(({ value }) => value);
      }
      return obj;
    });
  };

  const handleSubmit = async (values) => {
    let data = {};
    data.allowExceptions = getPolicyItemsVal(values, "allowExceptions");
    data.denyExceptions = getPolicyItemsVal(values, "denyExceptions");
    data.policyItem = getPolicyItemsVal(values, "policyItem");
    data.denyPolicyItems = getPolicyItemsVal(values, "denyPolicyItems");
    data.description = values.description;
    data.isAuditEnabled = values.isAuditEnabled;
    data.isDenyAllElse = values.isDenyAllElse;
    data.isEnabled = values.isEnabled;
    data.name = values.policyName;
    data.policyLabel = (values.policyLabel || []).map(({ value }) => value);
    data.policyPriority = values.policyPriority ? "1" : "0";
    data.policyType = values.policyType;
    data.service = serviceDetails.name;
    const grpResources = groupBy(serviceCompDetails.resources || [], "level");
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
        data.resources[values[`resourceName-${level}`].name] = {
          isExcludes: values[`isExcludesSupport-${level}`] || false,
          isRecursive: values[`isRecursiveSupport-${level}`] || false,
          values: values[`value-${level}`].map(({ value }) => value)
        };
      }
    }
    try {
      const resp = await fetchApi({
        url: "plugins/policies",
        method: "POST",
        data
      });
      history.push(`/service/${serviceId}/policies/${policyType}`);
    } catch (error) {
      toast.error("Failed to save policy form!!");
      console.error(`Error while saving policy form!!! ${error}`);
    }
  };

  return (
    <>
      {loader ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h5>{`${policyId ? "Edit" : "Create"} Policy`}</h5>
          <div className="wrap">
            <Form
              onSubmit={handleSubmit}
              mutators={{
                ...arrayMutators
              }}
              initialValues={formData}
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
                          <Button
                            variant="primary"
                            size="sm"
                            className="pull-right"
                          >
                            Add Validity Period
                          </Button>
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
                  <FormB.Group as={Row} className="mb-3" controlId="policyName">
                    <Field
                      className="form-control"
                      name="policyName"
                      render={({ input }) => (
                        <>
                          <FormB.Label column sm={2}>
                            Policy Name*
                          </FormB.Label>
                          <Col sm={4}>
                            <FormB.Control
                              {...input}
                              placeholder="Policy Name"
                            />
                          </Col>
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
                                onlabel="Enabled"
                                onstyle="primary"
                                offlabel="Disabled"
                                offstyle="outline-secondary"
                                style="w-100"
                                size="xs"
                                {...input}
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
                                checked={false}
                                onlabel="Override"
                                onstyle="primary"
                                offlabel="Normal"
                                offstyle="outline-secondary"
                                style="w-100"
                                size="xs"
                                {...input}
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
                    policyType={policyType}
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
                          Description*
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
                            checked={false}
                            onlabel="Yes"
                            onstyle="primary"
                            offlabel="No"
                            offstyle="outline-secondary"
                            size="xs"
                            {...input}
                          />
                        </Col>
                      </FormB.Group>
                    )}
                  />
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
                        attrName="policyItem"
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
                            checked={false}
                            onlabel="True"
                            onstyle="primary"
                            offlabel="False"
                            offstyle="outline-secondary"
                            size="xs"
                            style="w-100"
                            {...input}
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
                  <div>
                    <Button type="submit">Save</Button>
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
