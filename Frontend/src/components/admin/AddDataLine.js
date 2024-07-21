import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import * as Icons from "react-icons/fa";
import { useState } from 'react';
import ProjectForm from '../../features/admin/forms/ProjectForm';
import UserForm from '../../features/admin/forms/UserForm';


function AddDataLine(props) {
  const [show, setShow] = useState(false);

  function handleClose() {
    setShow(false);
}

function getForm() {
  switch(props.form) {
    case "project":
      return(
        <ProjectForm setShow={setShow} getData={props.getData} />
      );

      case "user":
        return(
          <UserForm setShow={setShow} onEdit={"0"} getUsers={props.getData} />
        )

    default: return null
  }
}

  return (
    <div className="new-object-creation">
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {getForm()}
        </Modal.Body>
      </Modal>
      <h5 className='new-object-title'>{props.name}</h5>
      <Button
        variant="primary"
        title={props.title}
        className="btn-secondary btn btn-sm"
        onClick={() => setShow(true)}
        style={{ verticalAlign: 'top' }}>
        <Icons.FaPlus />
      </Button>
    </div>
  )
}

export default AddDataLine;
