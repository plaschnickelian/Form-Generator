//import node modules and react modules
import axios from 'axios';
import apiConfig from '../../config/config';
import { responseNotifyHandling } from '../../components/Error'
import React, { useState, useEffect, Fragment, useLayoutEffect } from 'react';
import { Form, Button, ButtonGroup, FloatingLabel, FormGroup, FormFloating, Table } from 'react-bootstrap';
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import { getMonth, getYear } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
import range from "lodash/range";
import de from 'date-fns/locale/de';
import * as Icons from "react-icons/fa";
import MaskedInput from 'react-text-mask'
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe'
import parseISO from 'date-fns/parseISO';
import { Paper, Alert, Box } from '@mui/material';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { setFormState, setErrors } from '../../features/form/formSlice';
import { inputTypes, specialTypes } from '../../config/configEnums';
//import DWBO sources

registerLocale('de', de)
setDefaultLocale('de')

const FormState = {
    UNCHANGED: "UNCHANGED",
    MODIFIED: "MODIFIED",
    SAVING: "SAVING"
}
const reportingYear = 2024
const autoCorrectedDatePipe = createAutoCorrectedDatePipe('dd.mm.yyyy')
const years = range(1900, getYear(new Date()) + 1, 1);
const months = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember"
];
/* const initField = {
    id: null,
    date: null
}
const initFieldOvernight = {
    id: null,
    date: null,
    intakeDate: null,
    departureDate: null,
    numberOfNights: null
} */

