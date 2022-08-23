import React from "react";

export const RegexMessage = {
  MESSAGE: {
    policynameinfoiconmessage:
      "Please avoid these characters (&, <, >, ', \", `) for policy name.",
    userNameValidationMsg: (
      <>
        <p className="pd-10" style={{ fontSize: "small" }}>
          1. User name should be start with alphabet / numeric / underscore /
          non-us characters.
          <br />
          2. Allowed special character ,._-+/@= and space.
          <br />
          3. Name length should be greater than one.
        </p>
      </>
    ),
    passwordvalidationinfomessage:
      "Password should be minimum 8 characters ,atleast one uppercase letter, one lowercase letter and one numeric. For FIPS environment password should be minimum 14 characters with atleast one uppercase letter, one special characters, one lowercase letter and one numeric.",
    emailvalidationinfomessage: (
      <>
        <p className="pd-10" style={{ fontSize: "small" }}>
          1. Email address should be start with alphabet / numeric / underscore
          / non-us characters.
          <br /> 2. Allowed special character <b>.-@</b> .
          <br />
          3. Email address length should be greater than 9 characters.
          <br /> 4. Email address examples : abc@de.fg, A-C@D-.FG
        </p>
      </>
    ),
    policyconditioninfoicon:
      "1. JavaScript Condition Examples :\
                      country_code == 'USA', time_range >= 900 time_range <= 1800 etc.\
                      2. Dragging bottom-right corner of javascript condition editor(Textarea) can resizable",
    firstNameValidationMsg: (
      <>
        <p className="pd-10" style={{ fontSize: "small" }}>
          1. First name should be start with alphabet / numeric / underscore /
          non-us characters.
          <br />
          2. Allowed special character ,._-+/@= and space.
          <br />
          3. Name length should be greater than one.
        </p>
      </>
    ),
    lastNameValidationMsg: (
      <>
        <p className="pd-10" style={{ fontSize: "small" }}>
          1. Last name should be start with alphabet / numeric / underscore /
          non-us characters.
          <br />
          2. Allowed special character ,._-+/@= and space.
          <br />
          3. Name length should be greater than one.
        </p>
      </>
    )
  }
};

/* External User Edit Role Change */

export const roleChngWarning = {
  roleChng: (
    <>
      <b>Warning !! </b> : Please make sure that accumulo user's role change
      performed here is consistent with ranger.usersync.
      group.based.role.assignment.rules property in ranger usersync
      configuration.
    </>
  )
};

/* policyInfo Message */

export const policyInfoMessage = {
  maskingPolicyInfoMsg: (
    <p className="pd-l-10 d-inline">
      Please ensure that users/groups listed in this policy have access to the
      column via an <b>Access Policy</b>. This policy does not implicitly grant
      access to the column.
    </p>
  ),
  maskingPolicyInfoMsgForTagBased: (
    <p className="pd-l-10 d-inline">
      Please ensure that users/groups listed in this policy have access to the
      tag via an <b>Access Policy</b>. This policy does not implicitly grant
      access to the tag.
    </p>
  ),
  rowFilterPolicyInfoMsg: (
    <p className="pd-l-10 d-inline">
      Please ensure that users/groups listed in this policy have access to the
      table via an <b>Access Policy</b>. This policy does not implicitly grant
      access to the table.
    </p>
  )
};
