//import node modules and react modules
import axios from 'axios';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Form, Dropdown, Button, Tabs, Tab } from 'react-bootstrap';
import { registerLocale, setDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import de from 'date-fns/locale/de';
import * as Icons from "react-icons/fa";
import { AiFillFilter } from "react-icons/ai"
import { BsFillInfoCircleFill } from 'react-icons/bs';
//import DWBO sources
import Headline from '../../components/Headline';
/* import { selectConfig } from './selectboxConfig' */
import apiConfig from '../../config/config';
import { responseNotifyHandling } from '../../components/Error'
import { createObject, updateObject, deleteObject } from '../../features/user/objectDataManagement'
import ConfirmationDialog from '../../components/ConfirmationDialog';
import { Typeahead } from 'react-bootstrap-typeahead';
import { parseISO } from 'date-fns';
import { Radio, RadioGroup, FormControl, FormControlLabel, FormLabel } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { getSelectedClient, setSelectedClient } from '../../features/client/clientSlice';
import { getFormState, setFormState, FormState, getErrors, setErrors, setFormCheckDone, getFormCheckDone, FormCheckDoneOptions, setCurrentAge } from '../../features/form/formSlice';
import { getFormConfig, getToken, getUser } from '../../features/user/userSlice';
import { MdClear } from 'react-icons/md';
import { containerTypes, getInitDatabaseObject } from '../../config/configEnums';
import GenericForm from './GenericForm';

registerLocale('de', de)
setDefaultLocale('de')

const FormMode = {
    Create: "Create",
    Update: "Update"
}

function SearchFieldFormPage() {
    const currentUser = useSelector(getUser);
    const fullFormConfig = useSelector(getFormConfig);

    const findFormConfig = () => {
        const urlSplit = window.location.href.split('/');
        let configName = urlSplit[urlSplit.length - 1];
        return fullFormConfig[configName];
    }

    const [formConfig, setFormConfig] = useState(findFormConfig());
    const [initCurrentObject, setInitCurrentObject] = useState(getInitDatabaseObject(formConfig))
    const [newObject, setNewObject] = useState(initCurrentObject);

    const [allObjects, setAllObjects] = useState([]);
    const [filterObjectList, setFilterObjectList] = useState([]);
    const [updatedObject, setUpdatedObject] = useState(initCurrentObject);

    const [showModal, setShowModal] = useState(false);
    const [filterSelect, setFilterSelect] = useState([]);
    const [filterTableSelect, setFilterTableSelect] = useState([]);
    const [confirmFor, setConfirmFor] = useState('');
    const [titleModal, setTitleModal] = useState('');
    const [messageModal, setMessageModal] = useState('');
    const [btnCancelModal, setBtnCancelModal] = useState('');
    const [btnSubmitModal, setBtnSubmitModal] = useState('');
    const [btnSubmitColor, setBtnSubmitColor] = useState('danger');

    const [formMode, setFormMode] = useState(FormMode.Create);
    const [radioValue, setRadioValue] = useState(null);
    const [loading, setLoading] = useState(false);

    const tableSelectConfig = formConfig.tableSelectConfig;

    let filterObjects = [];

    const tableSelectObject = useSelector(getSelectedClient);
    const formState = useSelector(getFormState);
    const errors = useSelector(getErrors);
    const formCheckDone = useSelector(getFormCheckDone);

    const dispatch = useDispatch();

    const userToken = useSelector(getToken);

    const config = {
        headers: {
            Authorization: `Bearer ${userToken}`,
        },
    }

    //fetched offer type data by db
    useEffect(() => {
        getObjectData();
        dispatch(setFormState(FormState.UNCHANGED))
        dispatch(setErrors({}));

        return () => {
            dispatch(setCurrentAge(""));
        }
    }, []);

    useLayoutEffect(() => {
        let tempFilterSelect = [];
        let tempFilterTableSelect = [];
        const tempFormConfig = { ...formConfig }
        if (!formConfig.tabs) {
            tempFormConfig.containers = undefined;
            tempFormConfig.tabs = [{ ...formConfig }];
        }

        tempFormConfig.tabs.forEach((formConfig => {
            for (let i = 0; i < formConfig.containers.length; i++) {
                if (formConfig.containers[i].containerType === containerTypes.GENERICFORM || formConfig.containers[i].containerType === containerTypes.ACCORDION) {
                    const filterObjects = formConfig.containers[i].elements.filter(obj => obj.filterIf || obj.filterNot);
                    if (filterObjects.length > 0) {
                        tempFilterSelect = tempFilterSelect.concat(filterObjects);
                    }
                }
                else if (formConfig.containers[i].containerType === containerTypes.ADDROWTABLECONTAINER) {
                    formConfig.containers[i].tables.forEach((obj) => {
                        obj.elements.forEach(element => {
                            let tempConfigElement;
                            if (element.filterIf) {
                                tempConfigElement = tableSelectConfig[obj.tableName][element.value].find(search => search.id === element.filterIf);
                            }
                            else if (element.filterNot) {
                                tempConfigElement = tableSelectConfig[obj.tableName][element.value].find(search => search.id === element.filterNot);
                            }

                            if (tempConfigElement) {
                                const tempFilterTableRow = { ...element, tableName: obj.tableName, containerType: formConfig.containers[i].containerType, selectText: tempConfigElement.value };
                                tempFilterTableSelect.push(tempFilterTableRow);
                            }
                        });
                    })
                }
            }
        }))
        setFilterSelect(tempFilterSelect);
        setFilterTableSelect(tempFilterTableSelect);
    }, []);

    // operations after form is checked
    useEffect(() => {
        if (formCheckDone === FormCheckDoneOptions.CHECKED) {
            if (Object.keys(errors).length === 0) {
                formMode === FormMode.Create ? setConfirmFor("CREATE") : setConfirmFor("UPDATE")

                //confirm dialog
                setMessageModal(`Soll ${formConfig.objectName} gespeichert werden?`);
                setTitleModal("Ungesicherte Änderungen");
                setBtnCancelModal("Abbrechen");
                setBtnSubmitModal("Speichern");
                setBtnSubmitColor("success");
                setShowModal(true);
            }

            dispatch(setFormCheckDone(""));
        }
    }, [formCheckDone]);

    useEffect(() => {
        if (tableSelectObject !== null) {
            if (newObject?._id === tableSelectObject._id) {
                dispatch(setSelectedClient(null));
            }
        }
    }, [newObject]);

    useEffect(() => {
        const handler = event => {
            event.preventDefault();
            event.returnValue = '';
        };
        // if the form is NOT unchanged, then set the onbeforeunload
        if (formState !== FormState.UNCHANGED) {
            window.addEventListener('beforeunload', handler);
            // clean it up, if the dirty state changes
            return () => {
                window.removeEventListener('beforeunload', handler);
            };
        }
        // since this is not dirty, don't do anything
        return () => { };
    }, [formState]);

    async function getObjectData() {
        const objects = { formConfig: formConfig };
        setLoading(true);
        document.body.style.cursor = "progress";
        await axios.post(`${apiConfig.rest}/user/data/listObjects`, { objects }, config).then((response) => {
            setAllObjects(response.data);
            if (tableSelectObject && Object.keys(newObject).every(element => Object.keys(tableSelectObject).includes(element))) {
                handleSelectObject(tableSelectObject, true);
            }
            setLoading(false);
            document.body.style.cursor = "auto";
        }).catch((err) => {
        });

        await axios.post(`${apiConfig.rest}/user/data/getObject`, { objects }, config).then((response) => {
            setFilterObjectList(response.data);
        }).catch((err) => {
        });
    }

    function handleChange(e, check) {
        dispatch(setFormState(FormState.MODIFIED));
        if (!check) {
            setNewObject({ ...newObject, [e.target.name]: e.target.value });
        }
        else {
            setNewObject({ ...newObject, [e.target.name]: e.target.checked });
        }
    }

    function calcAgeFormula(birthday) {
        var todayDate = new Date();
        var age = todayDate.getFullYear() - birthday.getFullYear();
        var m = todayDate.getMonth() - birthday.getMonth();
        if (m < 0 || (m === 0 && todayDate.getDate() < birthday.getDate())) {
            age--;
        }

        return age;
    }

    const objectCreate = () => {
        let createThisObject = { ...newObject, project: currentUser.userProject._id, collaborator: currentUser._id }

        createObject(createThisObject, config, formConfig)
            .then((res) => {
                if (res.status === 201) {
                    responseNotifyHandling(res, res.status,`${formConfig.objectName} wurde erstellt`);
                    handleSelectObject(res.data, true);
                    getObjectData();
                    dispatch(setFormState(FormState.UNCHANGED));
                }
            })
            .catch((err) => {
                responseNotifyHandling(err.response, err.response.status, `Fehler [${err.response.status}] beim erstellen von ${formConfig.objectName}.`);
            });
    }

    const objectUpdate = () => {

        updateObject(newObject, config, formConfig)
            .then((res) => {

                if (res.status === 200) {
                    responseNotifyHandling(res, res.status, `${formConfig.objectName} wurde aktualisiert`);
                    getObjectData();
                    setUpdatedObject(newObject);
                    setNewObject(newObject);
                    dispatch(setFormState(FormState.UNCHANGED));
                }
            })
            .catch((err) => {
                responseNotifyHandling(err.response, err.response.status, `Fehler [${err.response.status}] beim aktualisieren von ${formConfig.objectName}.`);
            });
    }

    const objectDelete = () => {

        deleteObject(newObject, config, formConfig)
            .then((res) => {
                if (res.status == 204) {
                    responseNotifyHandling(res, res.status, `${formConfig.objectName} wurde gelöscht`);
                    dispatch(setFormState(FormState.UNCHANGED));
                    resetForm();
                }
            })
            .catch((err) => {
                responseNotifyHandling(err.response, err.response.status, `Fehler [${err.response.status}] beim löschen von ${formConfig.objectName}.`)
            });
    }

    const resetForm = () => {
        getObjectData();
        setNewObject(initCurrentObject);
        setUpdatedObject(initCurrentObject);
        dispatch(setCurrentAge(""));
        setFormMode(FormMode.Create);
    }

    const handleDeleteObjectData = (e) => {
        setConfirmFor("DELETE");

        setMessageModal(`Soll ${formConfig.objectName} gelöscht werden?`);
        setTitleModal(`${formConfig.objectName} löschen`);
        setBtnCancelModal("Abbrechen");
        setBtnSubmitModal("Löschen");
        setBtnSubmitColor("danger");
        setShowModal(true);
    }

    async function handleSelectObject(element, create) {
        let object;
        if (create) {
            object = element;
        }
        else {
            const objects = { formConfig: formConfig };
            await axios.post(`${apiConfig.rest}/user/data/getObject/${element._id}`, { objects }, config).then((response) => {
                if (response.status === 200) {
                    object = response.data
                }
            }).catch((err) => {
                responseNotifyHandling(err.response, err.response.status, `Fehler [${err.response.status}]: Objekte konnten nicht gefunden werden.`)
            });
        }

        setUpdatedObject(object);
        setNewObject(object);
        if (object?.birthday) {
            dispatch(setCurrentAge(calcAgeFormula(parseISO(object.birthday))));
        }
        setFormMode(FormMode.Update);
        dispatch(setErrors({}));
        console.log(object)
    }

    const handleRadioClick = (e, field) => {
        if (field.value === radioValue?.value) {
            setRadioValue(null);
        }
        else {
            setRadioValue(field);
        }
    }

    const closeModal = () => {
        setShowModal(false);
    }

    const handleConfirmModal = () => {
        dispatch(setFormState(FormState.SAVING));
        switch (confirmFor) {
            case "CREATE":
                objectCreate();
                break;
            case "UPDATE":
                objectUpdate();
                break;
            case "DELETE":
                objectDelete();
                break;
            default:
                //TODO
                break;
        }
        closeModal();
    }

    function getFilteredObjects() {
        if (radioValue) {
            let objectsFiltered;

            if (radioValue.containerType === containerTypes.ADDROWTABLECONTAINER) {
                objectsFiltered = filterObjectList.filter(object => {
                    for (let i = 0; i < object[radioValue.tableName]?.length; i++) {
                        if (radioValue.filterIf) {
                            if (object[radioValue.tableName][i][radioValue.value] === radioValue.filterIf) {
                                return true;
                            }
                        }
                        else if (radioValue.filterNot) {
                            if (object[radioValue.tableName][i][radioValue.value] === radioValue.filterNot) {
                                return false;
                            }
                        }
                    }
                    return radioValue.filterIf ? false : true;
                })
            }
            else {
                objectsFiltered = filterObjectList.filter(object => {
                    return object[radioValue.value] === radioValue.filterIf;
                })
            }

            filterObjects = objectsFiltered;
            return objectsFiltered;
        }
    }

    function typeaheadPlaceholder() {
        if (loading) {
            return "";
        }
        else if (allObjects.length === 0) {
            return "Keine Objekte gefunden";
        }
        else if (radioValue && filterObjects.length === 0) {
            return "Keine Objekte gefunden";
        }
        return `-- ${formConfig.objectName} auswählen --`;
    }

    return (
        <div style={{ width: '100%' }}>
            <ConfirmationDialog
                showModal={showModal}
                confirmModal={() => handleConfirmModal()}
                hideModal={() => closeModal()}
                message={messageModal}
                title={titleModal}
                btnCancelTxt={btnCancelModal}
                btnSubmitTxt={btnSubmitModal}
                btnSubmitColor={btnSubmitColor}
            />
            <Headline name='Datenerfassung' />
            <Form onSubmit={(e) => {
                e.preventDefault();
            }}>
                <div className='mt-4' style={{ width: '100%' }}>
                    <h5 className='mt-3 mb-4 mx-auto p-0' style={{ width: "fit-content" }}>{formMode === FormMode.Create ? `${formConfig.objectName} erstellen` : `${formConfig.objectName} aktualisieren`}</h5>
                    <div className='d-flex p-0 mx-auto' style={{ width: "100%" }}>
                        <div className='me-3'>
                            <Button
                                onClick={() => dispatch(setFormCheckDone(FormCheckDoneOptions.CHECKING))}
                                variant="success">
                                <Icons.FaSave
                                    style={{
                                        margin: "0 0.24rem 0.15rem 0"
                                    }} />Speichern</Button>
                        </div>
                        {formMode === FormMode.Update &&
                            <div>
                                <Button
                                    variant='danger'
                                    onClick={(e) => handleDeleteObjectData(e)}><Icons.FaTrash size={15} style={{ transform: 'translate(-0.2rem, -0.13rem)' }} />Datensatz löschen</Button>
                            </div>
                        }
                        {formConfig.filter &&
                            <div className='ms-auto d-flex'>
                                {radioValue &&
                                    <Button
                                        className='clear-filter'
                                        onClick={() => setRadioValue(null)}>
                                        <MdClear size="19" style={{ transform: "translate(-0.25rem, -0.09rem)" }} />
                                        Filter entfernen
                                    </Button>
                                }
                                <Dropdown>
                                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                        <AiFillFilter style={{ transform: 'translate(-0.2rem, -0.09rem)' }} color='white' />Filter
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <FormControl id="filter-dropdown" component="fieldset">
                                            <FormLabel component="legend"><span>Tabellen Filter</span></FormLabel>
                                            <RadioGroup
                                                id="filter-service-container"
                                                aria-label='Tabellen Filter'
                                                name="Tabellen Filter"
                                            >
                                                {filterTableSelect.map((field, i) => {
                                                    return (
                                                        <FormControlLabel
                                                            key={i}
                                                            label={field.filterIf ? `Mit ${field.selectText} in ${field.name} im Berichtsjahr` : `Ohne ${field.selectText} in ${field.name} im Berichtsjahr`}
                                                            value={field.value}
                                                            control={<Radio size='small' checked={radioValue?.value === field.value} onClick={(e) => handleRadioClick(e, field)} />}
                                                        />
                                                    )
                                                })
                                                }
                                            </RadioGroup>
                                            <FormLabel component="legend"><span>Keine Angabe</span></FormLabel>
                                            <RadioGroup
                                                id="filter-check-container"
                                                aria-label='keine angabe'
                                                name="keine angabe"
                                            >
                                                {filterSelect.map((field, i) => {
                                                    return (<FormControlLabel
                                                        key={i}
                                                        label={field.name}
                                                        value={field.value}
                                                        id={`${field.name}Check`}
                                                        control={<Radio size='small' checked={radioValue?.value === field.value} onClick={(e) => handleRadioClick(e, field)} />}
                                                    />)
                                                })}
                                            </RadioGroup>
                                        </FormControl>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        }
                    </div>
                    <div className='col'>
                        <Form.Group>
                        </Form.Group>
                    </div>
                </div>
                <div style={{ margin: "1.9rem 0 1.7rem 0" }}>
                    {radioValue &&
                        <p id="filter-info-text"><BsFillInfoCircleFill size="15" style={{ transform: "translate(-0.25rem, -0.09rem)" }} />Filter aktiv</p>
                    }
                    <div style={{ height: "2.7rem", width: "100%", margin: "0 auto", position: "relative" }} className={`row ${radioValue ? "filter-active" : ""}`}>
                        <Typeahead
                            key={Object.values(updatedObject)}
                            id="clientList"
                            controlId="clientList"
                            options={radioValue ? getFilteredObjects() : allObjects}
                            onChange={(element) => {
                                if (element.length !== 0) {
                                    handleSelectObject(element[0]);
                                    setFormMode(FormMode.Update);
                                }
                            }}
                            onInputChange={(element) => {
                                if (element === "") {
                                    resetForm();
                                }
                            }}
                            labelKey={(option) => {
                                console.log(option)
                                if (typeof formConfig.labelKey === "string") {
                                    return option[formConfig.labelKey]
                                }
                                else if (Array.isArray(formConfig.labelKey)) {
                                    if (option[formConfig.labelKey[1]]) {
                                        return `${option[formConfig.labelKey[0]]}, ${option[formConfig.labelKey[1]]}`;
                                    }
                                    else {
                                        return option[formConfig.labelKey[0]];
                                    }
                                }
                            }}
                            defaultSelected={[updatedObject]}
                            placeholder={typeaheadPlaceholder()}
                            disabled={allObjects.length === 0}
                        />
                        {(typeof formConfig.labelKey === "string" ? updatedObject[formConfig.labelKey] : updatedObject[formConfig.labelKey[0]]) &&
                            <Button
                                style={{ position: "absolute", width: "fit-content", right: 10, top: 2.2 }}
                                className='clear-filter'
                                onClick={() => resetForm()}>
                                <MdClear size="23" />
                            </Button>
                        }
                    </div>
                </div>
                {formConfig.tabs ? (
                    <Tabs
                        defaultActiveKey={formConfig.tabs[0].key}
                        className="mb-3"
                        justify
                    >
                        {formConfig.tabs.map((tab) => (
                            <Tab key={tab.key} eventKey={tab.key} title={tab.name}>
                                <GenericForm
                                    formConfig={tab}
                                    databaseObject={newObject}
                                    setDatabaseObject={setNewObject}
                                />
                            </Tab>
                        ))}
                    </Tabs>
                ) : (
                    <GenericForm
                        formConfig={formConfig}
                        databaseObject={newObject}
                        setDatabaseObject={setNewObject}
                    />
                )}
            </Form>
        </div>
    );
}

export default SearchFieldFormPage;