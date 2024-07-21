export const tableSelectConfig = {
    services: {
        id: [
            {
                id: 1,
                value: "Beratung (innerhalb der Beratungsstelle)"
            },
            {
                id: 2,
                value: "Vermittlung an soziale und andere Dienste (innerhalb der Beratungsstelle)"
            },

            {
                id: 3,
                value: "Beratung (Angehörige)"
            },

            {
                id: 4,
                value: "Vermittlung an soziale und andere Dienste (Angehörige)"
            },
            {
                id: 5,
                value: "Beratung (innerhalb der Strafvollzugsanstalt)"
            },
            {
                id: 6,
                value: "Vermittlung an soziale und andere Dienste (innerhalb der Strafvollzugsanstalt)"
            }
        ]
    },

    problemAreas: {
        id: [
            {
                id: 1,
                value: "Haftsituation"
            },
            {
                id: 2,
                value: "Wohnsituation"
            },
            {
                id: 3,
                value: "Arbeit, Ausbildung"
            },
            {
                id: 4,
                value: "Schulden"
            },
            {
                id: 5,
                value: "Materielle Absicherung"
            },
            {
                id: 6,
                value: "Gesundheit"
            },
            {
                id: 7,
                value: "Psychosoziale Stabilität"
            },
            {
                id: 8,
                value: "Sucht"
            },
            {
                id: 9,
                value: "Soziale Kontakte (Verwandte, Bekannte)"
            },
            {
                id: 10,
                value: "Umgang mit Behörden"
            },
            {
                id: 11,
                value: "Anhängiges Strafverfahren/strafrechtliche Sanktionen/gerichtliche Auflagen"
            },
            {
                id: 12,
                value: "Migrationsspezifische Probleme"
            },
            {
                id: 13,
                value: "Gewaltbereitschaft"
            },
            {
                id: 14,
                value: "Gewalterfahrung"
            },
            {
                id: 15,
                value: "Sonstiges"
            }
        ]
    },

    objectives: {
        id: [
            {
                id: 1,
                value: "Inanspruchnahme von Hilfen zur finanziellen Existenzsicherung"
            },
            {
                id: 2,
                value: "Inanspruchnahme von spezialisierten Hilfsangeboten"
            },
            {
                id: 3,
                value: "Rechtliche Situation ist geklärt"
            },
            {
                id: 4,
                value: "Haftvermeidung"
            },
            {
                id: 5,
                value: "Wohnung vermittelt"
            },
            {
                id: 6,
                value: "Wohnungsverlust abgewendet"
            },
            {
                id: 7,
                value: "Arbeitsplatzverlust abgewendet"
            },
            {
                id: 8,
                value: "Vermittlung in Arbeitsverhältnisse (sozialversicherungspflichtig)"
            },
            {
                id: 9,
                value: "Vermittlung in arbeitsmarktpolitische Maßnahme"
            },
            {
                id: 10,
                value: "Vermittlung in Aus- und Weiterbildungsmaßnahme"
            },
            {
                id: 11,
                value: "Sonstiges"
            }
        ]
    }
}

