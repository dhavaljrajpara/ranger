import React, { useEffect, useReducer, useRef, useState } from "react";
import {
  OverlayTrigger,
  Popover,
  Button,
  Form,
  Row,
  Col
} from "react-bootstrap";
import { filter, findIndex } from "lodash";
import { isObject } from "Utils/XAUtils";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { CustomTooltip } from "../components/CommonComponents";

const TYPE_SELECT = "select";
const TYPE_CHECKBOX = "checkbox";
const TYPE_INPUT = "input";
const TYPE_RADIO = "radio";
const TYPE_CUSTOM = "custom";

const CheckboxComp = (props) => {
  const { options, value = [], valRef, showSelectAll, selectAllLabel } = props;
  const [selectedVal, setVal] = useState(value);

  const handleChange = (e, obj) => {
    let val = [...selectedVal];
    if (e.target.checked) {
      val.push(obj);
    } else {
      let index = findIndex(selectedVal, obj);
      val.splice(index, 1);
    }
    valRef.current = val;
    setVal(val);
  };

  const handleAllChekced = (e) => {
    let val = [];
    if (e.target.checked) {
      val = [...options];
    }
    valRef.current = val;
    setVal(val);
  };

  const isChecked = (obj) => {
    return findIndex(selectedVal, obj) !== -1;
  };

  const isAllChecked = () => {
    return selectedVal.length === options.length;
  };

  return (
    <>
      {options.map((obj) => (
        <Form.Group className="mb-3" controlId={obj.label} key={obj.label}>
          <Form.Check
            checked={isChecked(obj)}
            type="checkbox"
            label={obj.label}
            onChange={(e) => handleChange(e, obj)}
          />
        </Form.Group>
      ))}
      {showSelectAll && (
        <Form.Group className="mb-3">
          <Form.Check
            checked={isAllChecked()}
            type="checkbox"
            label={selectAllLabel}
            onChange={(e) => handleAllChekced(e)}
          />
        </Form.Group>
      )}
    </>
  );
};

const RadioBtnComp = (props) => {
  const { options, value, valRef } = props;
  const [selectedVal, setVal] = useState(value);

  const handleChange = (e, val) => {
    valRef.current = val;
    setVal(val);
  };

  return options.map((obj) => (
    <Form.Group className="mb-3" controlId={obj.label} key={obj.label}>
      <Form.Check
        type="radio"
        value={obj}
        label={obj.label}
        checked={
          isObject(selectedVal)
            ? selectedVal.value === obj.value
            : selectedVal === obj.value
        }
        onChange={(e) => handleChange(e, obj)}
      />
    </Form.Group>
  ));
};

const InputboxComp = (props) => {
  const { value = "", valRef } = props;
  const [selectedInputVal, setInputVal] = useState(value);
  const handleChange = (e) => {
    valRef.current = e.currentTarget.value;
    setInputVal(e.currentTarget.value);
  };
  return (
    <>
      <Form.Group className="mb-3" controlId="expression">
        <Form.Control
          type="text"
          placeholder="enter expression"
          onChange={(e) => handleChange(e)}
        />
      </Form.Group>
    </>
  );
};

const CreatableSelectNew = (props) => {
  const { value, valRef, conditionDefVal, selectProps } = props;
  const [selectedInputVal, setSelectVal] = useState(value);
  const handleChange = (e) => {
    valRef.current = e;
    setSelectVal(valRef.current);
  };

  return (
    <>
      <Form.Group className="mb-3" controlId="Ip-range">
        <b>{conditionDefVal.label}:</b>
        <CreatableSelect
          {...selectProps}
          defaultValue={valRef.current == "" ? null : valRef.current}
          onChange={(e) => handleChange(e)}
          placeholder="enter expression"
          width="500px"
        />
      </Form.Group>
    </>
  );
};

