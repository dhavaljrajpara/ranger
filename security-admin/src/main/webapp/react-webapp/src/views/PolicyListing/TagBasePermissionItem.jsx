import React, { useState } from "react";
import { Col, Form as FormB, Row, Modal, Button, Table } from "react-bootstrap";
import { Form, Field } from "react-final-form";
import Select from "react-select";
import arrayMutators from "final-form-arrays";
import { FieldArray } from "react-final-form-arrays";
import { groupBy, keys, indexOf, findIndex, uniq, omit } from "lodash";

export default function TagBasePermissionItem(props) {
  const { options, inputVal, showModal, handleCloseModal } = props;
  const [showTagPermissionItem, tagPermissionItem] = useState(false);

  const tagServicePerms = groupBy(options, function (obj) {
    let val = obj.value;
    return val.substr(0, val.indexOf(":"));
  });

  const handleSubmit = (values) => {
    let tagPermissionType = values;
    delete tagPermissionType.servicesDefType;
    if (values?.tableList) {
      tagPermissionType.tableList = values.tableList.filter((m) => {
        if (m.permission) {
          return m;
        }
      });
    }
    inputVal.onChange(tagPermissionType);
    handleClose();
  };

  const handleClose = () => {
    tagPermissionItem(false);
  };

  const serviceOnChange = (e, input, values, push, remove) => {
    if (e.action == "select-option") {
      push("tableList", {
        serviceName: e.option.value
      });
    } else {
      let removeItemIndex = findIndex(input.value, [
        "value",
        e.removedValue.value
      ]);
      remove("tableList", removeItemIndex);
    }
    input.onChange(values);
  };

  const selectOptions = () => {
    return keys(tagServicePerms).map((m) => ({
      value: m,
      label: m.toUpperCase()
    }));
  };

  const isChecked = (obj, input) => {
    let selectedVal = input.value || [];
    return indexOf(selectedVal, obj) !== -1;
  };

  const isAllChecked = (fieldObj, objVal) => {
    return (
      !!fieldObj.permission &&
      fieldObj.permission.length > 0 &&
      fieldObj.permission.length === objVal.length
    );
  };

  const handleChange = (e, value, input) => {
    let val = input.value || [];
    if (e.target.checked) {
      val.push(value);
    } else {
      let index = indexOf(val, value);
      val.splice(index, 1);
    }
    input.onChange([...val]);
  };

  const handleSelectAllChange = (e, index, fields) => {
    let fieldVal = { ...fields.value[index] };
    let val = [];
    if (e.target.checked) {
      val = tagServicePerms[fieldVal.serviceName].map(({ value }) => value);
    }
    fieldVal.permission = val;
    fields.update(index, fieldVal);
  };

  const formInitialData = () => {
    let formData = {};
    if (inputVal?.value?.tableList?.length > 0) {
      formData.servicesDefType = inputVal.value.tableList.map((m) => {
        return {
          label: m.serviceName.toUpperCase(),
          value: m.serviceName
        };
      });
      formData.tableList = inputVal.value.tableList;
    }

    return formData;
  };

  const tagAccessTypeDisplayVal = (val) => {
    return val.map((m, index) => {
      return (
        <>
          <h6 className="d-inline mr-1" key={index}>
            <Badge variant="info">{m.serviceName.toUpperCase()}</Badge>
          </h6>
        </>
      );
    });
  };

  return (
    <>
      {inputVal?.value?.tableList?.length > 0 ? (
        <Button
          className="mg-10"
          size="sm"
          variant="outline-dark"
          onClick={(e) => {
            e.stopPropagation();
            tagPermissionItem(true);
          }}
        >
          <i className="fa-fw fa fa-pencil"></i>
        </Button>
      ) : (
        <div className="text-center">
          <span className="editable-add-text">Add Permissions</span>
          <div>
            <Button
              size="sm"
              className="mg-10"
              variant="outline-dark"
              onClick={(e) => {
                e.stopPropagation();
                tagPermissionItem(true);
              }}
            >
              <i className="fa-fw fa fa-plus"></i>
            </Button>
          </div>
        </div>
      )}

      <Modal
        show={showTagPermissionItem}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Form
          onSubmit={handleSubmit}
          initialValues={formInitialData()}
          mutators={{
            ...arrayMutators
          }}
          render={({
            handleSubmit,
            form: {
              mutators: { push, remove }
            },
            submitting,
            pristine,
            values
          }) => (
            <form onSubmit={handleSubmit}>
              <Modal.Header closeButton>
                <Modal.Title>Components Permissions</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Field
                  name="servicesDefType"
                  render={({ input, meta }) => (
                    <FormB.Group className="mb-3">
                      <b>Select Component:</b>
                      <Select
                        {...input}
                        onChange={(values, e) =>
                          serviceOnChange(e, input, values, push, remove)
                        }
                        isMulti
                        components={{
                          DropdownIndicator: () => null,
                          IndicatorSeparator: () => null
                        }}
                        options={selectOptions()}
                        isClearable={false}
                        isSearchable={true}
                        placeholder="Select Service Name"
                      />
                    </FormB.Group>
                  )}
                />
                <Table striped bordered>
                  <thead>
                    <tr>
                      <th className="bg-white text-dark  align-middle text-center">
                        Component
                      </th>
                      <th className="bg-white text-dark align-middle text-center">
                        Permission
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <FieldArray name="tableList">
                      {({ fields, value }) =>
                        fields.map((name, index) => (
                          <tr className="bg-white" key={index}>
                            <td className="align-middle">
                              <h6>
                                <FormB.Group className="d-inline">
                                  <FormB.Check
                                    inline
                                    key={fields.value[
                                      index
                                    ].serviceName.toUpperCase()}
                                    checked={isAllChecked(
                                      fields.value[index],
                                      tagServicePerms[
                                        fields.value[index].serviceName
                                      ]
                                    )}
                                    type="checkbox"
                                    label={fields.value[
                                      index
                                    ].serviceName.toUpperCase()}
                                    onChange={(e) =>
                                      handleSelectAllChange(e, index, fields)
                                    }
                                  />
                                </FormB.Group>
                              </h6>
                            </td>
                            <td className="align-middle">
                              <Field
                                className="form-control"
                                name={`${name}.permission`}
                                render={({ input, meta }) => (
                                  <div>
                                    {tagServicePerms[
                                      fields.value[index].serviceName
                                    ].map((obj, index) => (
                                      <h6 className="d-inline" key={index}>
                                        <FormB.Group
                                          className="d-inline"
                                          controlId={obj.label}
                                          key={obj.label}
                                        >
                                          <FormB.Check
                                            inline
                                            checked={isChecked(
                                              obj.value,
                                              input
                                            )}
                                            type="checkbox"
                                            label={obj.label}
                                            onChange={(e) =>
                                              handleChange(e, obj.value, input)
                                            }
                                          />
                                        </FormB.Group>
                                      </h6>
                                    ))}
                                  </div>
                                )}
                              />
                            </td>
                          </tr>
                        ))
                      }
                    </FieldArray>
                  </tbody>
                </Table>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  className="btn-mini"
                  onClick={handleClose}
                >
                  Close
                </Button>

                <Button title="Save" className="btn-mini" type="submit">
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
