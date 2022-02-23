import React, { useEffect, useReducer, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Form, Field } from "react-final-form";
import { FieldError } from "Components/CommonComponents";
import { Button } from "react-bootstrap";
import ResourceComp from "./ResourceComp";

export default function ModalResourceComp(props) {
  const {
    serviceDetails,
    serviceCompDetails,
    formValues,
    modelState,
    handleClose
  } = props;

  const saveResourceVal = () => {
    input.onChange({});
  };

  return (
    <div>
      <Modal
        show={modelState.showModalResource}
        onHide={handleClose}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title>Resource Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="wrap">
            <ResourceComp
              serviceDetails={serviceDetails}
              serviceCompDetails={serviceCompDetails}
              formValues={formValues}
              policyType={0}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>{" "}
          &nbsp;&nbsp;
          <Button type="submit" title="Save" onClick={saveResourceVal}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
