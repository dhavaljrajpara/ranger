import React, { useState, useEffect } from "react";
import { Form, Field } from "react-final-form";
import { Button, Modal, Row, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import AsyncSelect from "react-select/async";
import { fetchApi } from "Utils/fetchAPI";
import { groupBy, findIndex, isEmpty, pickBy, find, filter } from "lodash";
import { Table } from "react-bootstrap";
import { FieldArray } from "react-final-form-arrays";
import arrayMutators from "final-form-arrays";
import ModalResourceComp from "../Resources/ModalResourceComp";
import { RegexValidation } from "Utils/XAEnums";
import { toast } from "react-toastify";
import { Loader } from "Components/CommonComponents";

const noneOptions = {
  label: "None",
  value: "none"
};
const SecurityZoneForm = (props) => {
  const history = useHistory();
  const [service, SetService] = useState([]);
  const [resource, SetResource] = useState([]);
  const [servicedef, SetServiceDef] = useState([]);
  const [showmodal, SetShowModal] = useState(false);
  const [zones, SetZones] = useState([]);
  const [loader, SetLoader] = useState(true);

  const [modelState, setModalstate] = useState({
    showModalResource: false,
    data: null,
    inputval: null,
    index: 0
  });

  useEffect(() => {
    fetchInitalData();
  }, []);

  // const showModal = () => {
  //   SetShowModal(true);
  // };

  // const hideModal = () => {
  //   SetShowModal(false);
  // };

  const handleClose = () => {
    setModalstate({
      showModalResource: false,
      data: null,
      inputval: null,
      index: 0
    });
  };

  const fetchZones = async () => {
    let zoneResp;
    if (props.match.params.id !== undefined) {
      let Id = props.match.params.id;

      try {
        zoneResp = await fetchApi({
          url: `zones/zones/${Id}`
        });
      } catch (error) {
        console.error(
          `Error occurred while fetching Zone or CSRF headers! ${error}`
        );
        toast.error(error.response.data.msgDesc);
      }
    }

    SetZones(zoneResp);
    SetLoader(false);
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

    SetServiceDef(servicetypeResp.data.serviceDefs);
  };
  const fetchInitalData = async () => {
    await fetchResourceService();
    await fetchServiceDefs();
    await fetchZones();
  };
  const renderResourcesModal = (input, serviceType) => {
    let filterdef = servicedef.find((obj) => obj.name == serviceType);
    for (const obj of filterdef.resources) {
      obj.recursiveSupported = false;
      obj.excludesSupported = false;
      if (obj.level !== 10) {
        obj.mandatory = false;
      }
      if (obj.lookupSupported !== undefined && obj.lookupSupported) {
        obj.lookupSupported = false;
      }
    }
    setModalstate({
      showModalResource: true,
      data: {},
      inputval: input,
      index: -1
    });
    SetResource(filterdef);
  };
  const editResourcesModal = (idx, input, serviceType) => {
    let editData = input.input.value[idx];
    let filterdef = servicedef.find((obj) => obj.name == serviceType);
    for (const obj of filterdef.resources) {
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
    SetResource(filterdef);
  };
  const onSubmit = async (values) => {
    let zoneId;
    let apiMethod;
    let apiUrl;
    let apiSuccess;
    let apiError;
    let zoneData = {};

    if (props.match.params.id !== undefined) {
      zoneId = props.match.params.id;
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
    if (props.match.params.id) {
      zoneData = {
        ...zones.data,
        ...zoneData
      };
    }
    try {
      await fetchApi({
        url: apiUrl,
        method: apiMethod,
        data: zoneData
      });
      toast.success(`Success! Service zone ${apiSuccess} succesfully`);
      history.goBack();
    } catch (error) {
      console.error(`Error occurred while ${apiError} Zone`);
      if (
        error.response !== undefined &&
        _.has(error.response, "data.msgDesc")
      ) {
        toast.error(error.response.data.msgDesc);
      }
    }
  };
  const fetchResourceService = async (inputValue) => {
    let params = {};
    if (inputValue) {
      params["name"] = inputValue || "";
    }
    const serviceDefnsResp = await fetchApi({
      url: "plugins/services",
      params: params
    });

    const services = serviceDefnsResp.data.services.filter(
      (obj) => obj.type !== "tag" && obj.type !== "kms"
    );

    SetService(services);

    const service = groupBy(services, "type");

    let resourceService = [];
    for (var key of Object.keys(service)) {
      resourceService.push({
        label: <span className="font-weight-bold text-body h6">{key}</span>,
        options: service[key].map((name) => {
          return { label: name.name, value: name.name };
        })
      });
    }

    return resourceService;
  };

  const EditFormData = () => {
    const zoneData = {};
    zoneData.name = zones.data.name;
    zoneData.description = zones.data.description;
    zoneData.adminUserGroups = [];
    if (zones.data.adminUserGroups) {
      zones.data.adminUserGroups.map((name) =>
        zoneData.adminUserGroups.push({ label: name, value: name })
      );
    }
    zoneData.adminUsers = [];
    if (zones.data.adminUsers) {
      zones.data.adminUsers.map((name) =>
        zoneData.adminUsers.push({ label: name, value: name })
      );
    }
    zoneData.auditUserGroups = [];
    if (zones.data.auditUserGroups) {
      zones.data.auditUserGroups.map((name) =>
        zoneData.auditUserGroups.push({ label: name, value: name })
      );
    }
    zoneData.auditUsers = [];
    if (zones.data.auditUsers) {
      zones.data.auditUsers.map((name) =>
        zoneData.auditUsers.push({ label: name, value: name })
      );
    }

    zoneData.tagServices = [];
    if (zones.data.tagServices) {
      zones.data.tagServices.map((name) =>
        zoneData.tagServices.push({ label: name, value: name })
      );
    }
    zoneData.resourceservices = [];
    if (zones.data.services) {
      Object.keys(zones.data.services).map((name) =>
        zoneData.resourceservices.push({ label: name, value: name })
      );
    }

    zoneData.tableList = [];
    for (let name of Object.keys(zones.data.services)) {
      let tablevalues = {};
      tablevalues["serviceName"] = name;
      let serviceType = service.find((obj) => {
        return obj.name == name;
      });
      tablevalues["serviceType"] = serviceType;

      let filterdef = servicedef.find((def) => {
        return def.name == serviceType.type;
      });
      for (const obj of filterdef.resources) {
        obj.recursiveSupported = false;
        obj.excludesSupported = false;
        if (obj.level !== 10) {
          obj.mandatory = false;
        }
      }
      let serviceresource = {};
      zones.data.services[name].resources.map((obj) => {
        Object.entries(obj).map(([key, value]) => {
          tablevalues["resources"] = [];
          let setResources = find(filterdef.resources, ["name", key]);
          serviceresource[`resourceName-${setResources.level}`] = setResources;
          serviceresource[`value-${setResources.level}`] = value.map((m) => {
            return { label: m, value: m };
          });
          if (setResources.excludesSupported) {
            serviceresource[`isExcludesSupport-${setResources.level}`] =
              value.isExcludes;
          }
          if (setResources.recursiveSupported) {
            serviceresource[`recursiveSupported-${setResources.level}`] =
              value.isRecursive;
          }
        });
      });
      tablevalues["resources"].push(serviceresource);
      zoneData.tableList.push(tablevalues);
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
    const services = serviceResp.data.services.filter(
      (obj) => obj.type == "tag"
    );
    return services.map(({ name }) => ({
      label: name,
      value: name
    }));
  };

  const resourceonChange = async (values, input, push, e, remove) => {
    let Serviceval = [];
    let Servicename = [];
    for (var key of Object.keys(values)) {
      Serviceval.push(values[key].value);
      Servicename.push(values[key].label);
    }

    if (e.action == "select-option") {
      var servicetype = Object.values(service).find((obj) => {
        return obj.name === e.option.label;
      });

      push("tableList", {
        serviceName: e.option.label,
        serviceType: servicetype,
        resources: []
      });
    }

    if (e.action == "remove-value") {
      let Removedvalindex = findIndex(input.value, [
        "label",
        e.removedValue.label
      ]);
      remove("tableList", Removedvalindex);
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
    let filterdef = servicedef.find((obj) => obj.name == serviceType);
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
    return Object.keys(data.resources).map((obj) => (
      <p>
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

  return loader ? (
    <Loader />
  ) : (
    <div>
      <h4 className="wrap-header bold">
        {props.match.params.id !== undefined ? `Edit` : `Create`} Zone
      </h4>
      <Form
        onSubmit={onSubmit}
        /* override the Initial Values */
        keepDirtyOnReinitialize={true}
        initialValues={props.match.params.id !== undefined && EditFormData()}
        mutators={{
          ...arrayMutators
        }}
        validate={(values) => {
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
                text: RegexValidation.NAME_VALIDATION
                  .regexforNameValidationMessage
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

          if (isEmpty(values.resourceservices)) {
            errors.resourceservices = {
              required: true,
              text: "Required"
            };
          }

          return errors;
        }}
        render={({
          handleSubmit,
          form: {
            mutators: { push, remove }
          },

          form,
          values,
          submitting,
          pristine,
          errors
        }) => (
          <div className="wrap">
            <form onSubmit={handleSubmit}>
              <p className="form-header">Zone Details:</p>
              <Field name="name">
                {({ input, meta }) => (
                  <Row>
                    <Col xs={3}>
                      <label className="form-label pull-right">
                        Zone Name *
                      </label>
                    </Col>
                    <Col xs={4}>
                      <input
                        {...input}
                        type="text"
                        className={
                          meta.error && meta.touched
                            ? "form-control border border-danger"
                            : "form-control"
                        }
                      />
                      {meta.error && meta.touched && (
                        <span className="invalid-field">{meta.error.text}</span>
                      )}
                    </Col>
                  </Row>
                )}
              </Field>
              <br />
              <Field name="description">
                {({ input }) => (
                  <Row>
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
              <br />
              <p className="form-header">Zone Details:</p>

              <Field
                name="adminUsers"
                render={({ input, meta }) => (
                  <Row>
                    <Col xs={3}>
                      <label className="form-label pull-right">
                        Admin Users
                      </label>
                    </Col>
                    <Col xs={4}>
                      <AsyncSelect
                        {...input}
                        cacheOptions
                        className={
                          meta.error && meta.touched
                            ? "form-control border border-danger p-0"
                            : "form-control p-0  border-0"
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
              <br />
              <Field
                name="adminUserGroups"
                render={({ input, meta }) => (
                  <Row>
                    <Col xs={3}>
                      <label className="form-label pull-right">
                        Admin Usergroups
                      </label>
                    </Col>
                    <Col xs={4}>
                      <AsyncSelect
                        {...input}
                        className={
                          meta.error && meta.touched
                            ? "form-control border border-danger p-0"
                            : "form-control p-0  border-0"
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
                        required
                      />
                      {meta.touched && meta.error && (
                        <span className="invalid-field">{meta.error.text}</span>
                      )}
                    </Col>
                  </Row>
                )}
              />
              <br />
              <Field
                name="auditUsers"
                render={({ input, meta }) => (
                  <Row>
                    <Col xs={3}>
                      <label className="form-label pull-right">
                        Auditor Users
                      </label>
                    </Col>
                    <Col xs={4}>
                      <AsyncSelect
                        {...input}
                        className={
                          meta.error && meta.touched
                            ? "form-control border border-danger p-0"
                            : "form-control p-0  border-0"
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
              <br />
              <Field
                className="form-control"
                name="auditUserGroups"
                render={({ input, meta }) => (
                  <Row>
                    <Col xs={3}>
                      <label className="form-label pull-right">
                        Auditor Usergroups
                      </label>
                    </Col>
                    <Col xs={4}>
                      <AsyncSelect
                        {...input}
                        className={
                          meta.error && meta.touched
                            ? "form-control border border-danger p-0"
                            : "form-control p-0  border-0"
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
                        <span className="invalid-field">{meta.error.text}</span>
                      )}
                    </Col>
                  </Row>
                )}
              />
              <br />
              <p className="form-header">Services:</p>
              <Field
                className="form-control"
                name="tagServices"
                render={({ input }) => (
                  <Row>
                    <Col xs={3}>
                      {" "}
                      <label className="form-label pull-right">
                        Select Tag Services
                      </label>
                    </Col>
                    <Col xs={6}>
                      <AsyncSelect
                        {...input}
                        className="form-control p-0 border-0"
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
              <br />
              <Field
                className="form-control"
                name="resourceservices"
                render={({ input, meta }) => (
                  <Row>
                    <Col xs={3}>
                      <label className="form-label pull-right">
                        Select Resource Services*
                      </label>
                    </Col>
                    <Col xs={6}>
                      <AsyncSelect
                        {...input}
                        className="form-control p-0 border-0"
                        defaultOptions
                        onChange={(values, e) =>
                          resourceonChange(values, input, push, e, remove)
                        }
                        loadOptions={fetchResourceService}
                        isMulti
                        components={{
                          DropdownIndicator: () => null,
                          IndicatorSeparator: () => null
                        }}
                        isClearable={false}
                        placeholder="Select Service Name"
                      />
                      {meta.error && meta.touched && (
                        <span className="invalid-field">{meta.error.text}</span>
                      )}
                    </Col>
                  </Row>
                )}
              />
              <br />

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
                            <td className="align-middle" width="20%">
                              <h6> {fields.value[index].serviceName} </h6>
                            </td>

                            <td className="align-middle" width="20%">
                              <h6>
                                {fields.value[index].serviceType.type
                                  .toString()
                                  .toUpperCase()}
                              </h6>
                            </td>

                            <td
                              className="text-center"
                              width="32%"
                              height="55px"
                              key={name}
                            >
                              <Field
                                name={`${name}.resources`}
                                render={(input) => (
                                  <>
                                    {input.input.value &&
                                    input.input.value.length > 0
                                      ? input.input.value.map((obj, idx) => (
                                          <>
                                            <div className="resource-group">
                                              <Row>
                                                <Col xs={9}>
                                                  <span className="m-t-xs">
                                                    {showResources(
                                                      obj,
                                                      fields.value[index]
                                                        .serviceType.type
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
                                                        fields.value[index]
                                                          .serviceType.type
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
                                                      handleRemove(idx, input)
                                                    }
                                                  >
                                                    <i className="fa-fw fa fa-remove"></i>
                                                  </Button>
                                                </Col>
                                              </Row>
                                            </div>
                                          </>
                                        ))
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
                                            fields.value[index].serviceType.type
                                          )
                                        }
                                      >
                                        <i className="fa-fw fa fa-plus "></i>
                                      </Button>
                                    </div>
                                  </>
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
              <div className="row form-actions">
                <div className="col-md-9 offset-md-3">
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
                </div>
              </div>
            </form>
            {/* <Modal
              show={showmodal}
              onHide={hideModal}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header
                closeButton
              >{`Please add at least one resource for  service`}</Modal.Header>
              <Modal.Footer>
                <Button variant="primary" onClick={hideModal}>
                  OK
                </Button>
              </Modal.Footer>
            </Modal> */}
            <ModalResourceComp
              serviceDetails={{}}
              serviceCompDetails={resource}
              cancelButtonText="Cancel"
              actionButtonText="Submit"
              modelState={modelState}
              handleSave={handleSave}
              handleClose={handleClose}
              policyItem={true}
            />
          </div>
        )}
      />
    </div>
  );
};

export default SecurityZoneForm;
