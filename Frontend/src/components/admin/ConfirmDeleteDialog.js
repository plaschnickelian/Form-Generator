import React from 'react'
import { Modal, Button } from "react-bootstrap";

export const DeleteConfirmation = ({ showModal, hideModal, confirmModal, message }) => {
    return (
        <Modal show={showModal} onHide={hideModal}>
        <Modal.Header closeButton>
          <Modal.Title>Löschen bestätigen</Modal.Title>
        </Modal.Header>
        <Modal.Body><div>{message}</div></Modal.Body>
        <Modal.Footer>
          <Button variant="default" onClick={hideModal}>
            Abbrechen
          </Button>
          <Button variant="danger" onClick={() => confirmModal() }>
            Löschen
          </Button>
        </Modal.Footer>
      </Modal>
    )
}