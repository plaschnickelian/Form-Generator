import { useDispatch, useSelector } from "react-redux";
import { containerTypes, inputTypes, specialTypes, containerLayouts } from "../../config/configEnums";
import { Form, Accordion, FormLabel } from "react-bootstrap";
import { Box, Select, FormControl, InputLabel, MenuItem, Button, TextField, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { getYear, parseISO } from 'date-fns';
import range from "lodash/range";
import 'dayjs/locale/de';
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe'
import { MdClear } from "react-icons/md";
import dayjs from 'dayjs';
import { setFormState, FormState, setErrors, getFormCheckDone, setFormCheckDone, FormCheckDoneOptions, getCurrentAge, setCurrentAge, getErrors } from "../../features/form/formSlice";
import { toast } from 'react-toastify';
import { useEffect, useState, memo } from "react";
import { useLayoutEffect } from "react";
import AddRowTable from "./AddRowTable";
import BasicTable from "./BasicTable";
import { getUser } from "../../features/user/userSlice";
const _ = require("lodash")
var isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
var isSameOrAfter = require('dayjs/plugin/isSameOrAfter')
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

let thisExtraColumns;
let requiredDependencies = [];

let wrongDateInput = [];

const GenericForm = ({ formConfig, databaseObject, setDatabaseObject }) => {
    const user = useSelector(getUser);

    const [sortedFormContainers, setSortedFormContainers] = useState([...formConfig.containers].sort((a, b) => (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0)));
    const [genericFormContainer, setGenericFormContainer] = useState(sortedFormContainers.find(obj => obj.containerType === containerTypes.GENERICFORM));
    const [checkRemoveField, setCheckRemoveField] = useState(genericFormContainer?.elements?.find(element => element.specialTypeField === specialTypes.WITHCHECKREMOVE));
    const [tableSelectConfig, setTableSelectConfig] = useState(formConfig.tableSelectConfig);

    const formCheckDone = useSelector(getFormCheckDone);
    const errors = useSelector(getErrors);
    const selectConfig = formConfig.selectConfig;

    const dispatch = useDispatch();

    useLayoutEffect(() => {
        if (genericFormContainer) {
            genericFormContainer.elements.forEach(obj => {
                if (obj.required) {
                    requiredDependencies.push(databaseObject[obj.value]);
                }
            })
        }

        const tempErrors = { ...errors }
        Object.keys(tempErrors).forEach((i) => tempErrors[i] = null)
        dispatch(setErrors({ ...tempErrors }));
    }, []);

    useEffect(() => {
        if (formCheckDone === FormCheckDoneOptions.CHECKING) {
            checkFormValidity(databaseObject);
            dispatch(setFormCheckDone(FormCheckDoneOptions.CHECKED));
        }
    }, [formCheckDone])

    function isUnderlineCell(index, containerType) {
        if (containerType === containerTypes.GENERICFORM) {
            if (genericFormContainer.elements.length % 4 === 0 && (index + 1) > (genericFormContainer.elements.length - 4)) {
                return 'normalCell';
            }
            else {
                return genericFormContainer.elements.length >= (Math.ceil((index + 1) / 4) * 4) ? 'underlineCell' : 'normalCell';
            }
        }
        else {
            return "";
        }
    }

    // call this function from parent for it to be less redundant
    const checkFormValidity = (databaseObject) => {
        const newErrors = {};
        let checkFields = [];

        for (let i = 0; i < sortedFormContainers.length; i++) {
            const tempCheckFields = sortedFormContainers[i].elements?.reduce((array, element) => {
                if (element.required === true || element.inputType === inputTypes.DATE) {
                    array.push(element);
                }

                return array;
            }, []);

            if (tempCheckFields) {
                checkFields = checkFields.concat(tempCheckFields);
            }
        }

        if (checkFields.length === 0) {
            return {};
        }

        for (let i = 0; i < checkFields.length; i++) {
            if (checkFields[i].inputType !== inputTypes.DATE && checkFields[i].required && (!databaseObject[checkFields[i].value] || databaseObject[checkFields[i].value] === '')) {
                newErrors[checkFields[i].value] = `${checkFields[i].name} ist ein Pflichtfeld.`
            }
            else if (checkFields[i].inputType === inputTypes.DATE && wrongDateInput.includes(checkFields[i].value)) {
                newErrors[checkFields[i].value] = `${checkFields[i].name} ist ungültig.`
            }
        }

        if (errors.tableErrors) {
            newErrors.tableErrors = errors.tableErrors;
            toast.error("Bitte Tabelleneingabe prüfen.");
        }

        dispatch(setErrors(newErrors));
        return newErrors;
    }

    function getContainerLayout(container) {
        switch (container.containerLayout) {
            case containerLayouts.GRID3:
                return "generic-grid3-container";

            case containerLayouts.GRID4:
                return "generic-grid4-container";

            case containerLayouts.LIST:
                return "generic-list-container";

            default: return "";
        }
    }

    function hasExtraColumns(table) {
        if (table.specialTypeTable && table.specialTypeTable?.[0] === specialTypes.WITHEXTRACOLUMNS) {
            let checkExtraColumns = _.get(user, table.specialTypeTable[2]).toLowerCase()
            let thisExtraColumns = checkExtraColumns.includes(table.specialTypeTable[1]);

            return thisExtraColumns;
        }
        else return false;
    }

    useEffect(() => {
        if (requiredDependencies.some(field => field.length >= 1)) {
            const editedValues = requiredDependencies.filter(field => field.length >= 1);
            const uniqueEditedValues = [...new Set(editedValues)];
            const editedKeys = [];
            const removeErrors = {};

            uniqueEditedValues.forEach(value => {
                Object.keys(databaseObject).filter(key => databaseObject[key] === value).forEach(key => {
                    editedKeys.push(key);
                });
            });

            editedKeys.forEach(key => removeErrors[key] = null);

            dispatch(setErrors({ ...errors, ...removeErrors }));
        }
    }, requiredDependencies)


    return (
        <div className="generic-form-root">
            {sortedFormContainers.map((container) => {
                switch (container.containerType) {

                    case containerTypes.GENERICFORM:
                        return (
                            <div key={container.position} className={`row mx-auto generic-form ${container.cssClass ? container.cssClass : ""} ${getContainerLayout(container)}`} style={{ maxWidth: '100%', width: '100%' }}>
                                {container.header &&
                                    <h6>{container.header}</h6>
                                }
                                <ContainerContent
                                    container={container}
                                    selectConfig={selectConfig}
                                    databaseObject={databaseObject}
                                    setDatabaseObject={setDatabaseObject}
                                    isUnderlineCell={isUnderlineCell}
                                    checkRemoveField={checkRemoveField}
                                />
                            </div>
                        )

                    case containerTypes.ACCORDION:

                        return (
                            <div id="data-collect-accordion" className={`${container.cssClass ? container.cssClass : ""}`} key={container.position}>
                                <Accordion className='row mx-auto' defaultActiveKey="0" flush>
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header className='border'>{container.header}</Accordion.Header>
                                        <Accordion.Body>
                                            <div className={`row client-select-boxes ${getContainerLayout(container)}`} style={{ marginTop: '0.3em' }}>
                                                <ContainerContent
                                                    container={container}
                                                    selectConfig={selectConfig}
                                                    databaseObject={databaseObject}
                                                    setDatabaseObject={setDatabaseObject}
                                                    isUnderlineCell={isUnderlineCell}
                                                    checkRemoveField={checkRemoveField}
                                                />
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            </div>
                        );

                    case containerTypes.ADDROWTABLECONTAINER:
                        return (
                            <div style={{ position: "relative" }} key={container.position}>
                                <div className={`client-table-container ${container.cssClass ? container.cssClass : ""}`} style={{ width: `${thisExtraColumns ? '90vw' : '100vw'}`, transform: `${thisExtraColumns ? 'translateX(-15%)' : 'translateX(-19%)'}` }}>
                                    {container.tables.map(table => {
                                        return (
                                            <AddRowTable
                                                key={table.tableName}
                                                databaseObject={databaseObject}
                                                setDatabaseObject={setDatabaseObject}
                                                tableElement={table}
                                                config={tableSelectConfig ? tableSelectConfig[table.tableName] : null}
                                                errors={errors}
                                                extraColumns={hasExtraColumns(table)}
                                            />
                                        )
                                    })
                                    }
                                </div>
                            </div>
                        );

                    case containerTypes.BASICTABLECONTAINER:
                        return (
                            <div key={container.position} className="basic-table-container">
                                <div>
                                    <BasicTable container={container} databaseObject={databaseObject} setDatabaseObject={setDatabaseObject} />
                                </div>
                            </div>
                        )

                    default:
                        return null;
                }
            })
            }
        </div>
    )
}

const ContainerContent = memo(function ContainerContent({ container, selectConfig, isUnderlineCell, databaseObject, setDatabaseObject, checkRemoveField }) {

    const [underageObject, setUnderageObject] = useState(container.elements?.find(obj => obj.specialType?.includes(specialTypes.WITHCHECKREMOVE)));
    const [containsRadio, setContainsRadio] = useState(container.elements?.some(obj => obj.inputType === inputTypes.RADIO));

    const currentAge = useSelector(getCurrentAge);
    const errors = useSelector(getErrors);

    const dispatch = useDispatch();

    const currentUser = JSON.parse(localStorage.getItem('user'));

    const accessObjects = { currentUser }

    function getTime(key) {
        if (databaseObject[key]) {
            if (typeof databaseObject[key] == "string") {
                return parseISO(databaseObject[key]);
            }
            if (typeof databaseObject[key] == "object") {
                return databaseObject[key];
            }
        }
        else return '';
    }

    function handleChange(e, check) {
        dispatch(setFormState(FormState.MODIFIED));
        if (!check) {
            setDatabaseObject({ ...databaseObject, [e.target.name]: e.target.value });
        }
        else {
            setDatabaseObject({ ...databaseObject, [e.target.name]: e.target.checked });
        }
    }

    function handleDateChange(enteredDate, field, contains) {
        dispatch(setFormState(FormState.MODIFIED));
        calcDate(enteredDate, field, contains);
    }

    function calcDate(enteredDate, field, contains) {
        var date = new Date(enteredDate);
        var age = calcAgeFormula(date);

        if (contains?.ageField) {
            dispatch(setCurrentAge(age));
        }

        if (contains?.underage) {
            if (age >= 18) {
                setDatabaseObject({ ...databaseObject, [field.value]: date, [checkRemoveField.value]: false });
            }
            else {
                setDatabaseObject({ ...databaseObject, [field.value]: date, [checkRemoveField.value]: true });
            }
        }
        else {
            setDatabaseObject({ ...databaseObject, [field.value]: date })
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

    function handleRadioUnselect(radioGroupValue, radioValue) {
        if (databaseObject[radioGroupValue] === radioValue) {
            setDatabaseObject({ ...databaseObject, [radioGroupValue]: '' });
        }
    }

    function isRadioChecked(value) {
        const radioContainer = container.elements.find(obj => obj.value === value);
        let radioChecked = false;

        if (radioContainer && radioContainer.radios) {
            radioChecked = radioContainer.radios.some(obj => obj.value === databaseObject[value]);
        }

        return radioChecked
    }

    function getInputElement(obj, value, index) {
        switch (obj.inputType) {

            case inputTypes.TEXT:
                return (
                    <div key={obj.value} className={isUnderlineCell(index, container.containerType)}>
                        <Box className="mb-1 mt-1">
                            <FormControl className="mui-formControl">
                                <TextField
                                    className="mui-input"
                                    name={obj.value}
                                    label={obj.name}
                                    error={!!errors[obj.value]}
                                    helperText={errors[obj.value]}
                                    size={container.containerType === containerTypes.GENERICFORM ? "small" : "normal"}
                                    variant={container.inputVariant ? container.inputVariant : "outlined"}
                                    //isInvalid={obj.required ? !!errors[obj.value] : false}
                                    value={value || ''}
                                    onChange={(e) => handleChange(e)}
                                />
                            </FormControl>
                        </Box>
                    </div>
                );

            case inputTypes.DATE:
                const minDate = obj.min ? (obj.min === "today" ? dayjs() : dayjs(obj.min)) : null;
                const maxDate = obj.max ? (obj.max === "today" ? dayjs() : dayjs(obj.max)) : null;
                return (
                    <div key={obj.value} className={isUnderlineCell(index, container.containerType)}>
                        <Form.Group className="floating-label-container mb-1 mt-1 mui-formControl" controlId="formBasicData">
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"de"}>
                                <DesktopDatePicker
                                    label={obj.name}
                                    className="mui-input"
                                    slotProps={{
                                        textField: { size: `${container.containerType === containerTypes.GENERICFORM ? "small" : "normal"}`, error: !!errors[obj.value], helperText: errors[obj.value] }, field: {
                                            clearable: true
                                        }
                                    }}
                                    value={value ? dayjs(getTime(obj.value)) : null}
                                    minDate={minDate}
                                    maxDate={maxDate}
                                    onChange={(date) => {
                                        const containsGenericForm = {};
                                        if (container.containerType === containerTypes.GENERICFORM) {
                                            containsGenericForm.ageField = obj.specialType?.includes(specialTypes.WITHAGEFIELD);
                                            containsGenericForm.underage = obj.specialType?.includes(specialTypes.WITHCHECKREMOVE);
                                        }
                                        if (date !== null && date.isValid() && (maxDate ? date.isSameOrBefore(maxDate) : true) && (minDate ? date.isSameOrAfter(minDate) : true)) {
                                            const preLength = wrongDateInput.length;
                                            wrongDateInput = wrongDateInput.filter((string) => string !== obj.value);
                                            if (preLength !== wrongDateInput.length) {
                                                dispatch(setErrors({ ...errors, [obj.value]: null }));
                                            }
                                            //setForm({ ...form, birthday: date });
                                            handleDateChange(date, obj, containsGenericForm);
                                        }
                                        else {
                                            if (date !== null) {
                                                wrongDateInput.push(obj.value);
                                            }
                                            else {
                                                // remove this date field from wrongDateInput when input gets cleared
                                                const preLength = wrongDateInput.length;
                                                wrongDateInput = wrongDateInput.filter((string) => string !== obj.value);
                                                if (preLength !== wrongDateInput.length) {
                                                    dispatch(setErrors({ ...errors, [obj.value]: null }));
                                                }
                                                setDatabaseObject({ ...databaseObject, [obj.value]: "", ...(containsGenericForm.underage && { [checkRemoveField.value]: false }) });
                                            }

                                            if (containsGenericForm.ageField) {
                                                dispatch(setCurrentAge(""));
                                            }
                                        }
                                    }}
                                />
                            </LocalizationProvider>
                        </Form.Group>
                    </div>
                )

            case container.containerType === containerTypes.GENERICFORM && inputTypes.DISPLAY:

                return (
                    <div key={index} className={isUnderlineCell(index, container.containerType)}>
                        <Box className="mb-1 mt-1">
                            <FormControl className="mui-formControl">
                                <TextField
                                    className="mui-input"
                                    label={obj.name}
                                    sx={{ pointerEvents: "none" }}
                                    readOnly
                                    onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                            event.preventDefault();
                                        }
                                    }}
                                    size={container.containerType === containerTypes.GENERICFORM ? "small" : "normal"}
                                    variant="outlined"
                                    //isInvalid={obj.required ? !!errors[obj.value] : false}
                                    value={currentAge === "" ? "" : currentAge}
                                />
                            </FormControl>
                        </Box>
                    </div>
                );

            case inputTypes.CHECKBOX:
                return (
                    <div key={obj.value} className={`genericCheckbox ${isUnderlineCell(index, container.containerType)}`}>
                        {obj.style === "slider" ? (
                            <div className="checkbox-wrapper-3">
                                <div>
                                    <input type="checkbox" id={index} name={obj.value} disabled={obj.specialTypeField === specialTypes.WITHCHECKREMOVE ? !!databaseObject[underageObject?.value] : false} checked={value} onChange={(e) => handleChange(e, true)} />
                                    <label htmlFor={index} className="toggle"><span></span></label>
                                </div>
                                <label htmlFor={index}>{obj.name}</label>
                            </div>
                        ) : (
                            <div>
                                <Form.Group key={obj.value} className="center-child-vertically sd-checkbox">
                                    <Form.Check
                                        type='checkbox'
                                        label={obj.name}
                                        name={obj.value}
                                        checked={value}
                                        onChange={(e) => {
                                            handleChange(e, true);
                                        }}
                                    ></Form.Check>
                                </Form.Group>
                            </div>
                        )
                        }
                    </div>
                )

            case inputTypes.NUMBER:
                return (
                    <div key={index} className={isUnderlineCell(index, container.containerType)}>
                        <Box className="mb-1 mt-1">
                            <FormControl className="mui-formControl">
                                <TextField
                                    className="mui-input"
                                    name={obj.value}
                                    label={obj.name}
                                    onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                            event.preventDefault();
                                        }
                                    }}
                                    size={container.containerType === containerTypes.GENERICFORM ? "small" : "normal"}
                                    variant="outlined"
                                    inputProps={{ maxLength: obj.maxLength }}
                                    //isInvalid={obj.required ? !!errors[obj.value] : false}
                                    value={value ? value : ""}
                                    onChange={(e) => {
                                        if (obj.min && Number(e.target.value) < obj.min) {
                                            e.preventDefault();
                                        }
                                        else if (obj.max && Number(e.target.value) > obj.max) {
                                            e.preventDefault();
                                        }
                                        else {
                                            if (obj.specialTypeField === specialTypes.WITHDISPLAYNUMBEROFFIELDS) {
                                                dispatch(setFormState(FormState.MODIFIED));
                                                const tempArray = [...databaseObject[obj.value]]
                                                tempArray[index] = e.target.value;
                                                setDatabaseObject({ ...databaseObject, [obj.value]: tempArray });
                                            }
                                            else {
                                                handleChange(e);
                                            }
                                        }
                                    }}
                                />
                                {obj.required ? (
                                    <Form.Control.Feedback type="invalid">
                                        {errors[obj.value]}
                                    </Form.Control.Feedback>
                                ) : null}
                            </FormControl>
                        </Box>
                    </div>
                )

            case inputTypes.SELECT:
                return (
                    <div key={obj.value} className={isUnderlineCell(index, container.containerType)}>
                        {obj.specialTypeField === specialTypes.WITHDEPENDENTSELECTION ? (
                            <Box className="mb-1 mt-1" sx={{ position: 'relative' }}>
                                <FormControl sx={{ width: '100%' }} className="mui-formControl">
                                    <InputLabel id={obj.value}>{obj.name}</InputLabel>
                                    <Select
                                        className="mui-input"
                                        labelId={obj.value}
                                        name={obj.value}
                                        label={obj.name}
                                        size={container.containerType === containerTypes.GENERICFORM ? "small" : "normal"}
                                        MenuProps={{
                                            disableScrollLock: false,
                                        }}
                                        value={_.get(accessObjects, obj.dependentSelection)?.includes(databaseObject[obj.value]) ? databaseObject[obj.value] : ''}
                                        onChange={(e) => handleChange(e)}
                                    >
                                        {_.get(accessObjects, obj.dependentSelection)?.map((option, key) => (
                                            <MenuItem key={key} value={option}>{option}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                {databaseObject[obj.value] && (
                                    <Button
                                        style={{ position: "absolute", width: "fit-content", right: 30, top: "50%", transform: "translateY(-50%)", color: "grey", minWidth: "none", padding: "0.1rem" }}
                                        className='clear-filter'
                                        onClick={() => setDatabaseObject({ ...databaseObject, [obj.value]: "" })}>
                                        <MdClear size="26" />
                                    </Button>
                                )}
                            </Box>
                        ) : (
                            <Box className="mb-1 mt-1">
                                <FormControl sx={{ width: '100%' }}>
                                    <InputLabel id={obj.value}>{obj.name}</InputLabel>
                                    <Select
                                        className="mui-input"
                                        labelId={obj.value}
                                        name={obj.value}
                                        label={obj.name}
                                        size={container.containerType === containerTypes.GENERICFORM ? "small" : "normal"}
                                        MenuProps={{
                                            disableScrollLock: false,
                                        }}
                                        value={value || 1}
                                        onChange={(e) => handleChange(e)}
                                    >
                                        {selectConfig?.[obj.value]?.map((option, key) => (
                                            <MenuItem key={key} value={option.id}>{option.value}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        )}
                    </div>
                )

            case inputTypes.MULTILINE:
                return (
                    <Box key={index} className={`mb-1 mt-1 ${isUnderlineCell(index, container.containerType)}`}>
                        <FormControl sx={{ width: '100%' }} className="mui-formControl">
                            <TextField
                                className="mui-input"
                                label={obj.name}
                                value={containsRadio && isRadioChecked(obj.value) ? '' : (value || "")}
                                name={obj.value}
                                size={container.containerType === containerTypes.GENERICFORM ? "small" : "normal"}
                                multiline
                                maxRows={obj.maxRows}
                                sx={{ width: '100%', }}
                                onChange={(e) => {
                                    handleChange(e)
                                }}
                            />
                        </FormControl>
                    </Box>
                )

            case inputTypes.HEADER:
                return (
                    <div key={obj.name}>
                        <h6>{obj.name}</h6>
                    </div>
                )

            case inputTypes.RADIO:
                return (
                    <FormControl key={obj.value} className="mui-formControl">
                        <FormLabel>{obj.name}</FormLabel>
                        <RadioGroup
                            row
                            name={obj.value}
                            value={value}
                            onChange={(e) => {
                                handleChange(e);
                            }}
                        >
                            {obj.radios.map((radio) => (
                                <FormControlLabel key={radio.value} value={radio.value} control={<Radio onClick={() => handleRadioUnselect(obj.value, radio.value)} />} label={radio.name} />
                            ))}
                        </RadioGroup>
                    </FormControl>
                )

            case inputTypes.PARAGRAPH:
                return (
                    <p key={index}>{obj.name}</p>
                )

            default:
                return null;
        }
    }

    return (
        <div>
            <div className="container-content">
                {container?.elements.map((obj, index) => {
                    if (obj.specialTypeField !== specialTypes.WITHDISPLAYNUMBEROFFIELDS) {
                        return getInputElement(obj, databaseObject?.[obj.value], index);
                    }
                    else return null;
                })}
            </div>
        </div>
    )
});

export default GenericForm;