const CustomCondition = (props) => {
  const { value, valRef, conditionDefVal, selectProps } = props;
  const accessedOpt = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" }
  ];
  const [selectedCondVal, setCondSelect] = useState(
    value?.["accessed-after-expiry"] || value
  );
  const [selectedJSCondVal, setJSCondVal] = useState(
    value?.expression || value
  );
  const tagAccessData = (val, key) => {
    if (!isObject(valRef.current)) {
      valRef.current = {};
    }
    valRef.current[key] = val;
  };
  const selectHandleChange = (e, name) => {
    setCondSelect(e);
    tagAccessData(e?.value || null, name);
  };
  const textAreaHandleChange = (e, name) => {
    setJSCondVal(e.target.value);
    tagAccessData(e.target.value, name);
  };
  const accessedVal = (val) => {
    let value = null;
    if (val) {
      let opObj = accessedOpt.filter((m) => {
        if (m.value == val) {
          return m;
        }
      });
      if (opObj) {
        value = opObj;
      }
    }
    return value;
  };
  return (
    <>
      {conditionDefVal?.length > 0 &&
        conditionDefVal.map((m, index) => {
          if (m.name == "accessed-after-expiry") {
            return (
              <Form.Group className="mb-3">
                <b>{m.label}:</b>
                <Select
                  options={accessedOpt}
                  isClearable
                  onChange={(e) => selectHandleChange(e, m.name)}
                  value={
                    value
                      ? accessedVal(value?.["accessed-after-expiry"])
                      : accessedVal(valRef?.current?.["accessed-after-expiry"])
                  }
                />
              </Form.Group>
            );
          }
          if (m.name == "expression") {
            return (
              <>
                <Form.Group className="mb-3">
                  <Row>
                    <Col>
                      <b>{m.label}:</b>
                      <CustomTooltip
                        placement="right"
                        content={
                          "1. JavaScript Condition Examples :\
                      country_code == 'USA', time_range >= 900 time_range <= 1800 etc.\
                      2. Dragging bottom-right corner of javascript condition editor(Textarea) can resizable"
                        }
                        icon="fa-fw fa fa-info-circle"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={value?.expression || null}
                        onChange={(e) => textAreaHandleChange(e, m.name)}
                      />
                    </Col>
                  </Row>
                </Form.Group>
              </>
            );
          }
        })}
    </>
  );
};

const innitialState = (props) => {
  const { type, selectProps, value } = props;
  let val = value;
  if (!val) {
    if (type === TYPE_SELECT) {
      val = null;
      if (selectProps && selectProps.isMulti) {
        val = [];
      }
    }
  }
  return {
    value: val,
    target: null
  };
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_VALUE":
      return {
        ...state,
        value: action.value,
        show: action.show,
        target: action.target
      };
    case "SET_POPOVER":
      return {
        ...state,
        show: action.show,
        target: action.target
      };
    default:
      throw new Error();
  }
}

