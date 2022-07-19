import React, { useState, useCallback, useRef } from "react";
import { Table } from "react-bootstrap";
export function SyncSourceDetails(props) {
  const { syncDetails } = props;
  return Object.keys(props.syncDetails).length == 0 ? (
    <>
      <Table bordered size="sm">
        <thead className="thead-light">
          <tr>
            <th className=" text-center">Name</th>
            <th className=" text-center">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-center text-muted" colSpan="2">
              No Sync Details Found!!
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  ) : (
    <>
      <Table bordered size="sm">
        <thead className="thead-light">
          <tr>
            <th className=" text-center">Name</th>
            <th className=" text-center">Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(props.syncDetails).map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
export default SyncSourceDetails;
