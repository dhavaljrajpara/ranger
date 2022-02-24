import React, { Component } from "react";
import { Button, Table } from "react-bootstrap";
import { Form, Field } from "react-final-form";
import { toast } from "react-toastify";
import { FieldArray } from "react-final-form-arrays";
import arrayMutators from "final-form-arrays";
import { fetchApi } from "Utils/fetchAPI";

class KeyCreate extends Component {
  // constructor() {
  //   super();
  //   this.state = {};
  // }

  onSubmit = async (values) => {
    const serviceJson = {};
    serviceJson.name = values.name;
    serviceJson.cipher = values.cipher;
    serviceJson.length = values.length;
    serviceJson.description = values.description;
    serviceJson.attributes = {};
    for (var key of Object.keys(values.attributes)) {
      serviceJson.attributes[values.attributes[key].name] =
        values.attributes[key].value;
    }

    try {
      await fetchApi({
        url: "keys/key",
        method: "post",
        data: serviceJson,
      });
      toast.success(`Success! Key created succesfully`);
      this.props.history.push("/kms/keys/new/manage/service");
    } catch (error) {
      console.error(`Error occurred while creating Key`);
    }
  };
  validateRequired = (isRequired) =>
    isRequired ? (value) => (value ? undefined : "Required") : () => {};

  render() {
    return (
      <div>
        <h4 className="wrap-header bold">Key Detail</h4>
        <Form
          onSubmit={this.onSubmit}
          mutators={{
            ...arrayMutators,
          }}
          render={({
            handleSubmit,
            form,
            submitting,
            pristine,
            form: {
              mutators: { push },
            },
          }) => (
            <div className="wrap">
              <form onSubmit={handleSubmit}>
                <Field name="name" validate={this.validateRequired(true)}>
                  {({ input, meta }) => (
                    <div className="form-group row">
                      <label className="col-sm-3 col-form-label text-right">
                        Key Name *
                      </label>
                      <div className="col-sm-4">
                        <input
                          {...input}
                          type="text"
                          className="form-control"
                        />
                        {meta.error && meta.touched && (
                          <span className="invalid-field">{meta.error}</span>
                        )}
                      </div>
                    </div>
                  )}
                </Field>

                <Field name="cipher">
                  {({ input }) => (
                    <div className="form-group row">
                      <label className="col-sm-3 col-form-label text-right">
                        Cipher
                      </label>
                      <div className="col-sm-4">
                        <input
                          {...input}
                          type="text"
                          className="form-control"
                        />
                      </div>
                    </div>
                  )}
                </Field>
                <Field name="length">
                  {({ input }) => (
                    <div className="form-group row">
                      <label className="col-sm-3 col-form-label text-right">
                        Length
                      </label>
                      <div className="col-sm-4">
                        <input
                          {...input}
                          type="number"
                          className="form-control"
                        />
                      </div>
                    </div>
                  )}
                </Field>
                <Field name="description">
                  {({ input }) => (
                    <div className="form-group row">
                      <label className="col-sm-3 col-form-label text-right">
                        Description
                      </label>
                      <div className="col-sm-4">
                        <textarea {...input} className="form-control" />
                      </div>
                    </div>
                  )}
                </Field>

                <div className="form-group row">
                  <label className="col-sm-3 col-form-label text-right">
                    Attributes
                  </label>
                  <div className="col-sm-6">
                    <Table bordered size="sm" className="no-bg-color w-75">
                      <thead>
                        <tr>
                          <th className="text-center">Name</th>
                          <th className="text-center" colSpan="2">
                            Value
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <FieldArray name="attributes">
                          {({ fields }) =>
                            fields.map((name, index) => (
                              <tr key={name}>
                                <td className="text-center">
                                  <Field
                                    name={`${name}.name`}
                                    component="input"
                                    className="form-control"
                                  />
                                </td>
                                <td className="text-center">
                                  <Field
                                    name={`${name}.value`}
                                    component="input"
                                    className="form-control"
                                  />
                                </td>
                                <td className="text-center">
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    title="Yes"
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
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-3 col-form-label text-right"></label>
                  <div className="col-sm-6">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => push("attributes", undefined)}
                    >
                      <i className="fa-fw fa fa-plus"></i>
                    </Button>
                  </div>
                </div>
                <div className="row form-actions">
                  <div className="col-md-9 offset-md-3">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={submitting}
                    >
                      Save
                    </Button>
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={form.reset}
                      disabled={submitting || pristine}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          )}
        />
      </div>
    );
  }
}

export default KeyCreate;
