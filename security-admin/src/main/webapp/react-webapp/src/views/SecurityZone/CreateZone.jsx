import React from "react";
import { Form, Field } from "react-final-form";
import { Button } from "react-bootstrap";
import Select, { components } from "react-select";
import Services from "./Services";

const onSubmit = async (values) => {};

const msgStyles = {
  background: "white",
  color: "black",
};
const NoOptionsMessage = (props) => {
  return (
    <components.NoOptionsMessage {...props}>
      <span>No group found.</span>
    </components.NoOptionsMessage>
  );
};

class CreateZone extends React.Component {
  state = {
    zones: [],
    users: [],
    groups: [],
    services: [],
  };

  componentDidMount() {
    this.fetchZones();
    this.fetchUsers();
    this.fetchGroups();
    this.fetchServices();
  }
  Theme = (theme) => {
    return {
      ...theme,
      colors: {
        ...theme.colors,
        primary25: "#0b7fad;",
        primary: "#0b7fad;",
      },
    };
  };
  fetchZones = async () => {
    let zonesResp;
    try {
      const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
      zonesResp = await fetchApi({
        url: "zones/zones",
      });
      await fetchCSRFConf();
    } catch (error) {
      console.error(
        `Error occurred while fetching Zones or CSRF headers! ${error}`
      );
    }
    this.setState({
      zones: zonesResp.data.securityZones,
    });
  };
  fetchUsers = async () => {
    let usersResp;
    try {
      const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
      usersResp = await fetchApi({
        url: "xusers/lookup/users",
      });
    } catch (error) {
      console.error(
        `Error occurred while fetching Zones or CSRF headers! ${error}`
      );
    }
    this.setState({
      users: usersResp.data.vXStrings,
    });
  };
  fetchGroups = async () => {
    let groupsResp;
    try {
      const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
      groupsResp = await fetchApi({
        url: "xusers/lookup/groups",
      });
    } catch (error) {
      console.error(
        `Error occurred while fetching Zones or CSRF headers! ${error}`
      );
    }
    this.setState({
      groups: groupsResp.data.vXStrings,
    });
  };
  fetchServices = async () => {
    let servicesResp;
    try {
      const { fetchApi, fetchCSRFConf } = await import("Utils/fetchAPI");
      servicesResp = await fetchApi({
        url: "plugins/services",
      });
    } catch (error) {
      console.error(
        `Error occurred while fetching Service Definitions or CSRF headers! ${error}`
      );
    }
    this.setState({
      services: servicesResp.data.services,
    });
  };

