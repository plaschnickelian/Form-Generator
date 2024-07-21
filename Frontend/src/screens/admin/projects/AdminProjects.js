//import node modules and react modules
import React, { useState, useEffect } from 'react';
import Table from "../../../components/table/Table";
import { useSelector } from 'react-redux';
import { getToken } from '../../../features/user/userSlice';
import {
    Button,
    Col,
    Container,
    Modal,
    Row
} from "react-bootstrap";
import * as Icons from "react-icons/fa";
//import DWBO Sources
import Headline from '../../../components/Headline';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import { responseNotifyHandling } from '../../../components/Error'
import AddDataLine from '../../../components/admin/AddDataLine';
import { updateProject, deleteProject, getProjects } from '../../../features/admin/projectManagementActions'
import ProjectForm from '../../../features/admin/forms/ProjectForm';

//projekt blueprint als zwischenspeicher
const initCurrentProject = {
    projectID: "",
    projectName: "",
    projectAdminDescription: "",
    projectNumber: "",
    isActive: true,
    projectAddress: {},
    projectHolderAddress: {},
    projectType: 0
};

const AdminProjects = () => {
    const [projects, setProjects] = useState([{}]);
    const [isLoading, setLoading] = useState(true);
    const [newProject, setNewProject] = useState(initCurrentProject);
    const [show, setShow] = useState(false);
    const [confirmationMethod, setConfirmationMethod] = useState();
    const [confirmationTitle, setConfirmationTitle] = useState("");
    const [confirmationBtnCancel, setConfirmationBtnCancel] = useState("Abbrechen");
    const [confirmationBtnSubmit, setConfirmationBtnSubmit] = useState("Bestätigen");
    const [confirmationMessage, setConfirmationMessage] = useState(null);
    const [editData, setEditData] = useState({});

    //only used for delete confirmation
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);

    const userToken = useSelector(getToken);

    const config = {
        headers: {
            Authorization: `Bearer ${userToken}`,
        },
    }

    useEffect(() => {

    },[newProject])

    // Hide the modal
    const hideConfirmationModal = () => {
        setDisplayConfirmationModal(false);
    };

    //fetched projektdaten als json von db
    useEffect(() => {
        setLoading(true);
        getData();
    }, []);

    function getData() {
        getProjects(userToken).then((response) => {
            setProjects(response.data);
            //setLoading(false);
        }).catch((err) => {
            responseNotifyHandling(err.response, err.response.status, `Fehler [${err.response.status}]: ${err.response.data.message}`);
        });
    }

    //wenn user geladen werden wird nur das auf der Seite angezeigt
    /*
    if (isLoading) {
        return <div className="vertCent">Loading...</div>;
    }
    */

    //schliesst edit pop-up
    function handleClose() {
        setShow(false);
    }
    //editing project
    function onEdit(newProject) {
        setNewProject({ ...newProject });
        setShow(true);
    }
    function onDelete(element) {
        setEditData(element.original);
        setConfirmationMessage(`Soll der Angebotstyp ${element.original.projectName} gelöscht werden?`)
        setConfirmationTitle("Löschen bestätigen");
        setConfirmationBtnSubmit("Löschen");
        setConfirmationMethod("delete");
        setDisplayConfirmationModal(true);
    }
    function deleteConfirmed(element) {
        deleteProject(element, userToken)
            .then((res) => {
                responseNotifyHandling(res, res.status, `Projekt: [${element.projectNumber}] wurde gelöscht`)
                getData();
            })
            .catch((err) => {
                responseNotifyHandling(err.response, err.response.status, `Fehler [${err.response.status}] beim löschen von Projekt ${element.projectNumber}.`)
            });
        setDisplayConfirmationModal(false);
    }

    function deactivateConfirmed(editData) {
        const updatedProject = { ...editData, isActive: !editData.isActive }

        updateProject(updatedProject, userToken).then((res) => {
            getData();

            responseNotifyHandling(res, res.status, `Projekt: [${editData.projectName}] wurde aktualisiert`);
        });

        setDisplayConfirmationModal(false);
    }

    function onDeactivate(element) {
        (element.original.isActive) ? setConfirmationTitle("Deaktivieren bestätigen") : setConfirmationTitle("Aktivieren bestätigen");
        (element.original.isActive) ? setConfirmationBtnSubmit("Deaktivieren") : setConfirmationBtnSubmit("Aktivieren");
        if (element.original.isActive) {
            setConfirmationMessage(`Soll das Projekt [${element.original.projectName}] deaktiviert werden?`);
        } else {
            setConfirmationMessage(`Soll der Angebotstyp [${element.original.projectName}] aktiviert werden?`)
        }
        setConfirmationMethod("deactivate");
        setEditData(element.original);
        setDisplayConfirmationModal(true);
    }

    const columns = React.useMemo(
        () => [
            {
                Header: 'Projekte',
                disableSortBy: true,
                columns: [
                    {
                        Header: '_id',
                        accessor: '_id'
                    },
                    {
                        Header: 'Projekt ID',
                        accessor: 'projectID'
                    },
                    {
                        Header: 'Projektnummer',
                        accessor: 'projectNumber'
                    },
                    {
                        Header: 'Name',
                        accessor: 'projectName'
                    },
                    {
                        Header: 'Beschreibung',
                        accessor: 'projectAdminDescription'
                    },
                    {
                        Header: 'Bereich',
                        accessor: 'projectType.shortDescription'
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
    )

    return (
        <div>
            <Headline name='Projektverwaltung' />
            <Container className="list-container">
                <Row>
                    <Col>
                        <AddDataLine
                            name='Neues Projekt anlegen'
                            path='/admin/projects/create'
                            title='Projekt anlegen'
                            form='project'
                            getData={getData} />
                        <Table columns={columns} data={projects} initialSortColumn="projectNumber" />

                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Projekt bearbeiten</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <ProjectForm onEdit="1" show={show} setShow={setShow} getData={getData} projectData={newProject} />
                            </Modal.Body>
                        </Modal>

                        <ConfirmationDialog showModal={displayConfirmationModal} confirmModal={() => (confirmationMethod === "delete" ? deleteConfirmed(editData) : deactivateConfirmed(editData))} hideModal={hideConfirmationModal} message={confirmationMessage} title={confirmationTitle} btnCancelTxt={confirmationBtnCancel} btnSubmitTxt={confirmationBtnSubmit} />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};
export default AdminProjects;