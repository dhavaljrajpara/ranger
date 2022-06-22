import React, { useReducer, useCallback, useEffect, useState } from "react";
import { Loader } from "Components/CommonComponents";
import { useHistory, useParams } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import XATableLayout from "Components/XATableLayout";
import { Row, Col, Button, Modal, Breadcrumb } from "react-bootstrap";
import { fetchApi } from "Utils/fetchAPI";
import dateFormat from "dateformat";
import moment from "moment-timezone";
import { commonBreadcrumb } from "../../utils/XAUtils";

function init(props) {
  return {
    loader: true,
    servicesData: [],
    services: [],
    selcServicesData: [],
    keydata: [],
    onchangeval:
      props.kmsManagePage == "new"
        ? null
        : { value: props.kmsServiceName, label: props.kmsServiceName },
    deleteshowmodal: false,
    editshowmodal: false,
    filterdata: null,
    pagecount: 0,
    kmsservice: {},
    updatetable: moment.now()
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_DATA":
      return {
        ...state,
        loader: false,
        services: action.servicesdata,
        servicesData: action.services
      };
    case "SET_SEL_SERVICE":
      return {
        ...state,
        loader: false,
        selcServicesData: action.selcservicesData,
        keydata: action.keydatalist,
        pagecount: action.pagecount
      };
    case "SET_ONCHANGE_SERVICE":
      return {
        ...state,
        loader: action.loader,
        onchangeval: action.onchangeval
      };
    case "SET_DELETE_MODAL":
      return {
        ...state,
        loader: false,
        deleteshowmodal: action.deleteshowmodal,
        filterdata: action.filterdata
      };
    case "SET_DELETE_MODAL_CLOSE":
      return {
        ...state,
        loader: false,
        deleteshowmodal: action.deleteshowmodal
      };
    case "SET_EDIT_MODAL":
      return {
        ...state,
        loader: false,
        editshowmodal: action.editshowmodal,
        filterdata: action.filterdata
      };
    case "SET_EDIT_MODAL_CLOSE":
      return {
        ...state,
        loader: false,
        editshowmodal: action.editshowmodal
      };
    case "SET_UPDATE_TABLE":
      return {
        ...state,
        loader: false,
        updatetable: action.updatetable
      };

    default:
      throw new Error();
  }
}

