import React, { useEffect, useState } from "react";
import Headline from "../../components/Headline";
import { useDispatch, useSelector } from "react-redux";
import { getFormConfig, getToken } from "../../features/user/userSlice";
import * as Icons from "react-icons/fa";
import { getUserDetails } from "../../features/user/userActions";
import { responseNotifyHandling } from "../../components/Error";
import { updateUserProject } from "../../features/admin/projectManagementActions";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { Button, Tab, Tabs } from "react-bootstrap";
import GenericForm from "./GenericForm";
import { getInitDatabaseObject } from "../../config/configEnums";
import { FormState, setFormState } from "../../features/form/formSlice";
import apiConfig from "../../config/config";
import axios from "axios";
import { createObject, updateObject } from "../../features/user/objectDataManagement";

function FormPage() {
    const fullFormConfig = useSelector(getFormConfig);
    const userInfo = useSelector(state => state.user.userInfo);

    const findFormConfig = () => {
        const urlSplit = window.location.href.split('/');
        let configName = urlSplit[urlSplit.length - 1];
        return fullFormConfig[configName];
    }

    const userToken = useSelector(getToken);
    const dispatch = useDispatch();
    const userProject = userInfo.userProject;

    const [formConfig, setFormConfig] = useState(findFormConfig())
    const [initCurrentForm, setInitCurrentForm] = useState(getInitDatabaseObject(formConfig))

    const config = {
        headers: {
            Authorization: `Bearer ${userToken}`,
        },
    };

    const [form, setForm] = useState(initCurrentForm);
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = () => {
        const newObject = { ...form }
        if (form._id) {
            updateObject(newObject, config, formConfig)
                .then((res) => {
                    getData();
                    dispatch(setFormState(FormState.UNCHANGED));
                    setShowModal(false);
                    responseNotifyHandling(res, res.status, `Das Projekt [${userInfo.userProject.projectName}] wurde aktualisiert`);
                })
        }
        else {
            newObject.project = userInfo.userProject._id;
            createObject(newObject, config, formConfig)
                .then((res) => {
                    if (res.status === 201) {
                        getData();
                        dispatch(setFormState(FormState.UNCHANGED));
                        setShowModal(false);
                        responseNotifyHandling(res, res.status, `Das Projekt [${userInfo.userProject.projectName}] wurde aktualisiert`);
                    }
                })
                .catch((err) => {
                    responseNotifyHandling(err.response, err.response.status, err.response.message)
                })
        }
    }

    useEffect(() => {
        getData()
    }, [])

    async function getData() {
        const objects = {
            formConfig: formConfig
        }

        await axios.post(`${apiConfig.rest}/user/data/getFormPageObject/${userInfo.userProject._id}`, { objects }, config)
            .then((res) => {
                if (res.status === 200) {
                    setForm(res.data);
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <div className="project-data-root">
            <ConfirmationDialog
                showModal={showModal}
                confirmModal={handleSubmit}
                hideModal={() => setShowModal(false)}
                message={"Soll ihr Projekt aktualisiert werden?"}
                title={"Projekt aktualisieren"}
                btnCancelTxt={"Abbrechen"}
                btnSubmitTxt={"Speichern"}
                btnSubmitColor={"success"}
            />
            <Headline name={`[${userProject.projectID}] ${userProject.projectName} - ${userProject.projectNumber}`} />
            <div>
                <Button
                    variant="success"
                    className="save mb-4"
                    onClick={() => setShowModal(true)}>
                    <Icons.FaSave style={{ transform: "translate(-0.25rem, -0.09rem)" }} />
                    Speichern
                </Button>
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
                                databaseObject={form}
                                setDatabaseObject={setForm}
                            />
                        </Tab>
                    ))}
                </Tabs>
            ) : (
                <GenericForm
                    formConfig={formConfig}
                    databaseObject={form}
                    setDatabaseObject={setForm}
                />
            )}

        </div>
    )
}

export default FormPage;