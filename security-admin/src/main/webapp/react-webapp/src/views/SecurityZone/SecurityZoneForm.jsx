import React, { useState, useEffect, useRef } from "react";
import { Form, Field } from "react-final-form";
// import createDecorator from "final-form-focus";
import { Button, Row, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { fetchApi } from "Utils/fetchAPI";
import { groupBy, findIndex, isEmpty, pickBy, find, has } from "lodash";
import { Table } from "react-bootstrap";
import { FieldArray } from "react-final-form-arrays";
import arrayMutators from "final-form-arrays";
import ModalResourceComp from "../Resources/ModalResourceComp";
import { RegexValidation } from "Utils/XAEnums";
import { toast } from "react-toastify";
import { commonBreadcrumb } from "../../utils/XAUtils";
import {
  scrollToError,
  selectCustomStyles
} from "../../components/CommonComponents";

const noneOptions = {
  label: "None",
  value: "none"
};

const SecurityZoneForm = (props) => {
  const history = useHistory();
  const [serviceDefs, setServiceDefs] = useState([]);
  const [services, setServices] = useState([]);
  const [zone, setZone] = useState({});
  const [resourceServiceDef, setResourceServiceDef] = useState({});
  const [resourceService, setResourceService] = useState({});
  const [resourceServicesOpt, setResourceServicesOpt] = useState([]);
  const [loader, setLoader] = useState(true);
  const [modelState, setModalstate] = useState({
    showModalResource: false,
    data: null,
    inputval: null,
    index: 0
  });

  useEffect(() => {
    fetchInitalData();
  }, []);

  const validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = {
        required: true,
        text: "Required"
      };
    } else {
      if (
        !RegexValidation.NAME_VALIDATION.regexforNameValidation.test(
          values.name
        )
      ) {
        errors.name = {
          text: RegexValidation.NAME_VALIDATION.regexforNameValidationMessage
        };
      }
    }

    if (isEmpty(values.adminUsers) && isEmpty(values.adminUserGroups)) {
      errors.adminUserGroups = {
        required: true,
        text: "Please provide atleast one audit user or group!"
      };
      errors.adminUsers = {
        required: true,
        text: ""
      };
    }

    if (isEmpty(values.auditUsers) && isEmpty(values.auditUserGroups)) {
      errors.auditUserGroups = {
        required: true,
        text: "Please provide atleast one audit user or group!"
      };
      errors.auditUsers = {
        required: true,
        text: ""
      };
    }

    if (isEmpty(values.resourceServices)) {
      errors.resourceServices = {
        required: true,
        text: "Required"
      };
    }
    // scrollToError(selector);
    return errors;
  };

  const handleClose = () => {
    setModalstate({
      showModalResource: false,
      data: null,
      inputval: null,
      index: 0
    });
  };

  const fetchInitalData = async () => {
    await fetchServiceDefs();
    await fetchResourceServices();
    await fetchZones();
  };

  const fetchServiceDefs = async () => {
    let servicetypeResp;

    try {
      servicetypeResp = await fetchApi({
        url: `plugins/definitions`
      });
    } catch (error) {
      console.error(`Error occurred while fetching Services! ${error}`);
    }

    setServiceDefs(servicetypeResp.data.serviceDefs);
  };

  const fetchResourceServices = async () => {
    const serviceDefnsResp = await fetchApi({
      url: "plugins/services"
    });

    const filterServices = serviceDefnsResp.data.services.filter(
      (obj) => obj.type !== "tag" && obj.type !== "kms"
    );

    setServices(filterServices);

    const servicesByType = groupBy(filterServices, "type");

    let resourceServices = [];

    for (var key of Object.keys(servicesByType)) {
      resourceServices.push({
        label: <span className="font-weight-bold text-body h6">{key}</span>,
        options: servicesByType[key].map((name) => {
          return { label: name.name, value: name.name };
        })
      });
    }

    setResourceServicesOpt(resourceServices);
  };

  const fetchZones = async () => {
    let zoneResp;

    if (props.match.params.zoneId !== undefined) {
      let zoneId = props.match.params.zoneId;

      try {
        zoneResp = await fetchApi({
          url: `zones/zones/${zoneId}`
        });
      } catch (error) {
        console.error(
          `Error occurred while fetching Zone or CSRF headers! ${error}`
        );
        toast.error(error.response.data.msgDesc);
      }
      setZone(zoneResp.data);
    }

    setLoader(false);
  };

  const renderResourcesModal = (input, serviceType) => {
    let filterServiceDef = find(serviceDefs, ["name", serviceType]);
    let filterService = find(services, ["type", serviceType]);

    for (const obj of filterServiceDef.resources) {
      obj.recursiveSupported = false;
      obj.excludesSupported = false;
      if (obj.level !== 10) {
        obj.mandatory = false;
      }
    }

    setModalstate({
      showModalResource: true,
      data: {},
      inputval: input,
      index: -1
    });

    setResourceServiceDef(filterServiceDef);
    setResourceService(filterService);
  };

  const editResourcesModal = (idx, input, serviceType) => {
    let editData = input.input.value[idx];
    let filterServiceDef = find(serviceDefs, ["name", serviceType]);
    let filterService = find(services, ["type", serviceType]);

    for (const obj of filterServiceDef.resources) {
      obj.recursiveSupported = false;
      obj.excludesSupported = false;
      if (obj.level !== 10) {
        obj.mandatory = false;
      }
    }

    setModalstate({
      showModalResource: true,
      data: editData,
      inputval: input,
      index: idx
    });

    setResourceServiceDef(filterServiceDef);
    setResourceService(filterService);
  };

  const onSubmit = async (values) => {
    let zoneId;

    let apiMethod;
    let apiUrl;
    let apiSuccess;
    let apiError;
    let zoneData = {};
    let zoneResp;

    if (props.match.params.zoneId !== undefined) {
      zoneId = props.match.params.zoneId;
      apiMethod = "put";
      apiUrl = `/zones/zones/${zoneId}`;
      apiSuccess = "updated";
      zoneData["id"] = zoneId;
      apiError = "Error occurred while updating a zone";
    } else {
      apiMethod = "post";
      apiUrl = `/zones/zones`;
      apiSuccess = "created";
      apiError = "Error occurred while creating a zone!";
    }

    zoneData.name = values.name;
    zoneData.description = values.description || "";
    zoneData.adminUsers = [];
    if (values.adminUsers) {
      for (var key of Object.keys(values.adminUsers)) {
        zoneData.adminUsers.push(values.adminUsers[key].value);
      }
    }
    zoneData.adminUserGroups = [];

    if (values.adminUserGroups) {
      for (var key of Object.keys(values.adminUserGroups)) {
        zoneData.adminUserGroups.push(values.adminUserGroups[key].label || "");
      }
    }

    zoneData.auditUsers = [];

    if (values.auditUsers) {
      for (var key of Object.keys(values.auditUsers)) {
        zoneData.auditUsers.push(values.auditUsers[key].label || "");
      }
    }

    zoneData.auditUserGroups = [];
    if (values.auditUserGroups) {
      for (var key of Object.keys(values.auditUserGroups)) {
        zoneData.auditUserGroups.push(values.auditUserGroups[key].label || "");
      }
    }

    zoneData.tagServices = [];

    if (values.tagServices) {
      for (var key of Object.keys(values.tagServices)) {
        zoneData.tagServices.push(values.tagServices[key].label || "");
      }
    }

    zoneData.services = {};

    for (key of Object.keys(values.tableList)) {
      let serviceName = values.tableList[key].serviceName;
      let resourcesName = values.tableList[key].resources;
      zoneData.services[serviceName] = {};
      zoneData.services[serviceName].resources = [];
      resourcesName.map((obj) => {
        let serviceResourceData = {};
        pickBy(obj, (key, val) => {
          if (
            obj[`value-${key.level}`] &&
            obj[`value-${key.level}`].length > 0
          ) {
            if (val.includes("resourceName")) {
              serviceResourceData[key.name] = obj[`value-${key.level}`].map(
                (value) => value.value
              );
            }
          }
        });
        return zoneData.services[serviceName].resources.push(
          serviceResourceData
        );
      });
      if (zoneData.services[serviceName].resources.length === 0) {
        toast.error("Please add at least one resource for  service", {
          toastId: "error1"
        });
      }
    }
    if (props.match.params.zoneId) {
      zoneData = {
        ...zone,
        ...zoneData
      };
    }
    try {
      zoneResp = await fetchApi({
        url: apiUrl,
        method: apiMethod,
        data: zoneData
      });
      toast.success(`Success! Service zone ${apiSuccess} succesfully`);
      history.push(`/zones/zone/${zoneResp.data.id}`);
    } catch (error) {
      console.error(`Error occurred while ${apiError} Zone`);
      if (error.response !== undefined && has(error.response, "data.msgDesc")) {
        toast.error(error.response.data.msgDesc);
      }
    }
  };
  const EditFormData = () => {
    const zoneData = {};

    zoneData.name = zone.name;
    zoneData.description = zone.description;

    zoneData.adminUserGroups = [];
    if (zone.adminUserGroups) {
      zone.adminUserGroups.map((name) =>
        zoneData.adminUserGroups.push({ label: name, value: name })
      );
    }

    zoneData.adminUsers = [];
    if (zone.adminUsers) {
      zone.adminUsers.map((name) =>
        zoneData.adminUsers.push({ label: name, value: name })
      );
    }

    zoneData.auditUserGroups = [];
    if (zone.auditUserGroups) {
      zone.auditUserGroups.map((name) =>
        zoneData.auditUserGroups.push({ label: name, value: name })
      );
    }

    zoneData.auditUsers = [];
    if (zone.auditUsers) {
      zone.auditUsers.map((name) =>
        zoneData.auditUsers.push({ label: name, value: name })
      );
    }

    zoneData.tagServices = [];
    if (zone.tagServices) {
      zone.tagServices.map((name) =>
        zoneData.tagServices.push({ label: name, value: name })
      );
    }

    zoneData.resourceServices = [];
    if (zone.services) {
      Object.keys(zone.services).map((name) =>
        zoneData.resourceServices.push({ label: name, value: name })
      );
    }

    zoneData.tableList = [];
    for (let name of Object.keys(zone.services)) {
      let tableValues = {};

      tableValues["serviceName"] = name;

      let serviceType = find(services, ["name", name]);
      tableValues["serviceType"] = serviceType.type;

      let filterServiceDef = find(serviceDefs, ["name", serviceType.type]);

      for (const obj of filterServiceDef.resources) {
        obj.recursiveSupported = false;
        obj.excludesSupported = false;
        if (obj.level !== 10) {
          obj.mandatory = false;
        }
      }

      tableValues["resources"] = [];
      zone.services[name].resources.map((obj) => {
        let serviceResource = {};
        Object.entries(obj).map(([key, value]) => {
          let setResources = find(filterServiceDef.resources, ["name", key]);
          serviceResource[`resourceName-${setResources.level}`] = setResources;
          serviceResource[`value-${setResources.level}`] = value.map((m) => {
            return { label: m, value: m };
          });
          if (setResources.excludesSupported) {
            serviceResource[`isExcludesSupport-${setResources.level}`] =
              value.isExcludes;
          }
          if (setResources.recursiveSupported) {
            serviceResource[`recursiveSupported-${setResources.level}`] =
              value.isRecursive;
          }
        });
        tableValues["resources"].push(serviceResource);
      });

      zoneData.tableList.push(tableValues);
    }
    return zoneData;
  };

  const fetchUsers = async (inputValue) => {
    let params = {},
      op = [];
    if (inputValue) {
      params["name"] = inputValue || "";
    }
    const userResp = await fetchApi({
      url: "xusers/users",
      params: params
    });

    if (userResp.data && userResp.data.vXUsers) {
      op = userResp.data.vXUsers.map((obj) => {
        return {
          label: obj.name,
          value: obj.name
        };
      });
    }

    return op;
  };

  const fetchGroups = async (inputValue) => {
    let params = {};
    if (inputValue) {
      params["name"] = inputValue || "";
    }
    const groupResp = await fetchApi({
      url: "xusers/groups",
      params: params
    });
    return groupResp.data.vXGroups.map(({ name }) => ({
      label: name,
      value: name
    }));
  };

  const fetchTagServices = async (inputValue) => {
    let params = {};
    if (inputValue) {
      params["serviceNamePartial"] = inputValue || "";
      params["serviceType"] = "tag" || "";
    }
    const serviceResp = await fetchApi({
      url: "plugins/services",
      params: params
    });
    const filterServices = serviceResp.data.services.filter(
      (obj) => obj.type == "tag"
    );
    return filterServices.map(({ name }) => ({
      label: name,
      value: name
    }));
  };

  const resourceServicesOnChange = (e, input, values, push, remove) => {
    if (e.action == "select-option") {
      let serviceType = find(services, { name: e.option.value });
      push("tableList", {
        serviceName: e.option.value,
        serviceType: serviceType.type,
        resources: []
      });
    }

    if (e.action == "remove-value" || e.action == "pop-value") {
      let removeItemIndex = findIndex(input.value, [
        "value",
        e.removedValue.value
      ]);
      remove("tableList", removeItemIndex);
    }

    input.onChange(values);
  };

  const handleSave = () => {
    if (modelState.index === -1) {
      let add = [];
      add = modelState.inputval.input.value;
      add.push(modelState.data);
      modelState.inputval.input.onChange(add);
      handleClose();
    } else {
      let edit = modelState.inputval.input.value;
      edit[modelState.index] = modelState.data;
      modelState.inputval.input.onChange(edit);
      handleClose();
    }
  };

  const handleRemove = (idx, input) => {
    input.input.value.splice(idx, 1);
    handleClose();
  };

  const showResources = (value, serviceType) => {
    let data = {};
    let filterdef = serviceDefs.find((obj) => obj.name == serviceType);

    for (const obj of filterdef.resources) {
      obj.recursiveSupported = false;
      obj.excludesSupported = false;
      if (obj.level !== 10) {
        obj.mandatory = false;
      }
    }

    const grpResources = groupBy(filterdef.resources || [], "level");
    let grpResourcesKeys = [];
    for (const resourceKey in grpResources) {
      grpResourcesKeys.push(+resourceKey);
    }
    grpResourcesKeys = grpResourcesKeys.sort();
    data.resources = {};
    for (const level of grpResourcesKeys) {
      if (
        value[`resourceName-${level}`] &&
        value[`resourceName-${level}`].value !== noneOptions.value
      ) {
        data.resources[value[`resourceName-${level}`].name] = {
          isExcludes: value[`isExcludesSupport-${level}`] || false,
          isRecursive: value[`isRecursiveSupport-${level}`] || false,
          values:
            value[`value-${level}`] !== undefined
              ? value[`value-${level}`].map(({ value }) => value)
              : ""
        };
      }
    }
    return Object.keys(data.resources).map((obj, index) => (
      <p key={index}>
        {data.resources[obj].values.length !== 0 ? (
          <>
            <strong>{`${obj} : `}</strong>
            <span>
              {data.resources[obj].values.map((val) => val).join(", ")}
            </span>
          </>
        ) : (
          ""
        )}
      </p>
    ));
  };

  return (
    <React.Fragment>
      {commonBreadcrumb(
        [
          "SecurityZone",
          props.match.params.zoneId !== undefined ? "ZoneEdit" : "ZoneCreate"
        ],
        props.match.params.zoneId
      )}
      <div className="clearfix">
        <h4 className="wrap-header bold">
          {props.match.params.zoneId !== undefined ? `Edit` : `Create`} Zone
        </h4>
      </div>
      <div className="wrap">
        {loader ? (
          <Row>
            <Col sm={12} className="text-center">
              <div className="spinner-border mr-2" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-grow" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </Col>
          </Row>
        ) : (
          <Form
            onSubmit={onSubmit}
            keepDirtyOnReinitialize={true}
            initialValuesEqual={() => true}
            initialValues={
              props.match.params.zoneId !== undefined && EditFormData()
            }
            mutators={{
              ...arrayMutators
            }}
            validate={validate}
            render={({
              handleSubmit,
              dirty,
              invalid,
              errors,
              form: {
                mutators: { push, remove }
              },
              submitting
            }) => (
              <Row>
                <Col sm={12}>
                  <form
                    onSubmit={(event) => {
                      if (invalid) {
                        let selector =
                          document.getElementById("isError") ||
                          document.querySelector(
                            `input[name=${Object.keys(errors)[0]}]`
                          );
                        scrollToError(selector);
                      }
                      handleSubmit(event);
                    }}
                  >
                    <p className="form-header">Zone Details:</p>
                    <Field name="name">
                      {({ input, meta }) => (
                        <Row className="form-group">
                          <Col xs={3}>
                            <label className="form-label pull-right">
                              Zone Name *
                            </label>
                          </Col>
                          <Col xs={4}>
                            <input
                              {...input}
                              type="text"
                              id={
                                meta.error && meta.touched ? "isError" : "name"
                              }
                              className={
                                meta.error && meta.touched
                                  ? "form-control border-danger"
                                  : "form-control"
                              }
                            />
                            {meta.error && meta.touched && (
                              <span className="invalid-field">
                                {meta.error.text}
                              </span>
                            )}
                          </Col>
                        </Row>
                      )}
                    </Field>

                    <Field name="description">
                      {({ input }) => (
                        <Row className="form-group">
                          <Col xs={3}>
                            <label className="form-label pull-right">
                              Zone Description
                            </label>
                          </Col>
                          <Col xs={4}>
                            <textarea {...input} className="form-control" />
                          </Col>
                        </Row>
                      )}
                    </Field>
                    <p className="form-header">Zone Administration:</p>

                    <Field
                      name="adminUsers"
                      render={({ input, meta }) => (
                        <Row className="form-group">
                          <Col xs={3}>
                            <label className="form-label pull-right">
                              Admin Users
                            </label>
                          </Col>
                          <Col xs={4}>
                            <AsyncSelect
                              {...input}
                              styles={
                                meta.error && meta.touched
                                  ? selectCustomStyles
                                  : ""
                              }
                              id={
                                meta.error && meta.touched
                                  ? "isError"
                                  : "auditUsers"
                              }
                              cacheOptions
                              defaultOptions
                              loadOptions={fetchUsers}
                              isMulti
                              components={{
                                DropdownIndicator: () => null,
                                IndicatorSeparator: () => null
                              }}
                              isClearable={false}
                              placeholder="Select User"
                            />
                          </Col>
                        </Row>
                      )}
                    />

                    <Field
                      name="adminUserGroups"
                      render={({ input, meta }) => (
                        <Row className="form-group">
                          <Col xs={3}>
                            <label className="form-label pull-right">
                              Admin Usergroups
                            </label>
                          </Col>
                          <Col xs={4}>
                            <AsyncSelect
                              styles={
                                meta.error && meta.touched
                                  ? selectCustomStyles
                                  : ""
                              }
                              id={
                                meta.error && meta.touched
                                  ? "isError"
                                  : "adminUserGroups"
                              }
                              {...input}
                              defaultOptions
                              loadOptions={fetchGroups}
                              isMulti
                              components={{
                                DropdownIndicator: () => null,
                                IndicatorSeparator: () => null
                              }}
                              isClearable={false}
                              placeholder="Select Group"
                              required
                            />
                            {meta.touched && meta.error && (
                              <span className="invalid-field">
                                {meta.error.text}
                              </span>
                            )}
                          </Col>
                        </Row>
                      )}
                    />

                    <Field
                      name="auditUsers"
                      render={({ input, meta }) => (
                        <Row className="form-group">
                          <Col xs={3}>
                            <label className="form-label pull-right">
                              Auditor Users
                            </label>
                          </Col>
                          <Col xs={4}>
                            <AsyncSelect
                              styles={
                                meta.error && meta.touched
                                  ? selectCustomStyles
                                  : ""
                              }
                              {...input}
                              id={
                                meta.error && meta.touched
                                  ? "isError"
                                  : "auditUsers"
                              }
                              defaultOptions
                              loadOptions={fetchUsers}
                              isMulti
                              components={{
                                DropdownIndicator: () => null,
                                IndicatorSeparator: () => null
                              }}
                              isClearable={false}
                              placeholder="Select User"
                            />
                          </Col>
                        </Row>
                      )}
                    />
                    <Field
                      name="auditUserGroups"
                      render={({ input, meta }) => (
                        <Row className="form-group">
                          <Col xs={3}>
                            <label className="form-label pull-right">
                              Auditor Usergroups
                            </label>
                          </Col>
                          <Col xs={4}>
                            <AsyncSelect
                              styles={
                                meta.error && meta.touched
                                  ? selectCustomStyles
                                  : ""
                              }
                              {...input}
                              id={
                                meta.error && meta.touched
                                  ? "isError"
                                  : "auditUserGroups"
                              }
                              defaultOptions
                              loadOptions={fetchGroups}
                              isMulti
                              components={{
                                DropdownIndicator: () => null,
                                IndicatorSeparator: () => null
                              }}
                              isClearable={false}
                              placeholder="Select Group"
                            />
                            {meta.error && meta.touched && (
                              <span className="invalid-field">
                                {meta.error.text}
                              </span>
                            )}
                          </Col>
                        </Row>
                      )}
                    />
                    <p className="form-header">Services:</p>
                    <Field
                      name="tagServices"
                      render={({ input }) => (
                        <Row className="form-group">
                          <Col xs={3}>
                            <label className="form-label pull-right">
                              Select Tag Services
                            </label>
                          </Col>
                          <Col xs={6}>
                            <AsyncSelect
                              {...input}
                              defaultOptions
                              loadOptions={fetchTagServices}
                              isMulti
                              components={{
                                DropdownIndicator: () => null,
                                IndicatorSeparator: () => null
                              }}
                              isClearable={false}
                              placeholder="Select Tag Services"
                            />
                          </Col>
                        </Row>
                      )}
                    />
                    <Field
                      name="resourceServices"
                      render={({ input, meta }) => (
                        <Row className="form-group">
                          <Col xs={3}>
                            <label className="form-label pull-right">
                              Select Resource Services *
                            </label>
                          </Col>
                          <Col xs={6}>
                            <Select
                              {...input}
                              id={meta.error && meta.touched ? "isError" : ""}
                              onChange={(values, e) =>
                                resourceServicesOnChange(
                                  e,
                                  input,
                                  values,
                                  push,
                                  remove
                                )
                              }
                              isMulti
                              components={{
                                DropdownIndicator: () => null,
                                IndicatorSeparator: () => null
                              }}
                              options={resourceServicesOpt}
                              isClearable={false}
                              isSearchable={true}
                              placeholder="Select Service Name"
                            />
                            {meta.error && meta.touched && (
                              <span className="invalid-field">
                                {meta.error.text}
                              </span>
                            )}
                          </Col>
                        </Row>
                      )}
                    />
                    <Table striped bordered>
                      <thead>
                        <tr>
                          <th className="p-3 mb-2 bg-white text-dark  align-middle text-center">
                            Service Name
                          </th>
                          <th className="p-3 mb-2 bg-white text-dark align-middle text-center">
                            Service Type
                          </th>
                          <th className="p-3 mb-2 bg-white text-dark align-middle text-center">
                            Resource
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <FieldArray name="tableList">
                          {({ fields }) =>
                            fields.value && fields.value.length > 0 ? (
                              fields.map((name, index) => (
                                <tr className="bg-white" key={index}>
                                  <td className="align-middle">
                                    <h6> {fields.value[index].serviceName} </h6>
                                  </td>
                                  <td className="align-middle">
                                    <h6>
                                      {fields.value[index].serviceType
                                        .toString()
                                        .toUpperCase()}
                                    </h6>
                                  </td>
                                  <td className="text-center" key={name}>
                                    <Field
                                      name={`${name}.resources`}
                                      render={(input) => (
                                        <React.Fragment>
                                          {input.input.value &&
                                          input.input.value.length > 0
                                            ? input.input.value.map(
                                                (obj, idx) => (
                                                  <div
                                                    className="resource-group"
                                                    key={idx}
                                                  >
                                                    <Row>
                                                      <Col xs={9}>
                                                        <span className="m-t-xs">
                                                          {showResources(
                                                            obj,
                                                            fields.value[index]
                                                              .serviceType
                                                          )}
                                                        </span>
                                                      </Col>
                                                      <Col xs={3}>
                                                        <Button
                                                          title="edit"
                                                          className="btn btn-primary m-r-xs btn-mini m-r-5"
                                                          size="sm"
                                                          onClick={() =>
                                                            editResourcesModal(
                                                              idx,
                                                              input,
                                                              fields.value[
                                                                index
                                                              ].serviceType
                                                            )
                                                          }
                                                        >
                                                          <i className="fa-fw fa fa-edit"></i>
                                                        </Button>
                                                        <Button
                                                          title="delete"
                                                          className="btn btn-danger active  btn-mini"
                                                          size="sm"
                                                          onClick={() =>
                                                            handleRemove(
                                                              idx,
                                                              input
                                                            )
                                                          }
                                                        >
                                                          <i className="fa-fw fa fa-remove"></i>
                                                        </Button>
                                                      </Col>
                                                    </Row>
                                                  </div>
                                                )
                                              )
                                            : ""}
                                          <div className="resource-list min-width-150">
                                            <Button
                                              title="add"
                                              className="btn btn-mini pull-left"
                                              variant="outline-secondary"
                                              size="sm"
                                              onClick={() =>
                                                renderResourcesModal(
                                                  input,
                                                  fields.value[index]
                                                    .serviceType
                                                )
                                              }
                                            >
                                              <i className="fa-fw fa fa-plus "></i>
                                            </Button>
                                          </div>
                                        </React.Fragment>
                                      )}
                                    />
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan="3"
                                  className="text-center text-secondary"
                                >
                                  <h6>No Zone Data Found!!</h6>
                                </td>
                              </tr>
                            )
                          }
                        </FieldArray>
                      </tbody>
                    </Table>
                    <Row className="form-actions">
                      <Col sm={{ span: 9, offset: 3 }}>
                        <Button
                          variant="primary"
                          type="submit"
                          size="sm"
                          disabled={submitting}
                        >
                          Save
                        </Button>
                        <Button
                          variant="secondary"
                          type="button"
                          size="sm"
                          onClick={() => {
                            props.history.goBack();
                          }}
                        >
                          Cancel
                        </Button>
                      </Col>
                    </Row>
                  </form>

                  <ModalResourceComp
                    serviceDetails={resourceService}
                    serviceCompDetails={resourceServiceDef}
                    cancelButtonText="Cancel"
                    actionButtonText="Submit"
                    modelState={modelState}
                    handleSave={handleSave}
                    handleClose={handleClose}
                    policyItem={true}
                  />
                </Col>
              </Row>
            )}
          />
        )}
      </div>
    </React.Fragment>
  );
};

export default SecurityZoneForm;