const Editable = (props) => {
  const {
    type,
    value: editableValue,
    placement = "bottom",
    className,
    displayFormat,
    onChange,
    options = [],
    conditionDefVal
  } = props;

  const initialLoad = useRef(true);
  const popoverRef = useRef(null);
  const selectValRef = useRef(null);
  const [state, dispatch] = useReducer(reducer, props, innitialState);
  const { show, value, target } = state;

  const displayValue = () => {
    let val = "--";
    const selectVal = value;
    if (displayFormat) {
      val = displayFormat(selectVal);
    } else {
      if (type === TYPE_SELECT) {
        if (selectVal?.length > 0) {
          let ipRangVal = selectVal.map(function (m) {
            return m.value;
          });
          val = (
            <h6 className="d-inline mr-1">
              {" "}
              <span className="badge bg-info">
                {conditionDefVal.label} : {ipRangVal.join(", ")}
              </span>
            </h6>
          );
        } else {
          val = "--";
        }
      } else if (type === TYPE_CHECKBOX) {
        val =
          selectVal && selectVal.length > 0
            ? selectVal.map((op, index) => (
                <h6 key={index}>
                  <span className="badge bg-info">{op.label}</span>
                </h6>
              ))
            : "--";
      } else if (type === TYPE_INPUT) {
        val =
          (
            <h6>
              <span className="badge bg-info">{selectVal}</span>{" "}
            </h6>
          ) || "--";
      } else if (type === TYPE_RADIO) {
        val =
          selectVal && selectVal.label ? (
            <h6>
              <span className="badge bg-info">{selectVal.label}</span>
            </h6>
          ) : (
            <h6>
              <span className="badge bg-info">{selectVal}</span>
            </h6>
          );
      } else if (type === TYPE_CUSTOM) {
        if (selectVal?.["accessed-after-expiry"] || selectVal?.expression) {
          val = `Accessed after expiry_date (yes/no) : ${
            selectVal?.["accessed-after-expiry"] || null
          } / Boolean expression : ${selectVal?.expression || null}`;
        } else {
          val = "--";
        }
      } else {
        val = selectVal || "--";
      }
    }
    return val;
  };

  useEffect(() => {
    if (!initialLoad.current) {
      onChange(editableValue);
      dispatch({
        type: "SET_VALUE",
        value: editableValue,
        show: false,
        target: null
      });
    } else {
      initialLoad.current = false;
    }
    selectValRef.current = editableValue;
  }, [editableValue]);

  const handleApply = () => {
    dispatch({
      type: "SET_VALUE",
      value: selectValRef.current,
      show: !show,
      target: null
    });
    onChange(selectValRef.current);
  };

  const handleClose = () => {
    dispatch({
      type: "SET_POPOVER",
      show: !show,
      target: null
    });
  };

  const popoverComp = (
    <div>
      <Popover id="popover-basic" className="editable-popover">
        <Popover.Title>
          {type === TYPE_CHECKBOX ? "Select" : "Enter"}
        </Popover.Title>
        <Popover.Content>
          {type === TYPE_CHECKBOX ? (
            <CheckboxComp
              value={value}
              options={options}
              valRef={selectValRef}
              showSelectAll={props.showSelectAll}
              selectAllLabel={props.selectAllLabel}
            />
          ) : type === TYPE_RADIO ? (
            <RadioBtnComp
              value={value}
              options={options}
              valRef={selectValRef}
            />
          ) : type === TYPE_INPUT ? (
            <InputboxComp value={value} valRef={selectValRef} />
          ) : type === TYPE_SELECT ? (
            <CreatableSelectNew
              value={value}
              valRef={selectValRef}
              conditionDefVal={props.conditionDefVal}
              selectProps={props.selectProps}
            />
          ) : type === TYPE_CUSTOM ? (
            <CustomCondition
              value={value}
              valRef={selectValRef}
              conditionDefVal={props.conditionDefVal}
              selectProps={props.selectProps}
            />
          ) : null}
          <hr />
          <div>
            <Button
              variant="success"
              size="sm"
              onClick={handleApply}
              className="mr-2"
            >
              <i className="fa fa-fw fa-check"></i>
            </Button>
            <Button variant="danger" size="sm" onClick={handleClose}>
              <i className="fa fa-fw fa-close"></i>
            </Button>
          </div>
        </Popover.Content>
      </Popover>
    </div>
  );

  const handleClick = (e) => {
    let display = !show;
    dispatch({
      type: "SET_POPOVER",
      show: display,
      target: e.target
    });
  };

  return (
    <div ref={popoverRef}>
      <OverlayTrigger
        show={show}
        target={target}
        trigger="click"
        placement={placement}
        overlay={popoverComp}
        container={popoverRef.current}
      >
        <div className={`editable ${className || ""}`} onClick={handleClick}>
          {displayValue()}
        </div>
      </OverlayTrigger>
    </div>
  );
};

export default Editable;
