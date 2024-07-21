//import node modules and react modules
import React, { useState, useEffect } from 'react';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import {
    Button,
    Col,
    Container,
    Modal,
    Row
} from "react-bootstrap";
import Table from '../../../components/table/Table';
//Import CSS
import '../../../css/pages/adminusers.css';
import '../../../css/App.css';
//import DWBO Sources
import { deleteUser, getUsers } from '../../../features/admin/userManagementActions';
import Headline from '../../../components/Headline';
import AddDataLine from '../../../components/admin/AddDataLine';
import UserForm from '../../../features/admin/forms/UserForm';
import * as Icons from "react-icons/fa";
import { updateUser } from '../../../features/admin/userManagementActions';
import { responseNotifyHandling } from '../../../components/Error';
import { useSelector } from 'react-redux';
import { getToken } from '../../../features/user/userSlice';


//user blueprint als zwischenspeicher
const initCurrentUser = {
    userFirstName: "",
    userLastName: "",
    userMail: "",
    userPassword: "",
    isActive: "",
    isAdministrator: "",
    userProject: ""
};

const AdminUsers = () => {
    const userToken = useSelector(getToken);

    const [users, setUsers] = useState([{}]);
    const [isLoading, setLoading] = useState(false);
    const [newUser, setNewUser] = useState(initCurrentUser);
    const [show, setShow] = useState(false);
    //const [passwordShown, setPasswordShown] = useState(false);
    const [confirmationMethod, setConfirmationMethod] = useState();
    const [confirmationTitle, setConfirmationTitle] = useState("");
    const [confirmationBtnCancel, setConfirmationBtnCancel] = useState("Abbrechen");
    const [confirmationBtnSubmit, setConfirmationBtnSubmit] = useState("Bestätigen");
    const [confirmationMessage, setConfirmationMessage] = useState(null);
    const [editData, setEditData] = useState({});

    //only used for delete confirmation
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(null);
    // Hide the modal
    const hideConfirmationModal = () => {
        setDisplayConfirmationModal(false);
    };

    //fetched userdaten als json von der db
    useEffect(() => {
        getData();
    }, []);

    function getData() {
        getUsers(userToken).then((response) => {
            setUsers(response.data);
        });
    }

    //schliesst edit pop-up
    const handleClose = () => {
        setShow(false);
    }

    //aktiviert bearbeitung eines nutzers
    const onEdit = (newUser) => {
        setNewUser(newUser);
        setShow(true);
    }

    const onDeactivate = (element) => {
        (element.original.isActive) ? setConfirmationTitle("Deaktivieren bestätigen") : setConfirmationTitle("Aktivieren bestätigen");
        (element.original.isActive) ? setConfirmationBtnSubmit("Deaktivieren") : setConfirmationBtnSubmit("Aktivieren");
        if (element.original.isActive) {
            setConfirmationMessage(`Soll der Benutzer [${element.original.userMail}] deaktiviert werden?`);
        } else {
            setConfirmationMessage(`Soll der Benutzer [${element.original.userMail}] aktiviert werden?`);
        }
        setConfirmationMethod("deactivate");
        setEditData(element.original);
        setDisplayConfirmationModal(true);
    }

    const onDelete = (element) => {
        setEditData(element.original);
        setConfirmationMessage(`Soll der Benutzer [${element.original.userMail}] gelöscht werden?`)
        setConfirmationTitle("Löschen bestätigen");
        setConfirmationBtnSubmit("Löschen");
        setConfirmationMethod("delete");
        setDisplayConfirmationModal(true);
    }

    const onDeleteUser = (currentUser) => {
        setNewUser(currentUser);
        setDeleteMessage(`Soll der Benutzer ${currentUser.userLastName} gelöscht werden?`)
        setDisplayConfirmationModal(true);
    }

    function deleteConfirmed(currentUser) {
        deleteUser(currentUser, userToken)
            .then((res) => {
                responseNotifyHandling(res, res.status, `Benutzer: [${currentUser.userLastName}] wurde gelöscht`);
                getData();
            })
            .catch((err) => {
                responseNotifyHandling(err.response, err.response.status, `Fehler [${err.response.status}] beim löschen von Benutzer ${currentUser.userLastName}.`)
            })
        setDisplayConfirmationModal(false);
    }

    function deactivateConfirmed() {
        const updatedUser = { ...editData, isActive: !editData.isActive }

        updateUser(updatedUser, userToken).then((res) => {
            getData();

            responseNotifyHandling(res, res.status, `Benutzer: [${editData.userMail}] wurde aktualisiert`);
        });

        setDisplayConfirmationModal(false);
    }

    const columns = React.useMemo(
        () => [
            {
                Header: 'Benutzer',
                disableSortBy: true,
                columns: [
                    {
                        Header: '_id',
                        accessor: '_id'
                    },
                    {
                        Header: 'Nachname',
                        accessor: 'userLastName'
                    },
                    {
                        Header: 'Vorname',
                        accessor: 'userFirstName'
                    },
                    {
                        Header: 'E-Mail',
                        accessor: 'userMail'
                    },
                    {
                        Header: 'Projekt',
                        accessor: 'userProject.projectName'
                    },
                    {
                        Header: 'Aktiv',
                        accessor: 'isActive',
                        Cell: ({ row }) => {
                            return (row.original.isActive === true) ? <Icons.FaCheck /> : <Icons.FaBan />
                        }
                    },
                    {
                        Header: 'Admin',
                        accessor: 'isAdministrator',
                        Cell: ({ row }) => {
                            return (row.original.isAdministrator === true) ? <Icons.FaCheck /> : <Icons.FaBan />
                        }
                    },
                    {
                        Header: 'Aktionen',
                        accessor: 'actions',
                        disableSortBy: true,
                        Cell: ({ row }) => (
                            <div className='d-flex' style={{ columnGap: "0.2rem" }}>
                                <Button
                                    variant="info"
                                    title="Bearbeiten"
                                    className={`btn-primary btn-sm`}
                                    onClick={() => onEdit(row.original)}>
                                    <Icons.FaPencilAlt />
                                </Button>{" "}
                                <Button
                                    variant="warning"
                                    title="Aktivieren/Deaktivieren"
                                    className={`btn-warning btn-sm`}
                                    onClick={() => onDeactivate(row)}
                                >
                                    <Icons.FaBan /></Button>{" "}
                                <Button
                                    variant="danger"
                                    title="Löschen"
                                    className={`btn-danger btn-sm`}
                                    onClick={() => onDelete(row)}
                                >
                                    <Icons.FaTrashAlt /></Button>
                            </div>
                        )
                    }
                ],
            }
        ],
        []
    );

    //wenn user geladen werden wird nur das auf der Seite angezeigt
    if (isLoading) {
        return <div className="vertCent">Loading...</div>;
    }

    return (
        <div>
            <Headline name="Benutzerverwaltung" />

            <Container className="list-container">
                <Row>
                    <Col>
                        <AddDataLine
                            name='Neuen Benutzer anlegen'
                            path='/admin/users/create'
                            title='Benutzer anlegen'
                            form='user'
                            getData={getData} />
                        <Table columns={columns} data={users} initialSortColumn="userLastName" />

                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Benutzer bearbeiten</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <UserForm onEdit="1" show={show} setShow={setShow} getUsers={getData} userData={newUser} />
                            </Modal.Body>
                        </Modal>

                        <ConfirmationDialog showModal={displayConfirmationModal} confirmModal={() => (confirmationMethod === "delete" ? deleteConfirmed(editData) : deactivateConfirmed(editData))} hideModal={hideConfirmationModal} message={confirmationMessage} title={confirmationTitle} btnCancelTxt={confirmationBtnCancel} btnSubmitTxt={confirmationBtnSubmit} />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AdminUsers