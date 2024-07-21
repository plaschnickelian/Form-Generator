export const containerTypes = {
    GENERICFORM: "genericForm",
    ACCORDION: "accordion",
    ADDROWTABLECONTAINER: "addRowTableContainer",
    BASICTABLECONTAINER: "basicTableContainer"
}

export const inputTypes = {
    TEXT: "text",
    DATE: "date",
    NUMBER: "number",
    DISPLAY: "display",
    CHECKBOX: "checkbox",
    SELECT: "select",
    MULTILINE: "multiline",
    HEADER: "header",
    PARAGRAPH: "paragraph",
    RADIO: "radio"
}

export const specialTypes = {
    // Form
    WITHAGEFIELD: "withAgeField",  // Date Input has an Age field
    WITHDEPENDENTSELECTION: "withDependentSelection", // Options in Selectbox are dependent on value

    /**
     * Displays number of fields based on value in specified dependent field
     * 
     * options:
     * depends -- dependent field, which specifies the number of fields to display
     */
    WITHDISPLAYNUMBEROFFIELDS: "withDisplayNumberOfFields",

    // Table
    WITHPROHIBITDUPLUCATESELECT: "withProhibitDuplicateSelect", // Prohibit duplicate selection from selectbox in table
    WITHDISABLECOLUMNS: "withDisableColumns", // Disables Columns with "canBeDisabled: true" based on the given string in "disableString"


    /**
     * Automatically sets date of field on selection to todays date
     * 
     * options:
     * setDateOnSelect -- if true sets assigned date field when, this field selects a value
     */
    WITHAUTODATESET: "withAutoDateSet",
    WITHAUTOFIELDSET: "withAutoFieldSet",
    WITHDATEDIFFERENCE: "withDateDifference" // Calculates Date difference between two dates
}

export const containerLayouts = {
    GRID3: "grid3",
    GRID4: "grid4",
    LIST: "list"
}

/**
 * creates a database object with initial values for every property
 * 
 * @param {*} config form config the root form component is using
 * @returns database object with initial values for every property
 */
export function getInitDatabaseObject(config) {
    let databaseObject = {};

    if (config.tabs) {
        for (let i = 0; i < config.tabs.length; i++) {
            databaseObject = { ...databaseObject, ...getInitDatabaseObject(config.tabs[i]) }
        }
    }
    else {

        config.containers?.forEach(container => {
            switch (container.containerType) {
                case containerTypes.ADDROWTABLECONTAINER:
                    container.tables?.forEach(element => {
                        databaseObject[element.tableName] = [];
                    })
                    break;

                case containerTypes.BASICTABLECONTAINER:
                    container.elements.forEach((element) => {
                        element.forEach((tableCell) => {
                            if (tableCell.value) {
                                databaseObject[tableCell.value] = getInitalValue(tableCell);
                            }
                        })
                    })
                    break;

                default:
                    container.elements?.forEach(element => {
                        if (element.value) {
                            databaseObject[element.value] = getInitalValue(element);
                        }
                    })
            }
        })
    }

    return databaseObject;
}

function getInitalValue(element) {
    let initialValue;

    if (element.specialTypeField === specialTypes.WITHDISPLAYNUMBEROFFIELDS) {
        return [];
    }
    else {
        if (element.defaultValue) {
            initialValue = element.defaultValue;
        }
        else {
            switch (element.inputType) {

                case inputTypes.CHECKBOX:
                    initialValue = false;
                    break;

                case inputTypes.SELECT:
                    if (element.specialTypeField === specialTypes.WITHDEPENDENTSELECTION) {
                        initialValue = "";
                    }
                    else {
                        initialValue = 1;
                    }
                    break;

                default:
                    initialValue = "";
            }
        }

        return initialValue;
    }
}

export function getDeleteProperties(config, databaseObject, initDatabaseObject) {
    const underageContainer = [];
    const deleteProperties = {};
    let checkRemoveField = {};
    config.containers?.forEach(container => {
        if (container.specialTypeContainer?.[0] === specialTypes.WITHCHECKREMOVE) {
            underageContainer.push(container)
        }

        const checkRemoveElement = container.elements?.find(element => element.specialTypeField === specialTypes.WITHCHECKREMOVE)
        if (checkRemoveElement) {
            checkRemoveField = checkRemoveElement;
        }
    });

    if (checkRemoveField && databaseObject[checkRemoveField.value]) {
        underageContainer.forEach(container => {
            container.elements?.forEach(element => {
                if (!element.keepOnCheck) {
                    deleteProperties[element.value] = initDatabaseObject[element.value];
                }
            })
        })
    }

    return deleteProperties;
}