const KeyManager = (props) => {
  const history = useHistory();

  const [keyState, dispatch] = useReducer(reducer, props.match.params, init);

  const {
    loader,
    servicesData,
    keydata,
    filterdata,
    onchangeval,
    deleteshowmodal,
    editshowmodal,
    pagecount,
    services,

    updatetable
  } = keyState;

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    let servicesdata = null;
    try {
      const servicesResp = await fetchApi({
        url: "plugins/services?name=&serviceType=kms"
      });
      servicesdata = servicesResp.data.services;
    } catch (error) {
      console.error(`Error occurred while fetching Services! ${error}`);
    }

    dispatch({
      type: "SET_DATA",
      servicesdata: servicesdata,
      services: servicesdata.map((obj) => ({
        value: obj.name,
        label: obj.name
      }))
    });
  };

  const selconChange = (e) => {
    dispatch({
      type: "SET_ONCHANGE_SERVICE",
      onchangeval: e,
      loader: false
    });
  };

  const handleConfirmClick = () => {
    handleDeleteClick();

    dispatch({
      type: "SET_DELETE_MODAL",
      deleteshowmodal: false
    });
  };

  const deleteModal = (name) => {
    dispatch({
      type: "SET_DELETE_MODAL",
      deleteshowmodal: true,
      filterdata: name
    });
  };
  const editModal = (name) => {
    dispatch({
      type: "SET_EDIT_MODAL",
      editshowmodal: true,
      filterdata: name
    });
  };
  const closeEditModal = () => {
    dispatch({
      type: "SET_EDIT_MODAL_CLOSE",
      editshowmodal: false
    });
  };
  const EditConfirmClick = () => {
    handleEditClick();
    dispatch({
      type: "SET_EDIT_MODAL_CLOSE",
      editshowmodal: false
    });
  };

  const handleEditClick = useCallback(async () => {
    let keyEdit = {};
    keyEdit.name = filterdata ? filterdata : "";
    try {
      await fetchApi({
        url: `/keys/key`,
        method: "PUT",
        params: { provider: onchangeval ? onchangeval.label : "" },
        data: keyEdit
      });
      toast.success(`Success! Key rollover successfully`);
      dispatch({
        type: "SET_UPDATE_TABLE",
        updatetable: moment.now()
      });
    } catch (error) {
      let errorMsg = "";
      if (error.response.data.msgDesc) {
        errorMsg += toast.error(error.response.data.msgDesc + "\n");
      } else {
        errorMsg += `Error occurred during editing Key` + "\n";
      }
    }
  }, [filterdata]);

  const handleDeleteClick = useCallback(async () => {
    try {
      await fetchApi({
        url: `/keys/key/${filterdata}`,
        method: "DELETE",
        params: { provider: onchangeval ? onchangeval.label : "" }
      });

      toast.success(`Success! Key deleted succesfully`);
      dispatch({
        type: "SET_UPDATE_TABLE",
        updatetable: moment.now()
      });
    } catch (error) {
      let errorMsg = "";
      if (error.response.data.msgDesc) {
        errorMsg += toast.error(error.response.data.msgDesc + "\n");
      } else {
        errorMsg += `Error occurred during deleting Key` + "\n";
      }
    }
  }, [updatetable]);
  const closeModal = () => {
    dispatch({
      type: "SET_DELETE_MODAL_CLOSE",
      deleteshowmodal: false
    });
  };
  const selectServices = useCallback(
    async ({ pageSize, pageIndex }) => {
      let selcservicesdata = null;
      let totalCount = 0;
      try {
        const selservicesResp = await fetchApi({
          url: "/keys/keys",
          params: {
            page: 0,
            pageSize: pageSize,
            total_pages: 1,
            totalCount: Math.ceil(totalCount / pageSize),
            startIndex: pageIndex * pageSize,
            provider: onchangeval && onchangeval.label
          }
        });
        selcservicesdata = selservicesResp.data.vXKeys;
        totalCount = selservicesResp.data.totalCount;
      } catch (error) {
        console.error(`Error occurred while fetching Services! ${error}`);
      }

      dispatch({
        type: "SET_SEL_SERVICE",
        keydatalist: selcservicesdata,
        pagecount: Math.ceil(totalCount / pageSize),
        loader: false
      });
    },
    [onchangeval, updatetable]
  );

  const addKey = () => {
    history.push({
      pathname:
        props.match.params.kmsManagePage == "edit"
          ? `/kms/keys/${props.match.params.kmsServiceName}/create`
          : `/kms/keys/${onchangeval.label}/create`,
      state: {
        detail:
          props.match.params.kmsManagePage == "edit"
            ? props.match.params.kmsServiceName
            : onchangeval.label
      }
    });
  };
  const columns = React.useMemo(
    () => [
      {
        Header: "Key Name",
        accessor: "name"
      },
      {
        Header: "Cipher",
        accessor: "cipher"
      },
      {
        Header: "Version",
        accessor: "versions"
      },
      {
        Header: "Attributes",
        accessor: "attributes",
        Cell: (rawValue) => {
          let html = "";
          if (rawValue && rawValue.value) {
            html = Object.keys(rawValue.value).map((key) => (
              <span>
                {key}
                <i className="fa-fw fa fa-long-arrow-right fa-fw fa fa-3"></i>
                {rawValue.value[key]}
                <br />
              </span>
            ));
          }
          return html;
        }
      },
      {
        Header: "Length",
        accessor: "length"
      },
      {
        Header: "Created Date",
        accessor: "created",
        Cell: (rawValue) => {
          const date = rawValue.value;
          const newdate = dateFormat(date, "mm/dd/yyyy hh:MM:ss TT");
          return newdate;
        }
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: (rawValue) => {
          return (
            <div className="text-center">
              <Button
                className="btn btn-outline-dark btn-sm m-r-5"
                size="sm"
                title="Edit"
                onClick={() => {
                  editModal(rawValue.row.original.name);
                }}
              >
                <i className="fa-fw fa fa-edit"></i>
              </Button>
              <Button
                variant="danger"
                size="sm"
                title="Delete"
                onClick={() => {
                  deleteModal(rawValue.row.original.name);
                }}
              >
                <i className="fa-fw fa fa-trash"></i>
              </Button>
            </div>
          );
        }
      }
    ],
    [updatetable]
  );

  return (
    <div>
      {commonBreadcrumb(["Kms"])}
      <h6 className="font-weight-bold">Key Management</h6>

      <div className="wrap">
        <fieldset>
          <div className="formHeader" style={{ padding: "12px 4px" }}>
            Select Service:
            <Select
              value={onchangeval}
              className="w-25 p-1"
              isClearable
              onChange={selconChange}
              components={{
                IndicatorSeparator: () => null
              }}
              options={servicesData}
              placeholder="Please select KMS service"
            />
          </div>
          <br />
        </fieldset>
        <Row className="mb-2">
          <Col md={10}></Col>
          <Col md={2} className="text-right">
            <Button
              className={
                onchangeval !== undefined ||
                props.match.params.kmsManagePage == "edit"
                  ? ""
                  : "button-disabled"
              }
              disabled={
                onchangeval != undefined ||
                props.match.params.kmsManagePage == "edit"
                  ? false
                  : true
              }
              onClick={addKey}
            >
              Add New Key
            </Button>
          </Col>
        </Row>

        <XATableLayout
          loading={loader}
          data={keydata || []}
          columns={columns}
          fetchData={selectServices}
          pageCount={pagecount}
        />

        <Modal show={editshowmodal} onHide={closeEditModal}>
          <Modal.Body>{`Are you sure want to rollover ?`}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeEditModal}>
              Close
            </Button>
            <Button variant="primary" onClick={EditConfirmClick}>
              Ok
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={deleteshowmodal} onHide={closeModal}>
          <Modal.Body>{`Are you sure you want to delete ?`}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleConfirmClick}>
              Ok
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default KeyManager;
