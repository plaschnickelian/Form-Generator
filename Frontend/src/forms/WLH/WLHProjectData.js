import { containerLayouts, containerTypes, inputTypes } from "../../config/configEnums";


export const projectData = {
    modelName: "projectData",
    containers: [
        {
            containerType: containerTypes.GENERICFORM,
            containerLayout: containerLayouts.LIST,
            cssClass: "project-description",
            position: 1,
            elements: [
                { name: "Beschreibung", value: "userDescription", inputType: inputTypes.MULTILINE,  maxRows: 5 }
            ]
        },
        {
            containerType: containerTypes.GENERICFORM,
            cssClass: "project-address",
            inputVariant: "standard",
            position: 2,
            elements: [
                { name: "Trägeradresse:", inputType: inputTypes.HEADER },
                { name: "Str. + Hausnr.", value: "holderStreet", inputType: inputTypes.TEXT },
                { name: "Postleitzahl", value: "holderPostalCode", inputType: inputTypes.TEXT },
                { name: "Ort", value: "holderCity", inputType: inputTypes.TEXT },
                { name: "Projektadresse:", inputType: inputTypes.HEADER },
                { name: "Str. + Hausnr.", value: "projectStreet", inputType: inputTypes.TEXT },
                { name: "Postleitzahl", value: "projectPostalCode", inputType: inputTypes.TEXT },
                { name: "Ort", value: "projectCity", inputType: inputTypes.TEXT },
            ]
        },
        {
            containerType: containerTypes.BASICTABLECONTAINER,
            header: "Mitarbeiter*innen",
            tableHead: [{ name: "Mitarbeiter*innen", align: "left" }, { name: "Anzahl", align: "center" }, { name: "davon weiblich", align: "center" }],
            position: 3,
            elements: [
                [{ name: "Ehrenamtliche Mitarbeiter*innen", inputType: inputTypes.DISPLAY }, { value: "volunteerWorkers", inputType: inputTypes.NUMBER, defaultValue: 0 }, { value: "volunteerWorkersF", inputType: inputTypes.NUMBER, defaultValue: 0 }],
                [{ name: "davon neu hinzugekommen", inputType: inputTypes.DISPLAY }, { value: "volunteerWorkersNew", inputType: inputTypes.NUMBER, defaultValue: 0 }, { value: null, inputType: inputTypes.NUMBER }],
                [{ name: "Sonstige", inputType: inputTypes.DISPLAY }, { value: "otherWorkers", inputType: inputTypes.NUMBER, defaultValue: 0 }, { value: "otherWorkersF", inputType: inputTypes.NUMBER, defaultValue: 0 }],
                [{ name: "Keine Angaben", inputType: inputTypes.DISPLAY }, { value: "workersNoInfo", inputType: inputTypes.NUMBER, defaultValue: 0 }, { value: "workersNoInfoF", inputType: inputTypes.NUMBER, defaultValue: 0 }],
            ]
        },
        {
            containerType: containerTypes.ADDROWTABLECONTAINER,
            cssClass: "project-location-table",
            position: 4,
            tables: [
                {
                    tableName: "projectLocation",
                    header: "Standorte",
                    elements: [
                        { name: "Standort", inputType: inputTypes.TEXT },
                    ]
                },
            ]
        }
    ]
}