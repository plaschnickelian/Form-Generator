//import node modules and react modules
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Table from "../../../components/table/Table";
import OfferTypeForm from '../../../features/admin/forms/OfferTypeForm';
import { createOfferType, deleteOfferType } from '../../../features/admin/offertypeManagementActions';
import {
    FloatingLabel,
    Button,
    Col,
    Container,
    Form,
    Row,
    Modal
} from "react-bootstrap";
import * as Icons from "react-icons/fa";
//Import CSS
import '../../../css/pages/adminusers.css';
import '../../../css/App.css';
//import DWBO Sources
import Headline from '../../../components/Headline';
import apiConfig from '../../../config/config';
import { responseNotifyHandling } from '../../../components/Error'
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import { getOfferTypes, updateOfferType } from '../../../features/admin/offertypeManagementActions';
import { getToken } from '../../../features/user/userSlice';

//offer type intialisation
const initCurrentObject = {
    projectOfferTypeID: "",
    projectOfferType: "",
    isActive: true
};

const AdminOfferTypes = () => {
    const userToken = useSelector(getToken);

    const [form, setForm] = useState({});
    const [offerTypes, setOfferTypes] = useState([{}]);
    const [errors, setErrors] = useState({});
    const [validated, setValidated] = useState(false);
    const [newOffer, setNewOffer] = useState(initCurrentObject);
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState(null);
    const [editData, setEditData] = useState({});
    const [confirmationMethod, setConfirmationMethod] = useState();
    const [confirmationTitle, setConfirmationTitle] = useState("");
    const [confirmationBtnCancel, setConfirmationBtnCancel] = useState("Abbrechen");
    const [confirmationBtnSubmit, setConfirmationBtnSubmit] = useState("Bestätigen");
    const [skipPageReset, setSkipPageReset] = useState(false);
    const [originalData, setOriginalData] = useState(editData);
    const [editableRowIndex, setEditableRowIndex] = useState(null);
    // show modal edit dialogue
    const [show, setShow] = useState(false);
    // current editing offer type
    const [editOfferType, setEditOfferType] = useState({});


    //validation regexpressions
    const offerNameFormat = /^[a-zA-Z0-9\x7f-\xff- ]+$/;
    const offerIDFormat = /^[0-9]*$/;

    //fetched offer type data by db
    useEffect(() => {
        getData();
    }, []);

    function getData() {
        getOfferTypes(userToken).then((response) => {
            setOfferTypes(response.data);
        }).catch((err) => {
            responseNotifyHandling(err.response, err.response.status, `Fehler [${err.response.status}]: Angebotstypen konnten nicht gefunden werden.`)
        });
    }

    /**
     * event handler for form submitting
     * @param {*} event 
     */
    const handleSubmit = (event) => {
        //validation
        const newErrors = checkFormValidity(newOffer);

        //if form is not valid cancel submit
        if (Object.keys(newErrors).length > 0) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            let response = false;
            //stops page refresh
            event.preventDefault();
            event.stopPropagation();
            //create new Object in DB
            response = createNewOfferType(newOffer);
            if (response) {
                getAllOfferTypes();

                //clear validation state
                setValidated(false);
            }
        }
    };

    /**
     * 
     * @param {*} newOffer 
     */
    const checkFormValidity = (newOffer, conflictErrors) => {
        //clear errors
        const newErrors = {};
        //setErrors({});

        if (newOffer) {
            // projectOfferTypeID errors: projectOfferTypeID cannot be empty, cannot be negative
            if (!newOffer.projectOfferTypeID || newOffer.projectOfferTypeID === '' || !newOffer.projectOfferTypeID > 0 || !newOffer.projectOfferTypeID.match(offerIDFormat)) {
                newErrors.projectOfferTypeID = 'Die AngebotstypID ist ein Pflichtfeld. Bitte geben Sie eine positive Ganzzahl als AngebotstypID ein.';
            }

            // projectOfferType errors: projectOfferType cannot be empty, cannot contain special chars
            if (!newOffer.projectOfferType || newOffer.projectOfferType === '' || !newOffer.projectOfferType.match(offerNameFormat)) {
                newErrors.projectOfferType = 'Der Angebotstypname ist ein Pflichtfeld. Bitte geben Sie einen Angebotstypsnamen ohne Sonderzeichen ein.';
            }
        }

        if (conflictErrors) {
            if (conflictErrors.projectOfferType) {
                newErrors.projectOfferType = conflictErrors.projectOfferType;
            }

            if (conflictErrors.projectOfferTypeID) {
                newErrors.projectOfferTypeID = conflictErrors.projectOfferTypeID;
            }
        }

        setErrors(newErrors);
        return newErrors;
    }

    /**
     * change event handler for input fields
     * @param {*} e 
     */
    function handleChange(e) {
        //set form values
        setForm({
            ...form,
            [e.target.id]: e.target.value
        })
        //check for validation errors
        findLiveFormErrors(e.target.form, e);
    }

    //schliesst edit pop-up
    function handleClose() {
        setShow(false);
    }

    /**
     * offerType form LIVE validation
     * @param {*} form 
     * @param {*} event 
     * @returns 
     */
    const findLiveFormErrors = (form, event) => {
        const { projectOfferTypeID, projectOfferType } = form;
        const eventElement = event.target.id;

        const newErrors = {};

        // projectOfferTypeID errors: projectOfferTypeID cannot be empty, cannot be negative
        if (eventElement === 'projectOfferTypeID' && (!projectOfferTypeID.value || projectOfferTypeID.value === '' || !projectOfferTypeID.value > 0 || !projectOfferTypeID.value.match(offerIDFormat))) {
            newErrors.projectOfferTypeID = 'Die AngebotstypID ist ein Pflichtfeld. Bitte geben Sie eine positive Ganzzahl als AngebotstypID ein.';
        }

        // projectOfferType errors: projectOfferType cannot be empty, cannot contain special chars
        if (eventElement === 'projectOfferType' && (!projectOfferType.value || projectOfferType.value === '' || !projectOfferType.value.match(offerNameFormat))) {
            newErrors.projectOfferType = 'Der Angebotstypname ist ein Pflichtfeld. Bitte geben Sie einen Angebotstypsnamen ohne Sonderzeichen ein.';
        }

        setErrors(newErrors);
    }

    /**
     * saving new object to DB
     * @param {*} offerType 
     */
    async function createNewOfferType(offerType) {
        let returnValue;

        createOfferType(offerType, userToken)
            .then((response) => {
                if (response.status === apiConfig.status.created) {
                    responseNotifyHandling(response, response.status, `Angebotstyp: [${offerType.projectOfferType}] wurde erstellt!`);
                    getAllOfferTypes();
                    setNewOffer(initCurrentObject);
                    setForm({});
                    returnValue = true;
                } else {
                    responseNotifyHandling(response, response.status, `Fehler [${response.status}], beim Erstellen des Angebotstyps ${offerType.projectOfferType}: ${response.data.message}.`)
                    returnValue = false;
                }
            })
            .catch((err) => {
                responseNotifyHandling(err.response, err.response.status, `Fehler [${err.response.status}] beim Erstellen des Angebotstyps ${offerType.projectOfferType}: ${Object.values(err.response.data.message)[0]}.`)
                checkFormValidity(null, err.response.data.message);
                returnValue = false;
            })

        return returnValue;
    }

    /**
     * getting all objects from DB
     * @param {*} offerType 
     */
    async function getAllOfferTypes() {
        getOfferTypes(userToken)
            .then((response) => {
                if (response.status === apiConfig.status.ok && response.data) {
                    setOfferTypes(response.data);
                }
            })
            .catch((err) => {
                responseNotifyHandling(err.response, err.response.status, `Fehler [${err.response.status}]: Angebotstypen konnten nicht gefunden werden.`)
            })
    }

    /** ______________ DEACTIVATION _____________ **/
    const onDeactivate = (element) => {
        (element.original.isActive) ? setConfirmationTitle("Deaktivieren bestätigen") : setConfirmationTitle("Aktivieren bestätigen");
        (element.original.isActive) ? setConfirmationBtnSubmit("Deaktivieren") : setConfirmationBtnSubmit("Aktivieren");
        if (element.original.isActive) {
            setConfirmationMessage(`Soll der Angebotstyp ${element.original.projectOfferType} deaktiviert werden?`);
        } else {
            setConfirmationMessage(`Soll der Angebotstyp ${element.original.projectOfferType} aktiviert werden?`)
        }
        setConfirmationMethod("deactivate");
        setEditData(element.original);
        setDisplayConfirmationModal(true);
    }

    /** ______________ DELETION _____________ **/
    const onDelete = (element) => {
        setEditData(element.original);
        setConfirmationMessage(`Soll der Angebotstyp ${element.original.projectOfferType} gelöscht werden?`)
        setConfirmationTitle("Löschen bestätigen");
        setConfirmationBtnSubmit("Löschen");
        setConfirmationMethod("delete");
        setDisplayConfirmationModal(true);
    }

    async function deleteData() {
        let element = editData;
        let returnValue;
        deleteOfferType(element.projectOfferTypeID, userToken)
            .then((response) => {
                if (response.status === apiConfig.status.ok) {
                    responseNotifyHandling(response, response.status, `Angebotstyp: [${element.projectOfferType}] wurde gelöscht!`);
                    getAllOfferTypes();
                    returnValue = true;
                } else {
                    responseNotifyHandling(response, response.status, `Fehler [${response.status}] beim Löschen des Angebotstyps ${element.projectOfferType}.`)
                }
            })
            .catch((err) => {
                responseNotifyHandling(err.response, err.response.status, `Fehler [${err.response.status}] beim Löschen des Angebotstyps ${element.projectOfferType}.`)
            })

        return returnValue;
    }

    async function updateData(element, values) {
        element["isActive"] = values.isActive;
        let returnValue;
        const newOfferType = element;

        updateOfferType(newOfferType, userToken)
            .then((response) => {
                if (response.status === apiConfig.status.created) {
                    responseNotifyHandling(response, response.status, `Angebotstyp: [${element.projectOfferType}] wurde aktualisiert!`);
                    getAllOfferTypes();
                    returnValue = true;
                } else {
                    responseNotifyHandling(response, response.status, `Fehler [${response.status}] beim Aktualisieren des Angebotstyps ${element.projectOfferType}.`)
                }
            })
            .catch((err) => {
                returnValue = err;
            })

        return returnValue;
    }

    /** ______________ CONFIRMATION DIALOGS _____________ */

    function deleteConfirmed(element) {
        deleteData(element);

        setDisplayConfirmationModal(false);
    }

    function deactivateConfirmed(element) {
        updateData(element, { "isActive": !element.isActive });

        setDisplayConfirmationModal(false);
    }

    // Hide the modal
    const hideConfirmationModal = () => {
        setEditData({});
        getAllOfferTypes();
        setDisplayConfirmationModal(false);
    };

    const columns = React.useMemo(
        () => [
            {
                Header: 'Angebotstypen',
                disableSortBy: true,
                columns: [
                    {
                        Header: 'ID',
                        accessor: 'projectOfferTypeID',
                        disableInlineEdit: true
                    },
                    {
                        Header: 'Name',
                        accessor: 'projectOfferType'
                    },
                    {
                        Header: 'ist aktiv',
                        accessor: 'isActive',
                        Cell: ({ row }) => {
                            return (row.original.isActive === true) ? <Icons.FaCheck /> : <Icons.FaBan />
                        }
                    },
                    {
                        Header: 'Aktionen',
                        accessor: 'actions',
                        disableSortBy: true,
                        Cell: ({ row }) => (
                            <div>
                                <Button
                                    variant="info"
                                    title="Bearbeiten"
                                    className={`btn-primary btn-sm`}
                                    onClick={() => {
                                        getOfferTypes(userToken)
                                            .then((res) => {
                                                const offerToUpdate = res.data.filter(function (offer) {
                                                    return offer.projectOfferTypeID == row.values.projectOfferTypeID
                                                })
                                                setEditOfferType(offerToUpdate[0]);
                                                setShow(true);
                                            })
                                    }}>
                                    <Icons.FaPencilAlt />
                                </Button>{" "}
                                <Button
                                    variant="warning"
                                    title="Aktivieren/Deaktivieren"
                                    className={`btn-warning btn-sm ${editableRowIndex !== row.index ? "btn-visible" : "btn-invisible"}`}
                                    onClick={() => onDeactivate(row)}>
                                    <Icons.FaBan /></Button>{" "}
                                <Button
                                    variant="danger"
                                    title="Löschen"
                                    className={`btn-danger btn-sm ${editableRowIndex !== row.index ? "btn-visible" : "btn-invisible"}`}
                                    onClick={() => onDelete(row)}>
                                    <Icons.FaTrashAlt /></Button>
                            </div>
                        )
                    }
                ],
            }
        ],
        []
    )

    return (
        <div>

            <Headline name='Angebotstypenverwaltung' />
            <Container className="list-container">
                <Row>
                    <Col>
                        <h5 className='new-object-title'>Neuen Angebotstyp anlegen</h5>
                        <Form validated={validated} noValidate className='d-flex' onSubmit={handleSubmit}>
                            <FloatingLabel
                                controlId="projectOfferTypeID"
                                label="ID"
                                className="mb-3" style={{ width: '20%', marginRight: '1.25em' }}>
                                <Form.Control
                                    required
                                    type="number"
                                    min='0'
                                    step='1'
                                    placeholder="ID"
                                    isInvalid={!!errors.projectOfferTypeID}
                                    value={newOffer.projectOfferTypeID}
                                    onChange={(e) => {
                                        setNewOffer({ ...newOffer, projectOfferTypeID: e.target.value });
                                        handleChange(e)
                                    }}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.projectOfferTypeID}
                                </Form.Control.Feedback>
                            </FloatingLabel>
                            <FloatingLabel
                                controlId="projectOfferType"
                                label="Name"
                                className="mb-3">
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Angebotstyp Name"
                                    isInvalid={!!errors.projectOfferType}
                                    value={newOffer.projectOfferType}
                                    onChange={(e) => {
                                        setNewOffer({ ...newOffer, projectOfferType: e.target.value });
                                        handleChange(e)
                                    }}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.projectOfferType}
                                </Form.Control.Feedback>
                            </FloatingLabel>
                            <Button
                                variant="secondary"
                                type="submit"
                                title='Angebotstyp anlegen'
                                className="btn-secondary btn btn-sm"
                                style={{ verticalAlign: 'top', height: '40px', width: '46px', lineHeight: '16px' }}>
                                <Icons.FaPlus size={20} />
                            </Button>
                        </Form>
                        <Table columns={columns} data={offerTypes} initialSortColumn="projectOfferTypeID" />

                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Projekt bearbeiten</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <OfferTypeForm show={show} setShow={setShow} editOfferType={editOfferType} getData={getData} />
                            </Modal.Body>
                        </Modal>

                        <ConfirmationDialog showModal={displayConfirmationModal} confirmModal={() => (confirmationMethod === "delete" ? deleteConfirmed(editData) : deactivateConfirmed(editData))} hideModal={hideConfirmationModal} message={confirmationMessage} title={confirmationTitle} btnCancelTxt={confirmationBtnCancel} btnSubmitTxt={confirmationBtnSubmit} />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};
export default AdminOfferTypes;