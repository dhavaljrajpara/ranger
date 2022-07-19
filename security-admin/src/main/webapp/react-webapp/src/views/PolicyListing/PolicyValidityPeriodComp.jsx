import React, { useState } from "react";
import { Button, Modal, Table, InputGroup, FormControl } from "react-bootstrap";
import { FieldArray } from "react-final-form-arrays";
import { Field } from "react-final-form";
import Select from "react-select";
import Datetime from "react-datetime";
import moment from "moment-timezone";

import { getAllTimeZoneList } from "Utils/XAUtils";

export default function PolicyValidityPeriodComp(props) {
  const { addPolicyItem } = props;
  const [showModal, setModal] = useState(false);
  const toggleModal = () => setModal((open) => !open);

  const handleBtnClick = () => {
    setModal(true);
  };

  const RenderInput = (props, openCalendar, closeCalendar) => {
    function clear() {
      props.dateProps.onChange({ target: { value: "" } });
    }
    return (
      <>
        <InputGroup className="mb-2">
          <FormControl {...props.dateProps} readOnly />
          <InputGroup.Prepend>
            <InputGroup.Text onClick={clear}> X </InputGroup.Text>
          </InputGroup.Prepend>
        </InputGroup>
      </>
    );
  };

  const validationForTimePeriod = () => {
    console.log(this);
    setModal(false);
  };

  const calEndDate = (sDate, currentDate) => {
    if (sDate && sDate.endTime) {
      return currentDate.isBefore(sDate.endTime);
    } else {
      return !sDate;
    }
  };

  const calStartDate = (sDate, currentDate) => {
    if (sDate && sDate.startTime) {
      return currentDate.isAfter(sDate.startTime);
    } else {
      return !sDate;
    }
  };

  return (
    <>
      <Button
        onClick={handleBtnClick}
        variant="primary"
        size="sm"
        className="pull-right btn-sm"
      >
        <i className="fa fa-clock-o"></i> Add Validity Period
      </Button>
      <Modal show={showModal} size="lg" onHide={toggleModal} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Policy Validity Period</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table bordered>
            <thead>
              <tr>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Time Zone</th>
              </tr>
            </thead>
            <tbody>
              <FieldArray name="validitySchedules">
                {({ fields, ...arg }) =>
                  fields.map((name, index) => (
                    <tr key={name}>
                      <td className="text-center">
                        <Field
                          className="form-control"
                          name={`${name}.startTime`}
                          placeholder="&#xF007; Username"
                          render={({ input, meta }) => (
                            <div>
                              <Datetime
                                {...input}
                                renderInput={(props) => (
                                  <RenderInput dateProps={props} />
                                )}
                                dateFormat="DD-MM-YYYY"
                                timeFormat="HH:mm:ss"
                                closeOnSelect
                                isValidDate={(currentDate, selectedDate) =>
                                  calEndDate(fields.value[index], currentDate)
                                }
                              />
                              {meta.touched && meta.error && (
                                <span>{meta.error}</span>
                              )}
                            </div>
                          )}
                        />
                      </td>
                      <td className="text-center">
                        <Field
                          className="form-control"
                          name={`${name}.endTime`}
                          render={({ input, meta }) => (
                            <div>
                              <Datetime
                                {...input}
                                renderInput={(props) => (
                                  <RenderInput dateProps={props} />
                                )}
                                dateFormat="DD-MM-YYYY"
                                timeFormat="HH:mm:ss"
                                closeOnSelect
                                isValidDate={(currentDate, selectedDate) =>
                                  calStartDate(fields.value[index], currentDate)
                                }
                              />
                              {meta.touched && meta.error && (
                                <span>{meta.error}</span>
                              )}
                            </div>
                          )}
                        />
                      </td>
                      <td className="text-center">
                        <Field
                          className="form-control"
                          name={`${name}.timeZone`}
                          render={({ input, meta }) => (
                            <div>
                              <Select
                                {...input}
                                options={getAllTimeZoneList()}
                                getOptionLabel={(obj) => obj.text}
                                getOptionValue={(obj) => obj.id}
                                isClearable={true}
                              />
                              {meta.touched && meta.error && (
                                <span>{meta.error}</span>
                              )}
                            </div>
                          )}
                        />
                      </td>
                      <td className="text-center">
                        <Button
                          variant="danger"
                          size="sm"
                          className="btn-mini"
                          title="Remove"
                          onClick={() => fields.remove(index)}
                        >
                          <i className="fa-fw fa fa-remove"></i>
                        </Button>
                      </td>
                    </tr>
                  ))
                }
              </FieldArray>
            </tbody>
          </Table>
          <Button
            type="button"
            className="btn-mini"
            onClick={() => addPolicyItem("validitySchedules", undefined)}
          >
            <i className="fa-fw fa fa-plus"></i>
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" size="sm" onClick={validationForTimePeriod}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
