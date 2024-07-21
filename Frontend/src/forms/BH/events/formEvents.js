import { containerTypes, inputTypes, eventHandlers, containerLayouts, specialTypes } from "../../../config/configEnums";

export const event = {
    name: "Allgemeine Veranstaltungsdaten",
    key: "event",
    containers: [
        {
            containerType: containerTypes.GENERICFORM,
            containerLayout: containerLayouts.LIST,
            position: 1,
            cssClass: "bh-event-title",
            elements: [
                { name: "Veranstaltungtitel", inputType: inputTypes.HEADER },
                { name: "Veranstaltungsbezeichnung", value: "eventName", inputType: inputTypes.TEXT, required: true },
                { name: "Veranstaltungsbeschreibung", value: "eventDescription", inputType: inputTypes.MULTILINE, maxRows: 2 }
            ]
        },
        {
            containerType: containerTypes.GENERICFORM,
            containerLayout: containerLayouts.LIST,
            position: 2,
            cssClass: "bh-event-type",
            elements: [
                { name: "Angaben zu Art, Turnus und Inhalt", inputType: inputTypes.HEADER },
                { name: "Veranstaltungsart", value: "kindOfEvent", inputType: inputTypes.SELECT },
                { name: "Veranstaltungsturnus", value: "intervalOfEvent", inputType: inputTypes.SELECT },
                { name: "Angebot an", value: "offerOnWeekdays", inputType: inputTypes.SELECT }
            ]
        },
        {
            containerType: containerTypes.GENERICFORM,
            containerLayout: containerLayouts.LIST,
            position: 3,
            cssClass: "bh-event-location",
            elements: [
                { name: "Ort der Veranstaltung", inputType: inputTypes.HEADER },
                { name: "Veranstaltungsort", value: "locationOfEvent", inputType: inputTypes.SELECT },
            ]
        },
        {
            containerType: containerTypes.GENERICFORM,
            containerLayout: containerLayouts.LIST,
            position: 4,
            cssClass: "bh-event-focus",
            elements: [
                { name: "Veranstaltungsschwerpunkt und Besucher*innenausrichtung", inputType: inputTypes.HEADER },
                { name: "Veranstaltungsschwerpunkt", value: "mainContentOfEvent", inputType: inputTypes.SELECT },
                { name: "Besucher*innenausrichtung", value: "orientationParticipants", inputType: inputTypes.SELECT },
            ]
        },
        {
            containerType: containerTypes.ACCORDION,
            containerLayout: containerLayouts.GRID3,
            position: 5,
            cssClass: "bh-event-disabilities",
            header: "Zielgruppe der Veranstaltung",
            elements: [
                { name: "Menschen mit:", inputType: inputTypes.HEADER },
                { name: "körperlicher Behinderung", value: "physicalDisability", inputType: inputTypes.CHECKBOX },
                { name: "geistiger Behinderung", value: "mentalDisability", inputType: inputTypes.CHECKBOX },
                { name: "seelische Behinderung", value: "psychologicalDisability", inputType: inputTypes.CHECKBOX },
                { name: "Autismus", value: "autism", inputType: inputTypes.CHECKBOX },
                { name: "Sinnesbehinderung", value: "sensoryDisability", inputType: inputTypes.CHECKBOX },
                { name: "Mehrfachbehinderung", value: "multipleDisabilities", inputType: inputTypes.CHECKBOX },
            ]
        },
    ],
    selectConfig: {
        kindOfEvent: [
            {
                id: 1,
                value: "keine Angabe"
            },
            {
                id: 2,
                value: "Sonstige"
            },
            {
                id: 3,
                value: "Offener Treff / Treffpunkt"
            },
            {
                id: 4,
                value: "Offene Freizeitangebote"
            },
            {
                id: 5,
                value: "Veranstaltungen und Kurse"
            },
            {
                id: 6,
                value: "Feste / Auftritte / Präsentationen"
            },
            {
                id: 7,
                value: "Reisen (mit Übernachtung)"
            },
            {
                id: 8,
                value: "Wochenendangebote und Ausflüge (ohne Übernachtung)"
            },
            {
                id: 9,
                value: "Selbsthilfe / Ehrenamtliche Initiative"
            }
        ],
        intervalOfEvent: [
            {
                id: 1,
                value: "keine Angabe"
            },
            {
                id: 2,
                value: "Einmalige Angebote"
            },
            {
                id: 3,
                value: "Mehrfach wöchentliche Veranstaltung"
            },
            {
                id: 4,
                value: "Wöchentliche Veranstaltung"
            },
            {
                id: 5,
                value: "14-tägige Veranstaltung"
            },
            {
                id: 6,
                value: "Monatliche Veranstaltung"
            },
            {
                id: 7,
                value: "Mehrfach jährliche Veranstaltung"
            }
        ],
        offerOnWeekdays: [
            {
                id: 1,
                value: "keine Angabe"
            },
            {
                id: 2,
                value: "An Wochentagen"
            },
            {
                id: 3,
                value: "An Wochenenden / Feiertagen"
            }
        ],
        locationOfEvent: [
            {
                id: 1,
                value: "keine Angabe"
            },
            {
                id: 2,
                value: "In eigenen Räumen (Präsenz)"
            },
            {
                id: 3,
                value: "Außerhalb der eigenen Räume (Präsenz)"
            },
            {
                id: 4,
                value: "Online"
            },
            {
                id: 5,
                value: "Telefon"
            },
            {
                id: 6,
                value: "Post"
            }
        ],
        mainContentOfEvent: [
            {
                id: 1,
                value: "keine Angabe"
            },
            {
                id: 2,
                value: "In Bildungsangeboten"
            },
            {
                id: 3,
                value: "Im kulturellen Bereich"
            },
            {
                id: 4,
                value: "Im sozialinklusiven Bereich"
            },
            {
                id: 5,
                value: "Anderes"
            }
        ],
        orientationParticipants: [
            {
                id: 1,
                value: "keine Angabe"
            },
            {
                id: 2,
                value: "Offenes Angebot"
            },
            {
                id: 3,
                value: "Fester Teilnehmer*innenkreis"
            }
        ]
    }
}

