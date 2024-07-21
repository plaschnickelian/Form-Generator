import React from 'react'
import { Modal, Button } from "react-bootstrap";

const ConfirmationDialog = ({ showModal, hideModal, confirmModal, title, message, btnCancelTxt, btnSubmitTxt, btnSubmitColor = "danger" }) => {
    return (
      <Modal show={showModal} onHide={hideModal}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body><div>{message}</div></Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={hideModal}>
            {btnCancelTxt}
          </Button>
          <Button variant={btnSubmitColor} onClick={ confirmModal }>
            {btnSubmitTxt}
          </Button>
        </Modal.Footer>
      </Modal>
    )
}

export default ConfirmationDialog;