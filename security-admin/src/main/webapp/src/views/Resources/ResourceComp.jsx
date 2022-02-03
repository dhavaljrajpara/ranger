import React, { useEffect, useReducer } from "react";
import { Form as FormB, Row, Col } from "react-bootstrap";
import { Field } from "react-final-form";
import Select from "react-select";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import AsyncCreatableSelect from "react-select/async-creatable";
import { groupBy } from "lodash";

import { fetchApi } from "Utils/fetchAPI";

export default function ResourceComp(props) {
  const {
    serviceCompDetails: { resources = [] },
    formValues,
    serviceDetails
  } = props;

  const grpResources = groupBy(resources, "level");
  const grpResourcesKeys = Object.keys(grpResources);

  const fetchResourceLookup = async (
    inputValue,
    resourceObj,
    selectedValues
  ) => {
    let resourceName = resourceObj.name;
    let data = {
      resourceName,
      resources: {
        [resourceName]: selectedValues?.map(({ value }) => value) || []
      }
    };
    if (inputValue) {
      data["userInput"] = inputValue || "";
    }
    const resourceResp = await fetchApi({
      url: `plugins/services/lookupResource/${serviceDetails.name}`,
      method: "POST",
      data
    });

    return resourceResp.data.map((name) => ({
      label: name,
      value: name
    }));
  };

  return grpResourcesKeys.map((levelKey) => (
    <FormB.Group
      as={Row}
      className="mb-3"
      controlId="policyName"
      key={`Resource-${levelKey}`}
    >
      <Col sm={2}>
        <Field
          defaultValue={grpResources[levelKey][0]}
          className="form-control"
          name={`resourceName-${levelKey}`}
          render={({ input }) =>
            grpResources[levelKey].length === 1 ? (
              <FormB.Label>{grpResources[levelKey][0]["label"]}</FormB.Label>
            ) : (
              <Select
                options={grpResources[levelKey]}
                getOptionLabel={(obj) => obj.label}
                getOptionValue={(obj) => obj.name}
                {...input}
              />
            )
          }
        />
      </Col>
      {formValues[`resourceName-${levelKey}`] && (
        <Col sm={4}>
          <Field
            className="form-control"
            name={`value-${levelKey}`}
            render={({ input }) => (
              <AsyncCreatableSelect
                {...input}
                defaultOptions
                isMulti
                loadOptions={(inputValue) =>
                  fetchResourceLookup(
                    inputValue,
                    formValues[`resourceName-${levelKey}`],
                    input.value
                  )
                }
              />
            )}
          />
        </Col>
      )}
      {formValues[`resourceName-${levelKey}`] && (
        <Col sm={4}>
          <Row>
            {formValues[`resourceName-${levelKey}`]["excludesSupported"] && (
              <Col sm={4}>
                <Field
                  className="form-control"
                  name={`isExcludesSupport-${levelKey}`}
                  render={({ input }) => (
                    <BootstrapSwitchButton
                      onlabel="Include"
                      onstyle="primary"
                      offlabel="Exclude"
                      offstyle="outline-secondary"
                      style="w-100"
                      size="xs"
                      {...input}
                    />
                  )}
                />
              </Col>
            )}
            {formValues[`resourceName-${levelKey}`]["recursiveSupported"] && (
              <Col sm={5}>
                <Field
                  className="form-control"
                  name={`isRecursiveSupport-${levelKey}`}
                  render={({ input }) => (
                    <BootstrapSwitchButton
                      onlabel="Recursive"
                      onstyle="primary"
                      offlabel="Non-recursive"
                      offstyle="outline-secondary"
                      style="w-100"
                      size="xs"
                      {...input}
                    />
                  )}
                />
              </Col>
            )}
          </Row>
        </Col>
      )}
    </FormB.Group>
  ));
}