export const selectConfig = {
    gender: [
        {
            id: 1,
            value: "Keine Angabe"
        },
        {
            id: 2,
            value: "Männlich"
        },
        {
            id: 3,
            value: "Weiblich"
        },
        {
            id: 4,
            value: "Divers"
        }
    ],
    motherTongue: [
        {
            id: 1,
            value: "Keine Angabe"
        },
        {
            id: 2,
            value: "Deutsch"
        },
        {
            id: 3,
            value: "Andere"
        }
    ],
    nationality: [
        {
            id: 1,
            value: "Keine Angabe"
        },
        {
            id: 2,
            value: "Deutsch"
        },
        {
            id: 3,
            value: "Europäische Union"
        },
        {
            id: 4,
            value: "Europäisches Land außerhalb der EU"
        },
        {
            id: 5,
            value: "Sonstige"
        },
        {
            id: 6,
            value: "Staatenlos"
        }
    ],

    householdStructure: [
        {
            id: 1,
            value: "Keine Angabe"
        },
        {
            id: 2,
            value: "Alleinstehend"
        },
        {
            id: 3,
            value: "Alleinerziehend"
        },
        {
            id: 4,
            value: "Paar ohne Kind(er)"
        },
        {
            id: 5,
            value: "Paar mit Kind(ern)"
        },
        {
            id: 6,
            value: "Sonstiger Mehrpersonenhaushalt"
        }
    ],
    income: [
        {
            id: 1,
            value: "Keine Angabe"
        },
        {
            id: 2,
            value: "Erwerbstätigkeit/Berufstätigkeit"
        },
        {
            id: 3,
            value: "SGB III Arbeitslosengeld I"
        },
        {
            id: 4,
            value: "Rente, Pension"
        },
        {
            id: 5,
            value: "Unterstützung durch Angehörige"
        },
        {
            id: 6,
            value: "Eigenes Vermögen, Vermietung, Zinsen, Altenteil"
        },
        {
            id: 7,
            value: "SGB II Bürgergeld"
        },
        {
            id: 8,
            value: "SGB XII Sozialhilfe"
        },
        {
            id: 9,
            value: "Sonstige öffentliche Unterstützungen"
        },
        {
            id: 10,
            value: "Einkommen in Haft"
        },
        {
            id: 11,
            value: "Weitere Einnahmen"
        },
        {
            id: 12,
            value: "Kein Einkommen"
        }
    ],
    employment: [
        {
            id: 1,
            value: "Keine Angabe"
        },
        {
            id: 2,
            value: "Ja"
        },
        {
            id: 3,
            value: "Nein"
        }
    ],
    housingEmergency: [
        {
            id: 1,
            value: "Keine Angabe"
        },
        {
            id: 2,
            value: "Aktuell von Wohnungslosigkeit betroffen"
        },
        {
            id: 3,
            value: "Institutionell untergebracht"
        },
        {
            id: 4,
            value: "Von Wohnungslosigkeit bedroht"
        },
        {
            id: 5,
            value: "In unzumutbaren Wohnverhältnissen"
        },
        {
            id: 6,
            value: "Kein Wohnungsnotfall"
        },
        {
            id: 7,
            value: "In Haft untergebracht"
        }
    ],
    healthInsurance: [
        {
            id: 1,
            value: "Keine Angabe"
        },
        {
            id: 2,
            value: "Ja"
        },
        {
            id: 3,
            value: "Nein"
        },
        {
            id: 4,
            value: "Ungeklärt"
        }
    ],
    housing: [
        {
            id: 1,
            value: "Keine Angabe"
        },
        {
            id: 2,
            value: "Wohnung"
        },
        {
            id: 3,
            value: "Bei Familie, Partner*in"
        },
        {
            id: 4,
            value: "Bei Bekannten"
        },
        {
            id: 5,
            value: "Firmenunterkunft"
        },
        {
            id: 6,
            value: "Frauenhaus"
        },
        {
            id: 7,
            value: "Wohngruppe (Betreutes Wohnen, Ü-Wohnungen)"
        },
        {
            id: 8,
            value: "Hotel-Pension (Selbstzahler*in)"
        },
        {
            id: 9,
            value: "Notunterkunft/Übernachtungsstelle"
        },
        {
            id: 10,
            value: "ASOG-Unterbringung"
        },
        {
            id: 11,
            value: "Unterbringung in stationärer Gesundheitseinrichtung"
        },
        {
            id: 12,
            value: "Stationäre Sozialeinrichtung"
        },
        {
            id: 13,
            value: "Haft"
        },
        {
            id: 14,
            value: "Ersatzunterkunft (Gartenl., Wohnw., Wagenb., etc.)"
        },
        {
            id: 15,
            value: "Ohne Unterkunft/auf der Straße lebend"
        },
        {
            id: 16,
            value: "Sonstige"
        }
    ],
    arrangedBy: [
        {
            id: 1,
            value: "Keine Angabe"
        },
        {
            id: 2,
            value: "Bekannte"
        },
        {
            id: 3,
            value: "Verwandte"
        },
        {
            id: 4,
            value: "Betreutes Wohnen gemäß SGB XII"
        },
        {
            id: 5,
            value: "BA: Soziale Wohnhilfen"
        },
        {
            id: 6,
            value: "Beratungsstellen"
        },
        {
            id: 7,
            value: "Sozial-Psychiatrischer Dienst"
        },
        {
            id: 8,
            value: "Ambulante Suchtkrankenhilfe/Drogenhilfe"
        },
        {
            id: 9,
            value: "Ambulanter Psychiatrischer Dienst/Krisendienst"
        },
        {
            id: 10,
            value: "Jugendhilfeeinrichtung"
        },
        {
            id: 11,
            value: "BA: Jugendämter"
        },
        {
            id: 12,
            value: "Polizei"
        },
        {
            id: 13,
            value: "Bewährungshilfe"
        },
        {
            id: 14,
            value: "Selbstmelder*in"
        },
        {
            id: 15,
            value: "Weitere Ämter"
        },
        {
            id: 16,
            value: "niedrigschwellige Einrichtungen (NÜ, Tagestreff etc.)"
        },
        {
            id: 17,
            value: "Jocenter"
        },
        {
            id: 18,
            value: "Sonstiges"
        }
    ],
    refugeeStatus: [
        {
            id: 1,
            value: "Keine Angabe"
        },
        {
            id: 2,
            value: "Registriert"
        },
        {
            id: 3,
            value: "Nicht registriert oder ohne Bleiberecht"
        },
        {
            id: 4,
            value: "Anerkannt mit Bleiberecht in Berlin"
        },
        {
            id: 5,
            value: "Anerkannt mit Bleiberecht in anderem Bundesland"
        },
        {
            id: 6,
            value: "Anerkannt mit Bleiberecht in anderem EU-Staat"
        },
        {
            id: 7,
            value: "Statusgewandelt"
        },
        {
            id: 8,
            value: "Trifft nicht zu"
        }

    ],

    statusAfterConsultation: [
        {
            id: 1,
            value: "Beratungsziele überwiegend erreicht"
        },
        {
            id: 2,
            value: "Abbruch durch Klient*in"
        },
        {
            id: 3,
            value: "Abbruch durch Beratungstelle"
        },
        {
            id: 4,
            value: "Inhaftierung/Straffälligkeit während / nach Beratungsprozess"
        },
        {
            id: 5,
            value: "Sonstiges"
        },

    ],
}