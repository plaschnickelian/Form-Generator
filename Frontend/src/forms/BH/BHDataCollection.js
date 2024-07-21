import { containerLayouts, containerTypes, inputTypes, specialTypes } from "../../config/configEnums";
import { selectConfig, tableSelectConfig } from "./disabilityAssistanceSelect";


export const dataCollection = {
    modelName: "client",
    objectName: "Klient",
    filter: true,
    labelKey: ["lastName", "firstName"],
    containers: [
        {
            containerType: containerTypes.GENERICFORM,
            cssClass: "user-info-table",
            position: 1,
            elements: [
                { name: "Nachname", value: "lastName", inputType: inputTypes.TEXT,  required: true },
                { name: "Vorname", value: "firstName", inputType: inputTypes.TEXT },
                { name: "Alter", value: "age", inputType: inputTypes.NUMBER },
                { name: "Anonymer Kontakt", value: "anonymousContact", inputType: inputTypes.CHECKBOX,  style: "slider" },
                { name: "Str. + Hausnr", value: "addressStreet", inputType: inputTypes.TEXT },
                { name: "Ort", value: "addressCity", inputType: inputTypes.TEXT },
                { name: "Telefon", value: "phone", inputType: inputTypes.TEXT },
                { name: "E-Mail", value: "mail", inputType: inputTypes.TEXT },
            ]
        },
        {
            containerType: containerTypes.ACCORDION,
            containerLayout: containerLayouts.GRID3,
            position: 2,
            header: "Soziodemografische Angaben",
            elements: [
                { name: "Geschlecht", value: "gender", inputType: inputTypes.SELECT,  filterIf: 1 },
                { name: "Erwerbstätigkeit", value: "employment",  inputType: inputTypes.SELECT, filterIf: 1 },
                { name: "Wohnform", value: "typeOfHousing",  inputType: inputTypes.SELECT, filterIf: 1 },
                { name: "Staatsangehörigkeit", value: "nationality",  inputType: inputTypes.SELECT, filterIf: 1 },
                { name: "Erstkontakt", value: "arrangedBy",  inputType: inputTypes.SELECT, filterIf: 1 },
                { name: "Unterstützungsform", value: "typeOfCare",  inputType: inputTypes.SELECT, filterIf: 1 },
                { name: "Muttersprache", value: "motherTongue",  inputType: inputTypes.SELECT, filterIf: 1 },
                { name: "Vorrangige Behinderung", value: "priorityDisability",  inputType: inputTypes.SELECT, filterIf: 1 },
                { name: "Geflüchtete / Schutzsuchende", value: "refugee",  inputType: inputTypes.CHECKBOX },
                { name: "Gebärdensprache", value: "signLanguage",  inputType: inputTypes.CHECKBOX },
                { name: "Andere Kommunikationsform", value: "otherCommunication",  inputType: inputTypes.CHECKBOX },
                { name: "Rechtliche Vertretung", value: "legalRepresentation",  inputType: inputTypes.CHECKBOX },

            ]
        },
        {
            containerType: containerTypes.GENERICFORM,
            containerLayout: containerLayouts.GRID3,
            cssClass: "multiple-disabilities",
            header: "Bei Mehrfachbehinderung bitte weitere Behinderungen angeben:",
            position: 3,
            elements: [
                { name: "Geistige Behinderung", value: "mentalDisability", inputType: inputTypes.CHECKBOX },
                { name: "Körperliche Behinderung", value: "physicalDisability", inputType: inputTypes.CHECKBOX },
                { name: "Seelische Behinderung", value: "psychologicalDisability", inputType: inputTypes.CHECKBOX },
                { name: "Sinnesbehinderung", value: "sensoryDisability", inputType: inputTypes.CHECKBOX },
                { name: "Autismus", value: "autism", inputType: inputTypes.CHECKBOX },
            ]
        },
        {
            containerType: containerTypes.ACCORDION,
            containerLayout: containerLayouts.LIST,
            position: 4,
            header: "Weitere Informationen",
            elements: [
                { name: "Standort", value: "projectLocation", inputType: inputTypes.SELECT,  specialTypeField: specialTypes.WITHDEPENDENTSELECTION, dependentSelection: 'currentUser.userProject.projectLocation' },
                { name: "Beratungsverlauf", value: "consultationNotes", inputType: inputTypes.MULTILINE,  maxRows: 4 }
            ]
        },
        {
            containerType: containerTypes.ADDROWTABLECONTAINER,
            position: 5,
            tables: [
                {
                    tableName: "services",
                    cssClass: "bh-services",
                    elements: [
                        { name: "Leistung", value: "service", required: true, inputType: inputTypes.SELECT, specialTypeField: specialTypes.WITHDISABLECOLUMNS,  setDateOnSelect: true, setFieldTo: 2, setFieldIf: 2, filterIf: 2 },
                        { name: "Beratungsaufwand", value: "effortConsultation", inputType: inputTypes.SELECT,  defaultValue: 1, activeOn: 2, specialTypeField: specialTypes.WITHAUTOFIELDSET },
                        { name: "Datum", value: "date", inputType: inputTypes.DATE, specialTypeField: specialTypes.WITHAUTODATESET },
                        { name: "Differenzierung der Leistungen Beratung und Information", value: "differentiationConsultation", inputType: inputTypes.SELECT,  defaultValue: 1, filter: 1, filterIf: ["service", 2], activeOn: [1, 2] },
                        { name: "Leistung an", value: "serviceFor", inputType: inputTypes.SELECT,  defaultValue: 2 }
                    ]
                }
            ]
        }
    ],

    tableSelectConfig: tableSelectConfig,

    //allgemeine auswahl der select boxen
    selectConfig: selectConfig,
}