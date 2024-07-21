import { containerLayouts, containerTypes, inputTypes, specialTypes } from "../../config/configEnums";
import { selectConfig, tableSelectConfig } from "./delinquentAssistanceSelect";


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
                { name: "Geburtsdatum", value: "birthday", inputType: inputTypes.DATE, specialType: [specialTypes.WITHAGEFIELD] },
                { name: "Alter", inputType: inputTypes.DISPLAY, specialTypeField: specialTypes.WITHAGEFIELD },
                { name: "Str. + Hausnr", value: "addressStreet", inputType: inputTypes.TEXT },
                { name: "Ort", value: "addressCity", inputType: inputTypes.TEXT },
                { name: "Telefon", value: "phone", inputType: inputTypes.TEXT },
                { name: "Beratung abgeschlossen", value: "consultationComplete", inputType: inputTypes.CHECKBOX,  style: "slider" },
            ]
        },
        {
            containerType: containerTypes.ACCORDION,
            containerLayout: containerLayouts.GRID3,
            position: 2,
            specialTypeContainer: [specialTypes.WITHCHECKREMOVE, "underage"],
            header: "Soziodemografische Angaben",
            elements: [
                { name: "Geschlecht", value: "gender", inputType: inputTypes.SELECT, filterIf: 1 },
                { name: "Muttersprache", value: "motherTongue", inputType: inputTypes.SELECT, filterIf: 1 },
                { name: "Staatsangehörigkeit", value: "nationality", inputType: inputTypes.SELECT, filterIf: 1 },
                { name: "Haushaltsstruktur", value: "householdStructure", inputType: inputTypes.SELECT, filterIf: 1 },
                { name: "Einkommen", value: "income", inputType: inputTypes.SELECT, filterIf: 1 },
                { name: "Erwerbstätigkeit", value: "employment", inputType: inputTypes.SELECT, filterIf: 1 },
                { name: "Unterkunft", value: "housing", inputType: inputTypes.SELECT, filterIf: 1 },
                { name: "Wohnungsnotfall", value: "housingEmergency", inputType: inputTypes.SELECT, filterIf: 1 },
                { name: "Krankenversicherung", value: "healthInsurance", inputType: inputTypes.SELECT, filterIf: 1 },
                { name: "Vermittelt von", value: "arrangedBy", inputType: inputTypes.SELECT, filterIf: 1 },
                { name: "Geflüchtete Menschen", value: "refugeeStatus", inputType: inputTypes.SELECT, filterIf: 1 },
                { name: "Status nach Abschluss des Beratungsprozesses", value: "statusAfterConsultation", inputType: inputTypes.SELECT, filterIf: 1 },
                { name: "Anzahl minderjähriger Kinder im Haushalt", value: "householdUnderageChildren", inputType: inputTypes.NUMBER, max: 10 },
                { name: "Alter Kind", value: "underageChildrenAges", inputType: inputTypes.NUMBER, specialTypeField: specialTypes.WITHDISPLAYNUMBEROFFIELDS, depends: "householdUnderageChildren", max: 18 }
            ]
        },
        {
            containerType: containerTypes.ACCORDION,
            containerLayout: containerLayouts.LIST,
            position: 3,
            header: "Weitere Informationen",
            elements: [
                { name: "Beratungsverlauf", value: "consultationNotes", inputType: inputTypes.MULTILINE, maxRows: 4 }
            ]
        },
        {
            containerType: containerTypes.ADDROWTABLECONTAINER,
            position: 4,
            tables: [
                {
                    tableName: "problemAreas",
                    elements: [
                        { name: "Problemfelder", value: "id", required: true, inputType: inputTypes.SELECT,  specialTypeField: specialTypes.WITHPROHIBITDUPLUCATESELECT, setDateOnSelect: true },
                        { name: "Datum", value: "date", inputType: inputTypes.DATE, specialTypeField: specialTypes.WITHAUTODATESET }
                    ]
                },
                {
                    tableName: "objectives",
                    elements: [
                        { name: "Zielerreichung", value: "id", required: true, inputType: inputTypes.SELECT,  setDateOnSelect: true },
                        { name: "Datum", value: "date", inputType: inputTypes.DATE, specialTypeField: specialTypes.WITHAUTODATESET }
                    ]
                },
                {
                    tableName: "services",
                    specialTypeTable: [specialTypes.WITHEXTRACOLUMNS, "uebernachtung", "userProject.projectOffer.projectOfferType"],
                    elements: [
                        { name: "Leistung", value: "id", required: true, inputType: inputTypes.SELECT,  filterNot: 1, setDateOnSelect: true },
                        { name: "Datum", value: "date", inputType: inputTypes.DATE, specialTypeField: specialTypes.WITHAUTODATESET },
                    ]
                }
            ]
        }
    ],

    tableSelectConfig: tableSelectConfig,

    //Soziodemografische Daten: allgemeine Auswahl der Selectboxen
    selectConfig: selectConfig
}