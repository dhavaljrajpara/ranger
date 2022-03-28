import React, { useState, useEffect } from "react";
import { Form, Field } from "react-final-form";
import { Button, Modal } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import AsyncSelect from "react-select/async";
import { fetchApi } from "Utils/fetchAPI";
import { groupBy, findIndex, isEmpty, pickBy } from "lodash";
import { Table } from "react-bootstrap";
import { FieldArray } from "react-final-form-arrays";
import arrayMutators from "final-form-arrays";
import ModalResourceComp from "../Resources/ModalResourceComp";
import { toast } from "react-toastify";
const noneOptions = {
  label: "None",
  value: "none"
};
const CreateZone = (props) => {
  const history = useHistory();
  const [service, SetService] = useState([]);
  const [resource, SetResource] = useState([]);
  const [servicedef, SetServiceDef] = useState([]);
  const [showmodal, SetShowModal] = useState(false);
  const [zones, SetZones] = useState([]);

  const [modelState, setModalstate] = useState({
    showModalResource: false,
    data: null,
    inputval: null,
    index: 0
  });

  useEffect(() => {
    if (props.match.params.id !== undefined) {
      fetchZone();
    }

    fetchServiceDefs();
  }, []);

  const showModal = () => {
    SetShowModal(true);
  };

  const hideModal = () => {
    SetShowModal(false);
  };

  const handleClose = () =>
    setModalstate({
      showModalResource: false,
      data: null,
      inputval: null
    });

  const renderResourcesModal = (input, serviceType) => {
    let filterdef = servicedef.find((obj) => obj.name == serviceType);
    for (const obj of filterdef.resources) {
      obj.recursiveSupported = false;
      obj.excludesSupported = false;
      if (obj.level !== 10) {
        obj.mandatory = false;
      }
    }
    SetResource(filterdef);
    setModalstate({
      showModalResource: true,
      data: {},
      inputval: input,
      index: -1
    });
  };
  const editResourcesModal = (idx, input) => {
    let editData = input.input.value[idx];

    setModalstate({
      showModalResource: true,
      data: editData,
      inputval: input,
      index: idx
    });
  };
  const onSubmit = async (values) => {
    // if (!values.adminUserGroups) {
    //   return { adminUserGroups: "Required" };
    // }

    const zoneData = {};
    zoneData.name = values.name;
    zoneData.description = values.description || "";
    zoneData.adminUsers = [];
    if (values.adminUsers) {
      for (var key of Object.keys(values.adminUsers)) {
        zoneData.adminUsers.push(values.adminUsers[key].label);
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
          if (val.includes("resourceName")) {
            if (obj[`value-${key.level}`] !== undefined) {
              serviceResourceData[key.name] =
                obj[`value-${key.level}`] !== undefined
                  ? obj[`value-${key.level}`].map((value) => value.value)
                  : "";
            }
          }
        });
        return zoneData.services[serviceName].resources.push(
          serviceResourceData
        );
      });
      if (zoneData.services[serviceName].resources.length == 0) {
        showModal();
      }
    }

    try {
      await fetchApi({
        url: "/zones/zones",
        method: "post",
        data: zoneData
      });
      toast.success(`Success! Key created succesfully`);
      history.goBack();
    } catch (error) {
      console.error(`Error occurred while creating Key`);
    }
  };

  const fetchZone = async () => {
    let zoneResp;
    let Id = this.props.match.params.id;
    try {
      zoneResp = await fetchApi({
        url: `zones/zones/${Id}`
      });
    } catch (error) {
      console.error(
        `Error occurred while fetching Service or CSRF headers! ${error}`
      );
    }

    SetZones(zoneResp);

    const serviceJson = {};
    serviceJson["name"] = zones.name;
    serviceJson["description"] = zones.description;
  };

  const fetchUsers = async (inputValue) => {
    let params = {};
    if (inputValue) {
      params["name"] = inputValue || "";
    }
    const userResp = await fetchApi({
      url: "xusers/users",
      params: params
    });

    return userResp.data.vXUsers.map(({ name, id }) => ({
      label: name,
      value: id
    }));
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
    return groupResp.data.vXGroups.map(({ name, id }) => ({
      label: name,
      value: id
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
    return services.map(({ name, id }) => ({
      label: name,
      value: id
    }));
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
          return { label: name.name, value: name.id };
        })
      });
    }

    return resourceService;
  };

  const fetchServiceDefs = async () => {
    try {
      const servicetypeResp = await fetchApi({
        url: `plugins/definitions`
      });

      SetServiceDef(servicetypeResp.data.serviceDefs);
    } catch (error) {
      console.error(`Error occurred while fetching Services! ${error}`);
    }
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

  const handleRemove = (i, input) => {
    input.input.value.splice(i, 1);
    handleClose();
  };

  const showResources = (value) => {
    let data = {};
    const grpResources = groupBy(resource.resources || [], "level");
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
        {data.resources[obj].values.length > 0 ? (
          <>
            <strong>{`${obj} : `}</strong>
            <span>{data.resources[obj].values.join(", ")}</span>
          </>
        ) : (
          ""
        )}
      </p>
    ));
  };

  return (
    <div>
      <h4 className="wrap-header bold">
        {props.match.params.id !== undefined ? `Edit` : `Create`} Zone
      </h4>
      <Form
        onSubmit={onSubmit}
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

          if (!values.resourceservices) {
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
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label text-right">
                      Zone Name *
                    </label>
                    <div className="col-sm-4">
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
                    </div>
                  </div>
                )}
              </Field>
              <Field name="description">
                {({ input }) => (
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label text-right">
                      Zone Description
                    </label>
                    <div className="col-sm-4">
                      <textarea {...input} className="form-control" />
                    </div>
                  </div>
                )}
              </Field>
              <br />
              <p className="form-header">Zone Details:</p>

              <Field
                name="adminUsers"
                render={({ input, meta }) => (
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label text-right">
                      Admin Users
                    </label>
                    <div className="col-sm-4">
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
                        width="500px"
                        components={{
                          DropdownIndicator: () => null,
                          IndicatorSeparator: () => null
                        }}
                        isClearable={false}
                        menuPlacement="auto"
                        placeholder="Select User"
                      />
                    </div>
                  </div>
                )}
              />
              <Field
                name="adminUserGroups"
                render={({ input, meta }) => (
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label text-right">
                      Admin Usergroups
                    </label>
                    <div className="col-sm-4">
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
                        width="500px"
                        components={{
                          DropdownIndicator: () => null,
                          IndicatorSeparator: () => null
                        }}
                        isClearable={false}
                        menuPlacement="auto"
                        placeholder="Select Group"
                        required
                      />
                      {meta.touched && meta.error && (
                        <span className="invalid-field">{meta.error.text}</span>
                      )}
                    </div>
                  </div>
                )}
              />
              <Field
                name="auditUsers"
                render={({ input, meta }) => (
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label text-right">
                      Auditor Users
                    </label>
                    <div className="col-sm-4">
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
                        width="500px"
                        components={{
                          DropdownIndicator: () => null,
                          IndicatorSeparator: () => null
                        }}
                        isClearable={false}
                        menuPlacement="auto"
                        placeholder="Select User"
                      />
                    </div>
                  </div>
                )}
              />
              <Field
                className="form-control"
                name="auditUserGroups"
                render={({ input, meta }) => (
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label text-right">
                      Auditor Usergroups
                    </label>
                    <div className="col-sm-4">
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
                        width="500px"
                        components={{
                          DropdownIndicator: () => null,
                          IndicatorSeparator: () => null
                        }}
                        isClearable={false}
                        menuPlacement="auto"
                        placeholder="Select Group"
                      />
                      {meta.error && meta.touched && (
                        <span className="invalid-field">{meta.error.text}</span>
                      )}
                    </div>
                  </div>
                )}
              />
              <br />
              <p className="form-header">Services:</p>
              <Field
                className="form-control"
                name="tagServices"
                render={({ input }) => (
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label text-right">
                      Select Tag Services
                    </label>
                    <div className="col-sm-4">
                      <AsyncSelect
                        {...input}
                        className="form-control p-0 border-0"
                        defaultOptions
                        loadOptions={fetchTagServices}
                        isMulti
                        width="500px"
                        components={{
                          DropdownIndicator: () => null,
                          IndicatorSeparator: () => null
                        }}
                        isClearable={false}
                        menuPlacement="auto"
                        placeholder="Select Tag Services"
                      />
                    </div>
                  </div>
                )}
              />

              <Field
                className="form-control"
                name="resourceservices"
                render={({ input, meta }) => (
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label text-right">
                      Select Resource Services*
                    </label>
                    <div className="col-sm-4">
                      <AsyncSelect
                        {...input}
                        className="form-control p-0 border-0"
                        defaultOptions
                        onChange={(values, e) =>
                          resourceonChange(values, input, push, e, remove)
                        }
                        loadOptions={fetchResourceService}
                        isMulti
                        width="500px"
                        components={{
                          DropdownIndicator: () => null,
                          IndicatorSeparator: () => null
                        }}
                        isClearable={false}
                        menuPlacement="auto"
                        placeholder="Select Service Name"
                      />
                      {meta.error && meta.touched && (
                        <span className="invalid-field">{meta.error.text}</span>
                      )}
                    </div>
                  </div>
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
                      fields.value !== undefined && fields.value.length ? (
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
                                    {input.input.value !== undefined
                                      ? input.input.value.map((obj, idx) => (
                                          <>
                                            <div className="resourceGrp">
                                              <div className="row">
                                                <div className="col-9">
                                                  <div className="m-t-xs">
                                                    {showResources(obj)}
                                                  </div>
                                                </div>
                                                <div class="col-3">
                                                  <Button
                                                    title="edit"
                                                    className="btn btn-primary m-r-xs btn-mini m-r-5"
                                                    onClick={() =>
                                                      editResourcesModal(
                                                        idx,
                                                        input
                                                      )
                                                    }
                                                  >
                                                    <i className="fa-fw fa fa-edit"></i>
                                                  </Button>
                                                  <Button
                                                    className="btn btn-danger active  btn-mini"
                                                    onClick={() =>
                                                      handleRemove(idx, input)
                                                    }
                                                  >
                                                    <i class="fa-fw fa fa-remove"></i>
                                                  </Button>
                                                </div>
                                              </div>
                                            </div>
                                          </>
                                        ))
                                      : ""}
                                    <div className="resource-list min-width-150">
                                      <Button
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
            <Modal
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
            </Modal>
            <ModalResourceComp
              serviceDetails={{}}
              serviceCompDetails={resource}
              cancelButtonText="Cancel"
              actionButtonText="Submit"
              modelState={modelState}
              handleSave={handleSave}
              handleClose={handleClose}
              policyItem={false}
            />
          </div>
        )}
      />
    </div>
  );
};

export default CreateZone;