  render() {
    const { users } = this.state;
    const { services } = this.state;
    const { groups } = this.state;
    let option = [];
    users.map((user) => {
      let options = {};
      options.value = user.value;
      options.label = user.value;
      option.push(options);
    });
    let Option = [];
    groups.map((group) => {
      let options = {};
      options.value = group.value;
      options.label = group.value;
      Option.push(options);
    });
    let Options = [];
    services.map((services) => {
      let options = {};
      options.value = services.name;
      options.label = services.name;
      Options.push(options);
    });
    const validate = (values) => {
      const errors = {};
      if (!values.Zonename) {
        errors.Zonename = "Required";
      }
      if (!values.adminusergroups) {
        errors.adminusergroups =
          "Please provide atleast one admin user or group!";
      }
      if (!values.resourceservices) {
        errors.resourceservices = "Required";
      }
      if (!values.auditorusergroups) {
        errors.auditorusergroups =
          "Please provide atleast one audit user or group!";
      }

      return errors;
    };

    return (
      <div>
        <h5>Create Zone </h5>
        <Form
          onSubmit={onSubmit}
          validate={validate}
          render={({ handleSubmit, submitting }) => (
            <form onSubmit={handleSubmit}>
              <div className="form-horizontal">
                <header>Zone Details:</header>
                <hr className="zoneheader" />
                <div className="form-group row">
                  <div className="zonedetails">
                    <Field
                      className="form-control"
                      name="Zonename"
                      render={({ input, meta }) => (
                        <div>
                          <label className="zonename">Zone Name*</label>
                          <input {...input} className="zonenameinput" />
                          {meta.touched && meta.error && (
                            <span className="error">{meta.error}</span>
                          )}
                        </div>
                      )}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <div className="zonedetails">
                    <Field
                      className="form-control"
                      name="zonedesc"
                      render={({ input, meta }) => (
                        <div>
                          <label className="zonedescription">
                            Zone Description
                          </label>

                          <textarea {...input} className="zonedescinput" />
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="form-horizontal">
                <header>Zone Adminisrations:</header>
                <hr className="zoneheader" />
                <div className="form-group row">
                  <div className="zonedetails">
                    <Field
                      className="form-control"
                      name="adminusers"
                      render={({ input, meta }) => (
                        <div>
                          <label className="zonename">Admin Users</label>
                          <Select
                            className="zoneadmin"
                            options={option}
                            isMulti
                            components={{
                              DropdownIndicator: () => null,
                              IndicatorSeparator: () => null,
                            }}
                            isClearable={false}
                            theme={this.Theme}
                            name="colors"
                            placeholder="Select User "
                          />
                          {meta.touched && meta.error && (
                            <span>{meta.error}</span>
                          )}
                        </div>
                      )}
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <div className="zonedetails">
                    <Field
                      className="form-control"
                      name="adminusergroups"
                      render={({ input, meta }) => (
                        <div>
                          <label className="lblusergroups">
                            Admin Usersgroups
                          </label>
                          <Select
                            className="txtusersgroups"
                            options={Option}
                            isMulti
                            components={{
                              DropdownIndicator: () => null,
                              IndicatorSeparator: () => null,
                            }}
                            isClearable={false}
                            theme={this.Theme}
                            name="colors"
                            placeholder="Select Group"
                          />
                          {meta.touched && meta.error && (
                            <span className="error">{meta.error}</span>
                          )}
                        </div>
                      )}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <div className="zonedetails">
                    <Field
                      className="form-control"
                      name="auditorsusers"
                      render={({ input, meta }) => (
                        <div>
                          <label className="zonename">Auditor Users</label>
                          <Select
                            className="zoneadmin"
                            options={option}
                            isMulti
                            components={{
                              DropdownIndicator: () => null,
                              IndicatorSeparator: () => null,
                            }}
                            isClearable={false}
                            theme={this.Theme}
                            name="colors"
                            placeholder="Select User "
                          />
                          {meta.touched && meta.error && (
                            <span>{meta.error}</span>
                          )}
                        </div>
                      )}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <div className="zonedetails">
                    <Field
                      className="form-control"
                      name="auditorusergroups"
                      render={({ input, meta }) => (
                        <div>
                          <label className="lblaudusergroups">
                            Auditor Usergroups
                          </label>
                          <Select
                            className="txtaudusersgroups"
                            options={Option}
                            isMulti
                            styles={{
                              noOptionsMessage: (base) => ({
                                ...base,
                                ...msgStyles,
                              }),
                            }}
                            components={{
                              NoOptionsMessage,
                              DropdownIndicator: () => null,
                              IndicatorSeparator: () => null,
                            }}
                            isClearable={false}
                            theme={this.Theme}
                            name="colors"
                            placeholder="Select Group"
                          />
                          {meta.touched && meta.error && (
                            <span className="error">{meta.error}</span>
                          )}
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="form-horizontal">
                <header>Services:</header>
                <hr className="zoneheader" />
                <div className="form-group row">
                  <div className="zonedetails">
                    <Field
                      className="form-control"
                      name="zoneservices"
                      render={({ input, meta }) => (
                        <div>
                          <label className="lbltag">Select Tag Services</label>
                          <Select
                            className="zoneservices"
                            isMulti
                            components={{
                              DropdownIndicator: () => null,
                              IndicatorSeparator: () => null,
                            }}
                            isClearable={false}
                            theme={this.Theme}
                            name="colors"
                            placeholder="Select Tag Services"
                          />
                        </div>
                      )}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <div className="zonedetails">
                    <Field
                      className="form-control"
                      name="resourceservices"
                      render={({ input, meta }) => (
                        <div>
                          <label className="lblresource">
                            Select Resource Services*
                          </label>
                          <Select
                            options={Options}
                            className="zoneservices"
                            isMulti
                            components={{
                              DropdownIndicator: () => null,
                              IndicatorSeparator: () => null,
                            }}
                            isClearable={false}
                            theme={this.Theme}
                            name="colors"
                            placeholder="Select Service Name"
                          />
                          {meta.touched && meta.error && (
                            <span className="error">{meta.error}</span>
                          )}
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>
              <Services />
              <br />
              <div className="buttons">
                <Button
                  variant="primary"
                  className="savebtn"
                  type="submit"
                  disabled={submitting}
                >
                  Save
                </Button>
                <Button variant="secondary" className="cancelbtn">
                  Cancel
                </Button>
              </div>
            </form>
          )}
        />
      </div>
    );
  }
}

export default CreateZone;