export const eventStats = {
    name: "Termine und Besucher*innen",
    key: "eventStats",
    containers: [
        {
            containerType: containerTypes.ADDROWTABLECONTAINER,
            cssClass: "event-stats",
            position: 1,
            tables: [
                {
                    tableName: "eventStats",
                    elements: [
                        /* { name: "ID", value: "eventStatID", inputType: inputTypes.SELECT,  specialTypeField: specialTypes.WITHPROHIBITDUPLUCATESELECT }, */
                        { name: "Veranstaltungsdatum", value: "eventDate", inputType: inputTypes.DATE, specialTypeField: specialTypes.WITHAUTODATESET },
                        { name: "Anzahl Termine", value: "eventScheduleAmount", inputType: inputTypes.TEXT },
                        { name: "Summe Besucher*innen", value: "eventSumVisitors", inputType: inputTypes.TEXT },
                        { name: "davon weiblich", value: "eventVisitorsFemale", inputType: inputTypes.TEXT },
                        { name: "Veranstaltungsdauer", value: "eventDuration", inputType: inputTypes.TEXT }
                    ]
                }
            ]
        }
    ]
}

export const eventNotes = {
    name: "Vermerke",
    key: "eventNotes",
    containers:
        [
            {
                containerType: containerTypes.GENERICFORM,
                containerLayout: containerLayouts.LIST,
                position: 1,
                cssClass: "bh-eventNote-title",
                elements: [
                    { name: "Vermerke", value: "eventNotes", inputType: inputTypes.MULTILINE, maxRows: 6 }
                ]
            }
        ]
}