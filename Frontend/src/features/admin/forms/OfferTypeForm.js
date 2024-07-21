//import node modules and react modules
import { Form, Button, FloatingLabel } from 'react-bootstrap';
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
//Import CSS
import '../../../css/pages/adminspace.css';
import '../../../css/components/forms.css';
import '../../../css/App.css';
//import DWBO Sources
import { updateOfferType } from '../offertypeManagementActions';
import { responseNotifyHandling } from '../../../components/Error';
import { getToken } from '../../user/userSlice';

const OfferTypeForm = ({ show, setShow, editOfferType, getData }) => {
    const userToken = useSelector(getToken);

    const [errors, setErrors] = useState({});
    const [validated, setValidated] = useState(false);

    let initCurrentOfferType = {
        _id: editOfferType._id,
        projectOfferTypeID: editOfferType.projectOfferTypeID,
        projectOfferType: editOfferType.projectOfferType,
        isActive: editOfferType.isActive
    }

    let initForm = {
        offerTypeID: editOfferType.projectOfferTypeID,
        offerTypeName: editOfferType.projectOfferType
    }

    // updated Offer Type
    const [newOfferType, setNewOfferType] = useState(initCurrentOfferType);
    const [form, setForm] = useState(initForm);

    //validation regexpressions
    const offerNameFormat = /^[a-zA-Z0-9\x7f-\xff- ]+$/;
    const offerIDFormat = /^[0-9]*$/;

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

        //update error messages
        setErrors(newErrors);
    }

    /**
   * users form LIVE validation
   * @param {*} form 
   * @param {*} event 
   * @returns 
   */
    const findLiveFormErrors = (form, event) => {
        const { offerTypeName, offerTypeID } = form;
        const eventElement = event.target.id;
        const newErrors = {};

        // offerTypeName errors: offerTypeName cannot be empty
        if (eventElement === 'offerTypeName' && (!offerTypeName.value || offerTypeName.value === '' || !offerTypeName.value.match(offerNameFormat))) {
            newErrors.offerTypeName = 'Der Angebotstypname ist ein Pflichtfeld. Bitte geben Sie einen Angebotstypnamen ohne Sonderzeichen ein.';
        }

        // offerTypeID errors: offerTypeID cannot be empty
        if (eventElement === 'offerTypeID' && (!offerTypeID.value || offerTypeID.value === ''  || !offerTypeID.value > 0 || !offerTypeID.value.match(offerIDFormat))) {
            newErrors.offerTypeID = 'Die Angebotstyp ID ist ein Pflichtfeld. Bitte geben Sie eine positive Ganzzahl als Angebotstyp ID ein.';
        }

        return newErrors
    }

    const checkFormValidity = (responseErrors) => {
        const newErrors = {};
        const { offerTypeName, offerTypeID } = form;

        console.log(typeof offerTypeID);

        // offerTypeName errors: offerTypeName cannot be empty
        if (!offerTypeName || offerTypeName === '' || !offerTypeName.match(offerNameFormat)) {
            newErrors.offerTypeName = 'Der Angebotstypname ist ein Pflichtfeld. Bitte geben Sie einen Angebotstyp Namen ohne Sonderzeichen ein.';
        }

        // offerTypeID errors: offerTypeID cannot be empty
        if (!offerTypeID || offerTypeID === '' || !offerTypeID > 0 || !offerTypeID.toString().match(offerIDFormat) ) {
            newErrors.offerTypeID = 'Die Angebotstyp ID ist ein Pflichtfeld. Bitte geben Sie eine positive Ganzzahl als Angebotstyp ID ein.';
        }

        if (responseErrors) {
            if (responseErrors.offerTypeName) {
                newErrors.offerTypeName = responseErrors.offerTypeName;
            }

            if (responseErrors.offerTypeID) {
                newErrors.offerTypeID = responseErrors.offerTypeID;
            }
        }

        setErrors(newErrors);
        return newErrors;
    }

    // updates Offer Type and waits for Backend response
    async function awaitOfferTypeUpdate() {
        updateOfferType(newOfferType, userToken)
            .then((res) => {
                // rerenders the table, if the update was a success
                if (res.status == 201) {
                    getData();

                    responseNotifyHandling(res, res.status, `Projekt: [${newOfferType.projectOfferType}] wurde aktualisiert`);
                    setShow(false);
                    show = false;
                }
            })
            .catch((error) => {
                checkFormValidity(error.response.data.message);
            });
    }


    const handleSubmit = (event) => {
        const newErrors = checkFormValidity();

        if (Object.keys(newErrors).length === 0) {
            awaitOfferTypeUpdate();
        }

        event.preventDefault();
        event.stopPropagation();
    };

    return (
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <FloatingLabel
                controlId="offerTypeID"
                label="ID"
                className="mb-3">
                <Form.Control required type="number" defaultValue={editOfferType.projectOfferTypeID} placeholder="ID" isInvalid={!!errors.offerTypeID}
                    onChange={(e) => {
                        setNewOfferType({ ...newOfferType, projectOfferTypeID: e.target.value });
                        handleChange(e)
                    }
                    } />
                <Form.Control.Feedback type="invalid">
                    {errors.offerTypeID}
                </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel
                controlId="offerTypeName"
                label="Name"
                className="mb-3">
                <Form.Control required type="text" defaultValue={editOfferType.projectOfferType} placeholder="Name" isInvalid={!!errors.offerTypeName}
                    onChange={(e) => {
                        setNewOfferType({ ...newOfferType, projectOfferType: e.target.value });
                        handleChange(e)
                    }
                    } />
                <Form.Control.Feedback type="invalid">
                    {errors.offerTypeName}
                </Form.Control.Feedback>
            </FloatingLabel>
            <div className="button-row">
                <Button variant="secondary" style={{ marginRight: '3.25em' }} onClick={(e) => {
                    setShow(false);
                }}>
                    Abbrechen
                </Button>
                <Button variant="primary" type="submit">
                    Angebotstyp speichern
                </Button>
            </div>
        </Form>
    );

};

export default OfferTypeForm;