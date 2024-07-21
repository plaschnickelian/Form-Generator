import { containerTypes, inputTypes } from "../../config/configEnums";


export const projectData = {
    modelName: "projectData",
    containers: [
        {
            containerType: containerTypes.BASICTABLECONTAINER,
            header: "Mitarbeiter*innen",
            tableHead: [{ name: "BDS", align: "left" }, { name: "Mitarbeiter*innen", align: "left" }, { name: "Anzahl", align: "center" }, { name: "davon weiblich", align: "center" }],
            position: 3,
            elements: [
                [{ name: "02", inputType: inputTypes.DISPLAY }, { name: "Ehrenamtliche Mitarbeiter*innen", inputType: inputTypes.DISPLAY }, { value: "volunteerWorkers", inputType: inputTypes.NUMBER, defaultValue: 0 }, { value: "volunteerWorkersF", inputType: inputTypes.NUMBER, defaultValue: 0 }],
                [{ name: "02a", inputType: inputTypes.DISPLAY }, { name: "davon neu hinzugekommen", inputType: inputTypes.DISPLAY }, { value: "volunteerWorkersNew", inputType: inputTypes.NUMBER, defaultValue: 0 }, { value: null, inputType: inputTypes.NUMBER }],
                [{ name: "98", inputType: inputTypes.DISPLAY }, { name: "Sonstige", inputType: inputTypes.DISPLAY }, { value: "otherWorkers", inputType: inputTypes.NUMBER, defaultValue: 0 }, { value: "otherWorkersF", inputType: inputTypes.NUMBER, defaultValue: 0 }],
                [{ name: "00", inputType: inputTypes.DISPLAY }, { name: "Keine Angaben", inputType: inputTypes.DISPLAY }, { value: "workersNoInfo", inputType: inputTypes.NUMBER, defaultValue: 0 }, { value: "workersNoInfoF", inputType: inputTypes.NUMBER, defaultValue: 0 }],
            ]
        }
    ]
}