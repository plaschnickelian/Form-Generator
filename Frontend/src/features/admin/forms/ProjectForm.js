//import node modules and react modules
import { Form, Button, FloatingLabel } from 'react-bootstrap';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { responseNotifyHandling } from '../../../components/Error';
import { createProject, updateProject, getProjectTypes } from '../projectManagementActions';
import { getToken } from '../../user/userSlice';
import { useSelector } from 'react-redux';
//import DWBO Sources
import { getOfferTypes } from '../offertypeManagementActions';


let initCurrentProject = {
    projectID: null,
    projectName: '',
    projectAdminDescription: '',
    projectNumber: '',
    projectOffer: null,
    projectData: null,
    isActive: true,
    projectType: 1
}

const ProjectForm = ({ onEdit, show, setShow, getData, projectData }) => {
    if (onEdit === "1") {
        initCurrentProject = projectData;
    } else {
        initCurrentProject = {
            projectID: null,
            projectName: '',
            projectAdminDescription: '',
            projectNumber: '',
            projectOffer: null,
            projectData: null,
            isActive: true,
            projectType: 1
        }
    }

    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});
    const [validated, setValidated] = useState(false);
    const [newProject, setNewProject] = useState(initCurrentProject);
    const [projectOfferTypes, setProjectOfferTypes] = useState([]);
    const [projectTypes, setProjectTypes] = useState([]);
    const [selectedProjectOfferTypes, setSelectedProjectOfferTypes] = useState('');
    const [selectedProjectTypes, setSelectedProjectTypes] = useState(0);

    let navigate = useNavigate();
    const userToken = useSelector(getToken);

    const config = {
        headers: {
            Authorization: `Bearer ${userToken}`,
        },
    }

    //validation regexpressions
    const projectNameFormat = /^[a-zA-Z0-9\x7f-\xff- ]+$/;
    const projectIDFormat = /^[0-9]*$/;

    useEffect(() => {
        getProjectTypes(userToken).then((res) => {
            setProjectTypes(res.data);
        }).catch((err) => {
            responseNotifyHandling(err.response, err.response.status, `Fehler [${err.response.status}]: ${err.response.data.message}`);
        });

        getOfferTypes(userToken).then((response) => {
            setProjectOfferTypes(response.data);
        }).catch((err) => {
            responseNotifyHandling(err.response, err.response.status, `Fehler [${err.response.status}]: ${err.response.data.message}`);
        });
    }, []);

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
        const newErrors = findLiveFormErrors(e.target.form, e);
    }

    /**
   * users form LIVE validation
   * @param {*} form 
   * @param {*} event 
   * @returns 
   */
    const findLiveFormErrors = (form, event) => {
        const { projectName, projectNumber, projectID, projectType } = form;
        const eventElement = event.target.id;
        const newErrors = {};

        // projectID errors: projectID cannot be empty, cannot be negative
        if (eventElement === 'projectID' && (!projectID.value || projectID.value === '' || !projectID.value > 0 || !projectID.value.match(projectIDFormat))) {
            newErrors.projectID = 'Die Projekt ID ist ein Pflichtfeld. Bitte geben Sie eine positive Ganzzahl als Projekt ID ein.';
        }

        // projectName errors: projectName cannot be empty
        if (eventElement === 'projectName' && (!projectName.value || projectName.value === '' || !projectName.value.match(projectNameFormat))) {
            newErrors.projectName = 'Der Projektname ist ein Pflichtfeld. Bitte geben Sie einen Projektnamen ohne Sonderzeichen ein.';
        }

        // projectNumber errors: projectNumber cannot be empty
        if (eventElement === 'projectNumber' && (!projectNumber.value || projectNumber.value === '')) {
            newErrors.projectNumber = 'Die Projektnummer ist ein Pflichtfeld. Bitte geben Sie eine Projektnummer ein.';
        }

        // projectType errors: projectType cannot be empty
        if (eventElement === 'projectType' && (!projectType.value || projectType.value === '')) {
            newErrors.projectNumber = 'Der Projekttyp ist ein Pflichtfeld. Bitte geben Sie eine Projektnummer ein.';
        }

        setErrors(newErrors);
        return newErrors
    }

    const checkFormValidity = (newProject, responseErrors) => {
        const newErrors = {};

        if (newProject) {
            // projectID errors: projectID cannot be empty
            if (!newProject.projectID || newProject.projectID === '' || !newProject.projectID > 0 || !newProject.projectID.toString().match(projectIDFormat)) {
                newErrors.projectID = 'Die Projekt ID ist ein Pflichtfeld. Bitte geben Sie eine positive Ganzzahl als Projekt ID ein.';
            }

            // projectName errors: projectName cannot be empty
            if (!newProject.projectName || newProject.projectName === '' || !newProject.projectName.match(projectNameFormat)) {
                newErrors.projectName = 'Der Projektname ist ein Pflichtfeld. Bitte geben Sie einen Projektnamen ohne Sonderzeichen ein.';
            }

            // projectNumber errors: projectNumber cannot be empty
            if (!newProject.projectNumber || newProject.projectNumber === '') {
                newErrors.projectNumber = 'Die Projektnummer ist ein Pflichtfeld. Bitte geben Sie eine Projektnummer ein.';
            }

            // projectNumber errors: projectNumber cannot be empty
            if (!newProject.projectOffer || newProject.projectOffer === '') {
                newErrors.projectOffer = 'Der Projekt Angebotstyp ist ein Pflichtfeld. Bitte geben Sie einen Projekt Angebotstypen an.';
            }

            // projectType errors: projectType cannot be empty
            if (!newProject.projectType || newProject.projectType === '') {
                newErrors.projectType = 'Der Projekttyp ist ein Pflichtfeld. Bitte geben Sie einen Projekttypen an.';
            }
        }

        if (responseErrors) {
            if (responseErrors.projectID) {
                newErrors.projectID = responseErrors.projectID;
            }

            if (responseErrors.projectName) {
                newErrors.projectName = responseErrors.projectName;
            }

            if (responseErrors.projectNumber) {
                newErrors.projectNumber = responseErrors.projectNumber;
            }

            if (responseErrors.projectType) {
                newErrors.projectType = responseErrors.projectType;
            }
        }

        setErrors(newErrors);
        return newErrors;
    }

    async function createNewProject(project) {
        createProject(project, userToken)
            .then((res) => {
                responseNotifyHandling(res, res.status, `Projekt: [${project.projectNumber}] wurde erstellt`);
                setShow(false);
                getData()
                navigate('/admin/projects');
            })
            .catch((err) => {
                console.log(err)
                responseNotifyHandling(err.response, err.response.status, `Fehler [${err.response.status}] beim erstellen von Projekt ${project.projectNumber}. `)
                checkFormValidity(null, err.response.data.message);
            })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const newErrors = checkFormValidity(newProject);
        //if form is not valid cancel submit
        if (Object.keys(newErrors).length === 0) {
            //set validate status on true

            if (onEdit === "1") {
                updateProject(newProject, userToken).then((res) => {
                    if (res.status == 200) {
                        getData();

                        responseNotifyHandling(res, res.status, `Projekt: [${newProject.projectNumber}] wurde aktualisiert`);

                        setShow(false);
                        show = false;
                    }
                })
                    .catch((err) => {
                        checkFormValidity(null, err.response.data.message);
                    });
            } else {
                createNewProject(newProject);
            }
        }
    };

    return (
        <Form className='mt-4' noValidate validated={validated} onSubmit={handleSubmit}>
            <FloatingLabel
                controlId="projectID"
                label={"Projekt ID"}
                className="mb-3">
                <Form.Control required type="number" defaultValue={newProject.projectID} placeholder="Projekt ID" isInvalid={!!errors.projectID}
                    onChange={(e) => {
                        setNewProject({ ...newProject, projectID: e.target.value });
                        handleChange(e)
                    }
                    } />
                <Form.Control.Feedback type="invalid">
                    {errors.projectID}
                </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel
                controlId="projectName"
                label="Projektname"
                className="mb-3">
                <Form.Control required type="text" defaultValue={newProject.projectName} placeholder="Projektname" isInvalid={!!errors.projectName}
                    onChange={(e) => {
                        setNewProject({ ...newProject, projectName: e.target.value });
                        handleChange(e)
                    }
                    } />
                <Form.Control.Feedback type="invalid">
                    {errors.projectName}
                </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel
                controlId="projectNumber"
                label="Projektnummer"
                className="mb-3">
                <Form.Control required type="text" defaultValue={newProject.projectNumber} placeholder="Projektnummer" isInvalid={!!errors.projectNumber}
                    onChange={(e) => {
                        setNewProject({ ...newProject, projectNumber: e.target.value });
                        handleChange(e)
                    }
                    } />
                <Form.Control.Feedback type="invalid">
                    {errors.projectNumber}
                </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel
                controlId="projectAdminDescription"
                label="Projektbeschreibung"
                className="mb-3">
                <Form.Control type="text" defaultValue={newProject.projectAdminDescription} placeholder="Beschreibung" isInvalid={!!errors.projectAdminDescription}
                    onChange={(e) => {
                        setNewProject({ ...newProject, projectAdminDescription: e.target.value });
                        handleChange(e);
                    }
                    } />
            </FloatingLabel>
            <Form.Group className="mb-3" controlId="formBasicProject">
                <div key={projectOfferTypes}>
                    <Form.Select
                        defaultValue={onEdit === "1" ? newProject.projectOffer : selectedProjectOfferTypes}
                        isInvalid={!!errors.projectOffer}
                        onChange={(e) => {
                            setNewProject({ ...newProject, projectOffer: e.target.value });
                            setSelectedProjectOfferTypes(parseInt(e.target.value))
                            handleChange(e)
                        }
                        }>
                        <option disabled={true} value="">
                            --Angebotstyp zuweisen--
                        </option>
                        {projectOfferTypes.length > 0 ? (
                            projectOfferTypes.map((projectOfferTypes, index) => {
                                return (
                                <option key={index} value={projectOfferTypes._id}>{projectOfferTypes.projectOfferType}</option>
                                )
                            }
                            )) : (
                            <option disabled={true} value="">
                                Keine Angebotstypen gefunden
                            </option>
                        )}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        {errors.projectOffer}
                    </Form.Control.Feedback>
                </div>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicProject">
                <div key={projectTypes}>
                    <Form.Select
                        defaultValue={onEdit === "1" ? newProject.projectType._id : selectedProjectOfferTypes}
                        isInvalid={!!errors.projectType}
                        onChange={(e) => {
                            setNewProject({ ...newProject, projectType: e.target.value });
                            setSelectedProjectTypes(parseInt(e.target.value))
                            handleChange(e)
                        }
                        }>
                        <option disabled={true} value="">
                            --Projekttyp zuweisen--
                        </option>
                        {projectTypes.length > 0 ? (
                            projectTypes.map((projectTypes, index) => (
                                <option key={index} value={projectTypes._id}>{projectTypes.projectType} {projectTypes.projectTypeDescription}</option>
                            )
                            )) : (
                            <option disabled={true} value="">
                                Keine Projekttypen gefunden
                            </option>
                        )}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        {errors.projectType}
                    </Form.Control.Feedback>
                </div>
            </Form.Group>
            <div className="button-row">
                <Button variant="secondary" style={{ marginRight: '3.25em' }} onClick={(e) => {
                    setShow(false);
                }}>
                    Abbrechen
                </Button>
                <Button variant="primary" type="submit">
                    {onEdit === '1' ? "Projekt speichern" : "Projekt anlegen"}
                </Button>
            </div>
        </Form>
    );

};

export default ProjectForm