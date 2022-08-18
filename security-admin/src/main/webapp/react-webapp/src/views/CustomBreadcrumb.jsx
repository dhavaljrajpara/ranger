import React from "react";
import moment from "moment-timezone";
import { Link } from "react-router-dom";
import { isEmpty } from "lodash";

export const CustomBreadcrumb = (props) => {
  const { data, type } = props;

  return (
    <div className="mt-n1 mb-2 headerBreadcrumbs">
      <div className="r_breadcrumbs">
        <ul className="breadcrumb">
          {type.map((obj, index) => {
            let link = data[index][obj].href;
            return (
              <li
                className={
                  index >= 1 ? "allow_nav breadcrumb-item" : "breadcrumb-item"
                }
                key={index}
              >
                {isEmpty(link) ? (
                  <a href="javascript:void(0)">
                    <p
                      className="trim-containt-breadcrumb"
                      title={data[index][obj].text}
                    >
                      {data[index][obj].text}
                    </p>
                  </a>
                ) : (
                  <Link to={link}>
                    <p
                      className="trim-containt-breadcrumb"
                      title={data[index][obj].text}
                    >
                      {data[index][obj].text}
                    </p>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="text-right latestResponse">
        <b>Last Response Time: </b>
        {moment.tz(moment(), "Asia/Kolkata").format("MM/DD/YYYY hh:mm:ss A")}
      </div>
    </div>
  );
};
export default CustomBreadcrumb;
