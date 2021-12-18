import React, { useEffect, useReducer } from "react";
import { useParams } from "react-router";
import { Form as FormB, Row, Col, Button, Badge } from "react-bootstrap";
import { Form, Field } from "react-final-form";
import AsyncCreatableSelect from "react-select/async-creatable";
import BootstrapSwitchButton from "bootstrap-switch-button-react";

import { fetchApi } from "Utils/fetchAPI";
import { RangerPolicyType, getEnumElementByValue } from "Utils/XAEnums";
import ResourceComp from "../Resources/ResourceComp";

const initialState = {
  loader: true,
  serviceDetails: null,
  serviceCompDetails: null,
  policyData: null,
  formData: null
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

export default function AddUpdatePolicyForm() {
  let { serviceId, policyType, policyId } = useParams();
  const [policyState, dispatch] = useReducer(reducer, initialState);
  const { loader, serviceDetails, serviceCompDetails, policyData, formData } =
    policyState;

  useEffect(() => {
    fetchInitalData();
  }, []);

  const fetchInitalData = async () => {
    let serviceData = await fetchServiceDetails();
    let serviceCompData = await fetchRangerServiceDefComp(serviceData);
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
    return data;
  };

  const handleSubmit = (values) => {
    console.log(values);
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
              initialValues={formData}
              render={({ handleSubmit, submitting, values }) => (
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
