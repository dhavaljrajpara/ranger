import React from "react";
import moment from "moment-timezone";
import { Breadcrumb } from "react-bootstrap";

export const CustomBreadcrumb = (props) => {
  const { data, type } = props;

  return (
    <div className="mt-n1 mb-2 headerBreadcrumbs">
      <div className="r_breadcrumbs">
        <Breadcrumb>
          {type.map((obj, index) => {
            return (
              <Breadcrumb.Item
                className={index >= 1 ? "allow_nav" : ""}
                href={data[index][obj].href}
                key={index}
              >
                <p
                  className="trim-containt-breadcrumb"
                  title={data[index][obj].text}
                >
                  {data[index][obj].text}
                </p>
              </Breadcrumb.Item>
            );
          })}
        </Breadcrumb>
      </div>
      <div className="text-right latestResponse">
        <b>Last Response Time: </b>
        {moment.tz(moment(), "Asia/Kolkata").format("DD/MM/YYYY HH:mm:ss A")}
      </div>
    </div>
  );
};
export default CustomBreadcrumb;
