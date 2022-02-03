import React, { useEffect, useReducer } from "react";
import { Table, Button } from "react-bootstrap";
import { FieldArray } from "react-final-form-arrays";
import { Form as FormB, Row, Col } from "react-bootstrap";
import { Field } from "react-final-form";
import Select from "react-select";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import AsyncCreatableSelect from "react-select/async-creatable";
import { groupBy } from "lodash";

import { fetchApi } from "Utils/fetchAPI";

export default function PolicyPermissionItem(props) {
  const { addPolicyItem, attrName } = props;
  const permList = [
    "Select Roles",
    "Select Groups",
    "Select Users",
    "Permissions",
    "DeligateAdmin"
  ];
  const tableHeader = () => {
    return permList.map((data) => {
      return <th>{data}</th>;
    });
  };
  return (
    <div>
      <Col sm="12">
        <Table striped bordered>
          <thead>
            <tr>{tableHeader()}</tr>
          </thead>
          <tbody>
            <FieldArray name={attrName}>
              {({ fields }) =>
                fields.map((name, index) => (
                  <tr key={name}>
                    {permList.map((colName) => {
                      return <td>{colName}</td>;
                    })}
                    {/* <Field
                      name={`${name}.firstName`}
                      component="input"
                      placeholder="First Name"
                    /> */}
                    <span
                      onClick={() => fields.remove(index)}
                      style={{ cursor: "pointer" }}
                    >
                      ❌
                    </span>
                  </tr>
                ))
              }
            </FieldArray>
          </tbody>
        </Table>
      </Col>
      <Button type="button" onClick={() => addPolicyItem(attrName, undefined)}>
        +
      </Button>
    </div>
  );
}
