import React, { useEffect, useReducer, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Form, Field } from "react-final-form";
import { FieldError } from "Components/CommonComponents";
import { Button } from "react-bootstrap";
import ResourceComp from "./ResourceComp";

export default function ModalResourceComp(props) {
  const {
    showModalResource,
    serviceDetails,
    serviceCompDetails,
    actionButtonText
  } = props;
  const handleClose = () => ({
    showModalResource: false
  });
  const handleSubmit = async (formData) => {
    console.log(formData);
  };
  return (
    <div>
      <Modal
        show={showModalResource}
        onHide={handleClose}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Resource Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={handleSubmit}
            render={({ handleSubmit, form, submitting, values, pristine }) => (
              <div className="wrap">
                <form onSubmit={handleSubmit}>
                  <ResourceComp
                    serviceDetails={serviceDetails}
                    serviceCompDetails={serviceCompDetails}
                    formValues={values}
                    policyType={0}
                  />
                </form>
              </div>
            )}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>{" "}
          &nbsp;&nbsp;
          <input
            className="btn btn-primary modal-btn"
            type="submit"
            value={actionButtonText}
          />
        </Modal.Footer>
      </Modal>
    </div>
  );
}
