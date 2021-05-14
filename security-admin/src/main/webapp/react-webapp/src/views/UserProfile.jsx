import React, { Component } from "react";
import Tab from "react-bootstrap/Tab";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";

class UserProfile extends Component {
  render() {
    return (
      <Container>
        <Row>
          <Col>
            <h4>User Profile</h4>
            <Tab.Container
              transition={false}
              defaultActiveKey="edit-basic-info"
            >
              <Nav variant="tabs">
                <Nav.Item>
                  <Nav.Link eventKey="edit-basic-info">Basic Info</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="edit-password">Change Password</Nav.Link>
                </Nav.Item>
              </Nav>
              <Tab.Content>
                <Form>
                  <Tab.Pane eventKey="edit-basic-info">
                    <Form.Group as={Row} controlId="formHorizontalEmail">
                      <Form.Label column sm={2}>
                        First Name
                      </Form.Label>
                      <Col sm={10}>
                        <Form.Control type="text" placeholder="First Name" />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalEmail">
                      <Form.Label column sm={2}>
                        Last Name
                      </Form.Label>
                      <Col sm={10}>
                        <Form.Control type="text" placeholder="Last Name" />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalEmail">
                      <Form.Label column sm={2}>
                        Email Address
                      </Form.Label>
                      <Col sm={10}>
                        <Form.Control
                          type="email"
                          placeholder="Email Address"
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalEmail">
                      <Form.Label column sm={2}>
                        Select Role
                      </Form.Label>
                      <Col sm={10}>
                        <Form.Control as="select">
                          <option>Admin</option>
                          <option>User</option>
                          <option>Auditor</option>
                        </Form.Control>
                      </Col>
                    </Form.Group>
                  </Tab.Pane>
                  <Tab.Pane eventKey="edit-password">
                    <Form.Group as={Row} controlId="formHorizontalEmail">
                      <Form.Label column sm={2}>
                        Old Password
                      </Form.Label>
                      <Col sm={10}>
                        <Form.Control
                          type="password"
                          placeholder="Old Password"
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalEmail">
                      <Form.Label column sm={2}>
                        New Password
                      </Form.Label>
                      <Col sm={10}>
                        <Form.Control
                          type="password"
                          placeholder="New Password"
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalEmail">
                      <Form.Label column sm={2}>
                        Re-enter New Password
                      </Form.Label>
                      <Col sm={10}>
                        <Form.Control
                          type="password"
                          placeholder="Re-enter New Password"
                        />
                      </Col>
                    </Form.Group>
                  </Tab.Pane>
                </Form>
              </Tab.Content>
            </Tab.Container>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default UserProfile;