function AddRowTable({ databaseObject, setDatabaseObject, extraColumns = false, errors, config, tableElement }) {
    const [singleColumn, setSingleColumn] = useState(tableElement.elements.length === 1 ? true : false);

    const getInitField = () => {
        const newInitField = {};
        tableElement.elements.forEach((element) => {
            if (!element.extraColumn) {
                if (element.inputType === inputTypes.DATE) {
                    newInitField[element.value] = null;
                }
                else {
                    if (element.defaultValue) {
                        newInitField[element.value] = element.defaultValue;
                    }
                    else {
                        newInitField[element.value] = "";
                    }
                }
            }
        })
        return newInitField;
    }

    const getInitFieldExtraColumns = () => {
        const newInitField = {};
        tableElement.elements.forEach((element) => {
            if (element.inputType === inputTypes.DATE) {
                newInitField[element.value] = null;
            }
            else {
                if (element.defaultValue) {
                    newInitField[element.value] = element.defaultValue;
                }
                else {
                    newInitField[element.value] = "";
                }
            }
        })
        return newInitField;
    }

    const [invalidRows, setInvalidRows] = useState([]);
    const [initField, setInitField] = useState(getInitField());
    const [initFieldExtraColumns, setInitFieldExtraColumns] = useState(getInitFieldExtraColumns());

    const dispatch = useDispatch();

    useEffect(() => {
        if (tableElement.elements.some((obj) => obj.specialTypeField === specialTypes.WITHDATEDIFFERENCE)) {
            checkTableValidity();
        }
    }, [databaseObject[tableElement.tableName], databaseObject[tableElement.tableName]?.length]);

    const addRowHandler = () => {
        const newRowArray = [...databaseObject[tableElement.tableName]];

        if (singleColumn) {
            newRowArray.push("");
        }
        else {
            newRowArray.push(extraColumns ? initFieldExtraColumns : initField);
        }

        setDatabaseObject({ ...databaseObject, [tableElement.tableName]: newRowArray });
    };

    const checkTableValidity = () => {
        let tableErrors = 0;
        const newInvalidRows = [];

        const dateDifferenceFields = tableElement.elements.filter(element => element.inputType === inputTypes.DATE && element.specialTypeField === specialTypes.WITHDATEDIFFERENCE);

        if (dateDifferenceFields.length === 2) {
            databaseObject[tableElement.tableName].forEach((row, index) => {
                if (row[dateDifferenceFields[0].value] && row[dateDifferenceFields[1].value]) {
                    if (dayjs(row[dateDifferenceFields[0].value]) >= dayjs(row[dateDifferenceFields[1].value])) {
                        tableErrors++;
                        newInvalidRows.push(index);
                    }
                }
            });
        }

        dispatch(setErrors({ ...errors, tableErrors: tableErrors }));
        setInvalidRows(newInvalidRows);
    };

    if (databaseObject[tableElement.tableName]) return (
        <div className={`${extraColumns ? 'big-table' : 'small-table'}`} style={{ flexBasis: extraColumns ? "45%" : "27.5%" }}>
            <Paper sx={{ padding: "0.5rem 0.5rem 0.5rem 0.1rem" }} square elevation={1}>
                {tableElement.header &&
                    <div className="table-header">
                        <h5>{tableElement.header}</h5>
                    </div>
                }
                <Table className={tableElement.cssClass} hover>
                    <thead>
                        <tr>
                            <th><Button size='sm' variant='success' onClick={addRowHandler}><Icons.FaPlus /></Button></th>
                            {!extraColumns ? tableElement.elements.map((element, index) => {
                                if (element.extraColumn) {
                                    return null;
                                }
                                else return (
                                    <th key={index}>{element.name}</th>
                                )
                            }) :
                                tableElement.elements.map((element, index) => {
                                    return (
                                        <th key={index}>{element.name}</th>
                                    )
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(databaseObject[tableElement.tableName]?.length)].map((_, i) => (
                            <AddElement key={i} index={i} databaseObject={databaseObject} setDatabaseObject={setDatabaseObject} singleColumn={singleColumn} tableElement={tableElement} config={config} invalidRows={invalidRows} extraColumns={extraColumns} initField={initField} initFieldExtraColumns={initFieldExtraColumns} />
                        ))}
                    </tbody>
                </Table>
            </Paper>
            {extraColumns && errors.tableErrors ?
                <Alert className='mt-2' severity='error'>Bitte Eingabe prüfen: Das Weggangsdatum muss nach dem Aufnahmedatum liegen</Alert> : ""}
        </div>
    )
}

const AddElement = ({ index, databaseObject, setDatabaseObject, config, tableElement, invalidRows, extraColumns, initField, initFieldExtraColumns, singleColumn }) => {
    const minDate = new Date(`${reportingYear}-01-01`);
    const maxDate = new Date(`${reportingYear}-12-31`);

    const getDisableColumns = () => {
        return tableElement.elements.find((element) => element.specialTypeField === specialTypes.WITHDISABLECOLUMNS);
    };

    const getDateDifference = () => {
        let dateDifference = null;
        tableElement.elements.forEach((element) => {
            if (element.inputType === inputTypes.DISPLAY && element.specialTypeField === specialTypes.WITHDATEDIFFERENCE) {
                dateDifference = element;
            }
        })
        return dateDifference;
    }

    const [disableColumnsElement, setDisableColumnsElement] = useState(getDisableColumns());
    const [dateDifferenceDisplay, setDateDifferenceDisplay] = useState(getDateDifference());

    const isDisabled = (activeOn) => {
        let disabled = false;
        if (activeOn && disableColumnsElement) {
            if (typeof activeOn === "number") {
                if (activeOn !== Number(databaseObject[tableElement.tableName][index][disableColumnsElement.value])) {
                    disabled = true;
                }
            }
            else {
                if(!activeOn.includes(Number(databaseObject[tableElement.tableName][index][disableColumnsElement.value]))) {
                    disabled = true;
                }
            }
        }

        return disabled;
    }

    const dispatch = useDispatch();

    const removeRowHandler = (index) => {
        const tempArray = [...databaseObject[tableElement.tableName]];
        tempArray.splice(index, 1);
        setDatabaseObject({ ...databaseObject, [tableElement.tableName]: tempArray });
    };

    const handleChange = (value, element) => {
        const tempArray = [...databaseObject[tableElement.tableName]];

        if (singleColumn) {
            tempArray[index] = value
        }
        else {
            tempArray[index] = { ...tempArray[index], [element.value]: value };
        }

        dispatch(setFormState(FormState.MODIFIED));
        setDatabaseObject({ ...databaseObject, [tableElement.tableName]: tempArray });
    }

    function checkArrayContainsField(array, id) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].id == id) {
                return true;
            }
        }

        return false;
    }

    return (
        <tr>
            <td>
                <Button size='sm' variant='danger' onClick={() => removeRowHandler(index)}><Icons.FaTrash></Icons.FaTrash></Button>
            </td>
            {tableElement.elements.map((element, i) => {
                if (extraColumns || !element.extraColumn) {
                    switch (element.inputType) {
                        case inputTypes.SELECT:
                            return (
                                <td key={i}>
                                    <Form.Group className="mb-1 mt-1">
                                        <Form.Select
                                            size='m'
                                            value={singleColumn ? databaseObject[tableElement.tableName]?.[index] : databaseObject[tableElement.tableName]?.[index][element.value]}
                                            disabled={element.activeOn ? isDisabled(element.activeOn) : false}
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                const tempArray = [...databaseObject[tableElement.tableName]];

                                                if (singleColumn) {
                                                    tempArray[index] = newValue;
                                                }
                                                else {
                                                    tempArray[index] = { ...tempArray[index], [element.value]: newValue };

                                                    tableElement.elements.forEach(obj => {
                                                        if (obj.activeOn && element.specialTypeField === specialTypes.WITHDISABLECOLUMNS) {
                                                            if (typeof obj.activeOn === "number") {
                                                                if (obj.activeOn !== e.target.value) {
                                                                    tempArray[index] = { ...tempArray[index], [obj.value]: initFieldExtraColumns[obj.value] };
                                                                }
                                                            }
                                                            else {
                                                                if(!obj.activeOn.includes(Number(e.target.value))) {
                                                                    tempArray[index] = { ...tempArray[index], [obj.value]: initFieldExtraColumns[obj.value] };
                                                                }
                                                            }
                                                        }
                                                        if(obj.specialTypeField === specialTypes.WITHAUTOFIELDSET && element.setFieldIf === Number(e.target.value)) {
                                                            tempArray[index] = { ...tempArray[index], [obj.value]: element.setFieldTo }
                                                        }

                                                        if (element.setDateOnSelect && obj.specialTypeField === specialTypes.WITHAUTODATESET && !tempArray[index][obj.value]) {
                                                            tempArray[index] = { ...tempArray[index], [obj.value]: new Date() };
                                                        }
                                                    })
                                                }

                                                dispatch(setFormState(FormState.MODIFIED));
                                                setDatabaseObject({ ...databaseObject, [tableElement.tableName]: tempArray });
                                            }}
                                        >
                                            <option hidden value={null} style={{ color: 'rgba(255, 255, 255, 0.3)' }}>{element.name} auswählen</option>
                                            {config[element.value].map((option, key) => (
                                                <option key={key} disabled={element.specialTypeField === specialTypes.WITHPROHIBITDUPLUCATESELECT ? checkArrayContainsField(databaseObject[tableElement.tableName], option.id) : false} value={option.id}>{option.value}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </td>
                            );

                        case inputTypes.DATE:
                            return (
                                <td key={i}>
                                    <TableDatePicker databaseObject={databaseObject} setDatabaseObject={setDatabaseObject} dateDifferenceDisplay={dateDifferenceDisplay} singleColumn={singleColumn} handleChange={handleChange} tableElement={tableElement} index={index} selector={element.value} minDate={minDate} maxDate={maxDate} disabled={element.activeOn ? isDisabled(element.activeOn) : false} invalid={element.specialTypeField === specialTypes.WITHDATEDIFFERENCE ? invalidRows.includes(index) : false} />
                                </td>
                            )

                        case inputTypes.DISPLAY:
                            return (
                                <td key={i}>
                                    <Form.Group key={databaseObject[tableElement.tableName].length} className="mb-1 mt-1">
                                        <Form.Control
                                            style={{ minWidth: "3rem", maxWidth: "3.8rem" }}
                                            readOnly
                                            disabled={element.activeOn ? isDisabled(element.activeOn) : false}
                                            placeholder={element.activeOn ? (isDisabled(element.activeOn) ? "" : "Anzahl") : "Anzahl"}
                                            value={singleColumn ? databaseObject[tableElement.tableName][index] || "" : databaseObject[tableElement.tableName][index][dateDifferenceDisplay.value] || ""}
                                        />
                                    </Form.Group>
                                </td>
                            )

                        case inputTypes.TEXT:
                            return (
                                <td key={i}>
                                    <Form.Group /* key={rerender} */ className="mb-1 mt-1">
                                        <Form.Control
                                            placeholder={element.name}
                                            value={singleColumn ? databaseObject[tableElement.tableName][index] : databaseObject[tableElement.tableName][index][element.value]}
                                            onChange={(e) => {
                                                handleChange(e.target.value, element)
                                            }}
                                        />
                                    </Form.Group>
                                </td>
                            )

                        default: return null;
                    }
                }
            })
            }
        </tr>
    )
};

