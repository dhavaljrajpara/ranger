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
    modelState,
    handleClose,
    handleSave,
  } = props;

  const saveResourceVal = (values) => {
    modelState.data = values;
    handleSave();
  };

  if (!modelState.data) {
    return null;
  }

  return (
    <>
      <Modal
        show={modelState.showModalResource}
        onHide={handleClose}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Form
          onSubmit={saveResourceVal}
          initialValues={modelState.data}
          render={({ handleSubmit, form, submitting, pristine, values }) => (
            <form onSubmit={handleSubmit}>
              <Modal.Header>
                <Modal.Title>Resource Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Field name="resources">
                  {(input) => (
                    <div className="wrap">
                      <ResourceComp
                        {...input}
                        serviceDetails={serviceDetails}
                        serviceCompDetails={serviceCompDetails}
                        formValues={values}
                        policyType={0}
                      />
                    </div>
                  )}
                </Field>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  disabled={submitting || pristine}
                  onClick={handleClose}
                >
                  Close
                </Button>

                <Button title="Save" type="submit">
                  Save
                </Button>
              </Modal.Footer>
            </form>
          )}
        />
      </Modal>
    </>
  );
}
