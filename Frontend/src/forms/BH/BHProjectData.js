import { containerTypes, inputTypes } from "../../config/configEnums";

export const projectData = {
    modelName: "projectData",
    tabs: [
        {
            name: "Träger-/Projektangaben",
            key: "projectData",
            containers: [
                {
                    containerType: containerTypes.GENERICFORM,
                    position: 1,
                    cssClass: "bh-project",
                    elements: [
                        { name: "Projekt:", inputType: inputTypes.HEADER },
                        { name: "Zuwendungsjahr", value: "grantYear", inputType: inputTypes.NUMBER, maxLength: 4 },
                        { name: "Projekttitel", value: "projectTitle", inputType: inputTypes.MULTILINE, maxRows: 2 },
                        { name: "Str. + Hausnr.", value: "projectStreet", inputType: inputTypes.TEXT },
                        { name: "Postleitzahl", value: "projectPostalCode", inputType: inputTypes.TEXT },
                        { name: "Ort", value: "projectCity", inputType: inputTypes.TEXT },
                        { name: "Telefon", value: "phone", inputType: inputTypes.TEXT },
                        { name: "Verband", value: "association", inputType: inputTypes.SELECT },
                    ]
                },
                {
                    containerType: containerTypes.ACCORDION,
                    position: 2,
                    cssClass: "bh-project-disabilities",
                    name: "Angaben zur Projektzielgruppe",
                    elements: [
                        { name: "Menschen mit:", inputType: inputTypes.HEADER },
                        { name: "körperlicher Behinderung", value: "physicalDisability", inputType: inputTypes.CHECKBOX },
                        { name: "geistiger Behinderung", value: "mentalDisability", inputType: inputTypes.CHECKBOX },
                        { name: "seelischer Behinderung", value: "psychologicalDisability", inputType: inputTypes.CHECKBOX },
                        { name: "Sinnesbehinderung", value: "sensoryDisability", inputType: inputTypes.CHECKBOX },
                        { name: "Mehrfachbehinderung", value: "multipleDisabilities", inputType: inputTypes.CHECKBOX },
                        { name: "Autismus", value: "autism", inputType: inputTypes.CHECKBOX },
                        { name: "Mit und ohne Behinderung", value: "withAndWithoutDisability", inputType: inputTypes.CHECKBOX },
                        { name: "Anderes", value: "otherDisability", inputType: inputTypes.CHECKBOX },
                    ]
                },
                {
                    containerType: containerTypes.BASICTABLECONTAINER,
                    header: "Mitarbeiter*innen",
                    tableHead: [{ name: "Mitarbeiter*innen", align: "left" }, { name: "Anzahl", align: "center" }],
                    position: 3,
                    elements: [
                        [{ name: "Mitarbeiter*innen gesamt", inputType: inputTypes.DISPLAY }, { value: "numberOfEmployees", inputType: inputTypes.NUMBER, defaultValue: 0 }],
                        [{ name: "Ehrenamt", inputType: inputTypes.DISPLAY }, { value: "volunteerWorkers", inputType: inputTypes.NUMBER, defaultValue: 0 }],
                        [{ name: "davon mit Vorkenntnissen/Vorerfahrung", inputType: inputTypes.DISPLAY }, { value: "employeePreviousExperience", inputType: inputTypes.NUMBER, defaultValue: 0 }],
                        [{ name: "davon Frauen", inputType: inputTypes.DISPLAY }, { value: "femaleEmployees", inputType: inputTypes.NUMBER, defaultValue: 0 }],
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
            ],
            selectConfig: {
                association: [
                    {
                        id: 1,
                        value: "keine Angabe"
                    },
                    {
                        id: 2,
                        value: "AWO Landesverband Berlin e.V."
                    },
                    {
                        id: 3,
                        value: "Caritas für das Erzbistum Berlin e.V."
                    },
                    {
                        id: 4,
                        value: "Deutscher Paritätischer Wohlfahrtsverband - Landesverband Berlin e.V."
                    },
                    {
                        id: 5,
                        value: "Deutsches Rotes Kreuz - Landesverband Berlin e.V."
                    },
                    {
                        id: 6,
                        value: "Diakonisches Werk Berlin-Brandenburg-schlesische Oberlausitz e.V."
                    },
                    {
                        id: 7,
                        value: "Jüdische Gemeinde zu Berlin - Körperschaft des öffentlichen Rechts -"
                    }
                ]
            }
        },
        {
            name: "Kooperation, Vernetzung, Öffentlichkeitsarbeit",
            key: "cooperation",
            containers: [
                {
                    containerType: containerTypes.BASICTABLECONTAINER,
                    tableHead: [{ name: "", align: "left" }, { name: "Anzahl", align: "center" }],
                    position: 1,
                    elements: [
                        [{ name: "Trägerkontakte", inputType: inputTypes.DISPLAY }, { value: "holderContacts", inputType: inputTypes.NUMBER }],
                        [{ name: "davon telefonisch", inputType: inputTypes.DISPLAY }, { value: "holderContactsPhone", inputType: inputTypes.NUMBER }],
                        [{ name: "davon vor Ort", inputType: inputTypes.DISPLAY }, { value: "holderContactsOnSite", inputType: inputTypes.NUMBER }],
                    ]
                },
                {
                    containerType: containerTypes.BASICTABLECONTAINER,
                    tableHead: [{ name: "", align: "left" }, { name: "Anzahl", align: "center" }],
                    position: 2,
                    elements: [
                        [{ name: "Platzmanagement", inputType: inputTypes.DISPLAY }, { value: "spaceManagement", inputType: inputTypes.NUMBER }],
                        [{ name: "davon gemeldete Wohnstätten-Plätze", inputType: inputTypes.DISPLAY }, { value: "spaceManagementResidences", inputType: inputTypes.NUMBER }],
                        [{ name: "davon gemeldete Wohngemeinschaftsplätze", inputType: inputTypes.DISPLAY }, { value: "spaceManagementShared", inputType: inputTypes.NUMBER }],
                    ]
                },
                {
                    containerType: containerTypes.BASICTABLECONTAINER,
                    tableHead: [{ name: "", align: "left" }, { name: "Anzahl", align: "center" }],
                    position: 3,
                    elements: [
                        [{ name: "Projektmanagement", inputType: inputTypes.DISPLAY }, { value: "projectManagement", inputType: inputTypes.NUMBER }],
                        [{ name: "davon Koordinierungstreffen / Fallbesprechung", inputType: inputTypes.DISPLAY }, { value: "projectManagementCoordination", inputType: inputTypes.NUMBER }],
                        [{ name: "davon Plenumssitzungen", inputType: inputTypes.DISPLAY }, { value: "projectManagementPlenum", inputType: inputTypes.NUMBER }],
                        [{ name: "davon Beiratssitzungen", inputType: inputTypes.DISPLAY }, { value: "projectManagementAdvisory", inputType: inputTypes.NUMBER }],
                        [{ name: "davon telefonische Kontakte, Fax, Mail", inputType: inputTypes.DISPLAY }, { value: "projectManagementContacts", inputType: inputTypes.NUMBER }],
                    ]
                },
                {
                    containerType: containerTypes.BASICTABLECONTAINER,
                    tableHead: [{ name: "", align: "left" }, { name: "Anzahl", align: "center" }],
                    position: 4,
                    elements: [
                        [{ name: "Gremienarbeit / Fachveranstaltungen", inputType: inputTypes.DISPLAY }, { value: "committeeWork", inputType: inputTypes.NUMBER }],
                        [{ name: "davon themenspezifische Fachgespräche", inputType: inputTypes.DISPLAY }, { value: "committeeWorkTechnicalDiscussions", inputType: inputTypes.NUMBER }],
                        [{ name: "davon PSAG", inputType: inputTypes.DISPLAY }, { value: "committeeWorkPSAG", inputType: inputTypes.NUMBER }],
                        [{ name: "davon Andere", inputType: inputTypes.DISPLAY }, { value: "committeeWorkOthers", inputType: inputTypes.NUMBER }],
                    ]
                },
                {
                    containerType: containerTypes.BASICTABLECONTAINER,
                    tableHead: [{ name: "", align: "left" }, { name: "Anzahl", align: "center" }],
                    position: 5,
                    elements: [
                        [{ name: "Öffentlichkeitsarbeit", inputType: inputTypes.DISPLAY }, { value: "publicRelation", inputType: inputTypes.NUMBER }],
                        [{ name: "davon Präsentation des Projektes (Tagungen, Messen etc.)", inputType: inputTypes.DISPLAY }, { value: "publicRelationPresentation", inputType: inputTypes.NUMBER }],
                        [{ name: "davon Erstellen von Informationsmaterial (Flyer etc.)", inputType: inputTypes.DISPLAY }, { value: "publicRelationInformation", inputType: inputTypes.NUMBER }],
                        [{ name: "davon Veröffentlichung von Fachartikeln", inputType: inputTypes.DISPLAY }, { value: "publicRelationSpecialistArticles", inputType: inputTypes.NUMBER }],
                        [{ name: "davon Internetpräsenz und Pflege der Website", inputType: inputTypes.DISPLAY }, { value: "publicRelationInternetPresence", inputType: inputTypes.NUMBER }],
                        [{ name: "davon Kontakte zu Schulen, Werkstätten u.ä. Einrichtungen", inputType: inputTypes.DISPLAY }, { value: "publicRelationContacts", inputType: inputTypes.NUMBER }],

                    ]
                },
            ]
        }
    ]
}