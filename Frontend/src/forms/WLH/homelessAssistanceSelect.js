export const tableSelectConfig = {

    services: {
        //Auswahl zu Leistungen
        id: [
            {
                id: 1,
                value: "Beratung"
            },
            {
                id: 2,
                value: "Begleitung"
            },

            {
                id: 3,
                value: "Vermittlung an soziale Dienste/Institutionen/Einrichtungen"
            },

            {
                id: 4,
                value: "Vermittlung an Fachberatungen"
            },
            {
                id: 5,
                value: "Vermittlung an Sonstige"
            },
            {
                id: 6,
                value: "Verfügungsmittel/Barbeihilfen (Passfotos/Fahrscheine u.ä.)"
            },
            {
                id: 7,
                value: "Vermittlung an Angebote des Gesundheitssystems"
            },
            {
                id: 8,
                value: "Körperpflege/Hygiene (Dusche, Bad)"
            },
            {
                id: 9,
                value: "Schließfachvergabe"
            },
            {
                id: 10,
                value: "Wäschereinigung"
            },
            {
                id: 11,
                value: "Bekleidungsausgabe"
            },
            {
                id: 13,
                value: "Vermittlung an ordnungsrechtliche Unterbringung"
            },
            {
                id: 14,
                value: "Vermittlung wegen Umsetzung von Ansprüchen auf SGB II-/SGB XII-Leistungen/Rentenansprüchen"
            },
            {
                id: 15,
                value: "Vermittlung an Fachdienst für Arbeit"
            },
            {
                id: 16,
                value: "Vermittlung von Hilfen zur Rückkehr ins Heimatland/Weiterwanderung"
            },
            {
                id: 17,
                value: "Vermittlung an Angebote nach SGB VIII"
            },
            {
                id: 18,
                value: "Vergabe Postadresse"
            },
            {
                id: 19,
                value: "Vermittlung in betreutes Wohnen gemäß SGB VIII, IX und XII"
            },
            {
                id: 20,
                value: "Vermittlung einer Wohnung"
            },
        ]
    },

    problemAreas: {
        //Auswahl zu Problemfeldern
        id: [
            {
                id: 1,
                value: "Strafrechtliche Situation"
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
                value: "Migrationsspezifische Probleme"
            },
            {
                id: 12,
                value: "Gewaltbereitschaft"
            },
            {
                id: 13,
                value: "Gewalterfahrung"
            },
            {
                id: 14,
                value: "Hygiene"
            },
            {
                id: 15,
                value: "Schwangerschaft"
            },
            {
                id: 16,
                value: "Gerichtliche Auflagen"
            },

            /*Id:24 soll wieder für alle Angebotstypen sichtbar sein*/
            {
                id: 24,
                value: "Sonstiges"
            }
        ]
    },

    objectives: {
        id: [
            {
                id: 1,
                value: "Vermittlung an soziale Dienste"
            },
            {
                id: 2,
                value: "Vermittlung an Angebote des Gesundheitssystems"
            },
            {
                id: 3,
                value: "Vermittlung einer ordnungrechtlichen Unterbringung"
            },

            /*Id:4 wurde umbenannt*/
            {
                id: 4,
                value: "Umsetzung von Ansprüchen auf SGB II-/SGB XII-Leistungen/Rentenansprüchen"
            },
            {
                id: 5,
                value: "Vermittlung an Fachdienst für Arbeit"
            },
            {
                id: 6,
                value: "Erhalt der Wohnung"
            },
            {
                id: 7,
                value: "Wohnung vermittelt"
            },
            {
                id: 8,
                value: "Vermittlung in betreutes Wohnen"
            },
            {
                id: 9,
                value: "Erlangung Versichertenstatus"
            },
            {
                id: 10,
                value: "Vermittlung zurück ins soziale Umfeld"
            },
            {
                id: 11,
                value: "Vermittlung von Hilfen zur Rückkehr ins Heimatland/Weiterwanderung"
            },

            {
                id: 12,
                value: "Vermittlung an Angebot nach SGB VIII"
            },
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
    durationHomelessness: [
        {
            id: 1,
            value: "Keine Angabe"
        },
        {
            id: 2,
            value: "Unter 1 Monat"
        },
        {
            id: 3,
            value: "1 bis unter 6 Monate"
        },
        {
            id: 4,
            value: "6 bis unter 12 Monate"
        },
        {
            id: 5,
            value: "1 Jahr bis unter 3 Jahre"
        },
        {
            id: 6,
            value: "3 Jahre und länger"
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
            value: "Eigenes Vermögen, Vermietung, Zinsen"
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
            value: "stationäre Sozialeinrichtung"
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
            value: "ohne Unterkunft/auf der Straße lebend"
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
            value: "Betreutes Wohnen gem. SGB XII"
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
            value: "Jobcenter"
        },
        {
            id: 18,
            value: "Sonstiges"
        },
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
        },
    ]
}