const TableDatePicker = ({ index, selector, minDate, maxDate, invalid, dateDifferenceDisplay, disabled = false, databaseObject, setDatabaseObject, tableElement, handleChange, singleColumn }) => {

    const dispatch = useDispatch();

    function getTime(key, index, selector) {
        if (singleColumn) {
            if (databaseObject[key][index]) {
                if (typeof databaseObject[key][index] == "string") {
                    return parseISO(databaseObject[key][index]);
                }
                if (typeof databaseObject[key][index] == "object") {
                    return databaseObject[key][index];
                }
            }
            else return '';
        }
        else {
            if (databaseObject[key]?.[index]) {
                if (typeof databaseObject[key][index][selector] == "string") {
                    return parseISO(databaseObject[key][index][selector]);
                }
                if (typeof databaseObject[key][index][selector] == "object") {
                    return databaseObject[key][index][selector];
                }
            }
            else return '';
        }
    }

    function getDateDifference(arrival, departure) {
        if (typeof arrival === "string") {
            arrival = parseISO(arrival);
        }
        if (typeof departure === "string") {
            departure = parseISO(departure);
        }

        const diffTime = departure - arrival;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    return (
        <Form.Group className="mb-1 mt-1" controlId="formBasicData">
            <DatePicker
                className={`form-control ${invalid ? "invalid-input" : ""}`}
                renderCustomHeader={({
                    date,
                    changeYear,
                    changeMonth,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                }) => (
                    <div
                        style={{
                            margin: 10,
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <select
                            value={getYear(date)}
                            onChange={({ target: { value } }) => changeYear(value)}
                        >
                            {years.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>

                        <select
                            value={months[getMonth(date)]}
                            onChange={({ target: { value } }) =>
                                changeMonth(months.indexOf(value))
                            }
                        >
                            {months.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                selected={getTime(tableElement.tableName, index, selector)}
                onChange={(date) => {
                    const newValue = date;
                    const tempArray = [...databaseObject[tableElement.tableName]];

                    if (singleColumn) {
                        tempArray[index] = newValue;
                    }
                    else {
                        tempArray[index] = { ...tempArray[index], [selector]: newValue };

                        const dateDifferenceFields = tableElement.elements.filter(element => element.inputType === inputTypes.DATE && element.specialTypeField === specialTypes.WITHDATEDIFFERENCE);

                        if (dateDifferenceFields.length === 2) {
                            if (tempArray[index][dateDifferenceFields[0].value] !== null && tempArray[index][dateDifferenceFields[1].value] !== null) {
                                const dateDifference = getDateDifference(tempArray[index][dateDifferenceFields[0].value], tempArray[index][dateDifferenceFields[1].value]);
                                if (dateDifference > 0) {
                                    tempArray[index][dateDifferenceDisplay.value] = dateDifference;
                                }
                                else {
                                    tempArray[index][dateDifferenceDisplay.value] = "";
                                }
                            }
                            else {
                                tempArray[index][dateDifferenceDisplay.value] = "";
                            }
                        }
                    }

                    dispatch(setFormState(FormState.MODIFIED));
                    setDatabaseObject({ ...databaseObject, [tableElement.tableName]: tempArray });
                }}
                dateFormat="dd.MM.yyyy"
                minDate={minDate}
                maxDate={maxDate}
                disabled={disabled}
                customInput={
                    <MaskedInput
                        pipe={autoCorrectedDatePipe}
                        mask={[/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/]}
                        keepCharPositions={true}
                        guide={true}
                        onInput={(e) => {
                            if (e.target.value == "" || e.target.value == "_.__.____") {
                                handleChange(null, { value: selector });
                            }
                        }}
                    />
                }
            />
        </Form.Group>
    )
};

export default AddRowTable;