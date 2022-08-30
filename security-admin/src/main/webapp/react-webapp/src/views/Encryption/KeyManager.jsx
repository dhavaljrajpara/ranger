import React, { useReducer, useCallback, useEffect, useState } from "react";
import { Loader } from "Components/CommonComponents";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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
      props.params.kmsManagePage == "new"
        ? null
        : {
            value: props.params.kmsServiceName,
            label: props.params.kmsServiceName
          },
    deleteshowmodal: false,
    editshowmodal: false,
    filterdata: null,
    pagecount: 0,
    kmsservice: {},
    updatetable: moment.now(),
    tblpageData: {
      totalPage: 0,
      pageRecords: 0,
      pageSize: 25
    },
    currentPageIndex:
      props.state && props.state.showLastPage
        ? props.state.addPageData.totalPage - 1
        : 0,
    resetPage: { page: null }
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_LOADER":
      return {
        ...state,
        loader: action.loader
      };

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

    case "SET_DATA_TO_LAST_PAGE":
      return {
        ...state,
        loader: false,
        tblPageData: action.tblPageData
      };

    case "SET_CURRENT_PAGE_INDEX":
      return {
        ...state,
        currentPageIndex: action.tblPageData
      };
    case "SET_RESET_PAGE":
      return {
        ...state,
        resetPage: action.resetPage
      };
    default:
      throw new Error();
  }
}

const KeyManager = (props) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const params = useParams();
  let stateAndParams = { params: params, state: state };
  const [keyState, dispatch] = useReducer(reducer, stateAndParams, init);

  const {
    loader,
    servicesData,
    keydata,
    filterdata,
    onchangeval,
    deleteshowmodal,
    editshowmodal,
    currentPageIndex,
    pagecount,
    services,
    tblpageData,
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
      if (keydata.length == 1 && currentPageIndex > 1) {
        let page = currentPageIndex - currentPageIndex;
        resetPage.page(page);
      } else {
        dispatch({
          type: "SET_UPDATE_TABLE",
          updatetable: moment.now()
        });
      }
    } catch (error) {
      let errorMsg = "";
      if (error.response.data.msgDesc) {
        errorMsg += toast.error(error.response.data.msgDesc + "\n");
      } else {
        errorMsg += `Error occurred during deleting Key` + "\n";
      }
    }
  }, [filterdata]);
  const closeModal = () => {
    dispatch({
      type: "SET_DELETE_MODAL_CLOSE",
      deleteshowmodal: false
    });
  };
  const selectServices = useCallback(
    async ({ pageSize, pageIndex, gotoPage }) => {
      dispatch({
        type: "SET_LOADER",
        loader: true
      });
      let selcservicesdata = null;
      let totalCount = 0;
      let totalPageCount = 0;
      let page =
        state && state.showLastPage
          ? state.addPageData.totalPage - 1
          : pageIndex;
      try {
        const selservicesResp = await fetchApi({
          url: "/keys/keys",
          params: {
            page: page,
            startIndex:
              state && state.showLastPage
                ? (state.addPageData.totalPage - 1) * pageSize
                : pageIndex * pageSize,
            pageSize: pageSize,
            total_pages: 1,
            totalCount: Math.ceil(totalCount / pageSize),
            provider: onchangeval && onchangeval.label
          }
        });
        selcservicesdata = selservicesResp.data.vXKeys;
        totalCount = selservicesResp.data.totalCount;
        totalPageCount = Math.ceil(totalCount / pageSize);
      } catch (error) {
        console.error(`Error occurred while fetching Services! ${error}`);
      }

      dispatch({
        type: "SET_SEL_SERVICE",
        keydatalist: selcservicesdata,
        pagecount: Math.ceil(totalCount / pageSize),
        loader: false
      });
      dispatch({
        type: "SET_DATA_TO_LAST_PAGE",
        tblPageData: {
          totalPage: totalPageCount,
          pageRecords: totalCount,
          pageSize: 25
        }
      });
      dispatch({
        type: "SET_CURRENT_PAGE_INDEX",
        currentPageIndex: page
      });
      dispatch({
        type: "SET_RESET_PAGE",
        resetPage: gotoPage
      });
    },
    [onchangeval, updatetable]
  );

  const addKey = () => {
    navigate(
      params.kmsManagePage == "edit"
        ? `/kms/keys/${params.kmsServiceName}/create`
        : `/kms/keys/${onchangeval.label}/create`,
      {
        state: {
          detail:
            params.kmsManagePage == "edit"
              ? params.kmsServiceName
              : onchangeval.label,
          tblpageData: tblpageData
        }
      }
    );
  };
  const columns = React.useMemo(
    () => [
      {
        Header: "Key Name",
        accessor: "name",
        Cell: (rawValue) => {
          if (rawValue && rawValue.value) {
            return <p className="text-truncate">{rawValue.value}</p>;
          }
        }
      },
      {
        Header: "Cipher",
        accessor: "cipher",
        Cell: (rawValue) => {
          if (rawValue && rawValue.value) {
            return <p className="text-center">{rawValue.value}</p>;
          }
        }
      },
      {
        Header: "Version",
        accessor: "versions",
        Cell: (rawValue) => {
          if (rawValue && rawValue.value) {
            return <p className="text-center">{rawValue.value}</p>;
          }
        },
        width: 70
      },
      {
        Header: "Attributes",
        accessor: "attributes",
        Cell: (rawValue) => {
          let html = "";
          if (rawValue && rawValue.value) {
            html = Object.keys(rawValue.value).map((key) => (
              <p className="text-truncate">
                {key}
                <i className="fa-fw fa fa-long-arrow-right fa-fw fa fa-3"></i>
                {rawValue.value[key]}
                <br />
              </p>
            ));
          }
          return html;
        }
      },
      {
        Header: "Length",
        accessor: "length",
        Cell: (rawValue) => {
          if (rawValue && rawValue.value) {
            return <p className="text-center">{rawValue.value}</p>;
          }
        },
        width: 70
      },
      {
        Header: "Created Date",
        accessor: "created",
        Cell: (rawValue) => {
          if (rawValue && rawValue.value) {
            const date = rawValue.value;
            const newdate = dateFormat(date, "mm/dd/yyyy hh:MM:ss TT");
            return <div className="text-center">{newdate}</div>;
          }
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
                data-name="rolloverKey"
                data-id={rawValue.row.original.name}
                data-cy={rawValue.row.original.name}
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
                data-name="deleteKey"
                data-id={rawValue.row.original.name}
                data-cy={rawValue.row.original.name}
              >
                <i className="fa-fw fa fa-trash"></i>
              </Button>
            </div>
          );
        },
        width: 80
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
                onchangeval !== undefined || params.kmsManagePage == "edit"
                  ? ""
                  : "button-disabled"
              }
              disabled={
                onchangeval != undefined || params.kmsManagePage == "edit"
                  ? false
                  : true
              }
              onClick={addKey}
              data-id="addNewKey"
              data-cy="addNewKey"
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
          currentPageIndex={currentPageIndex}
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
