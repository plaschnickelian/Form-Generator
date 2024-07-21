import { dataCollection } from "./BHDataCollection"
import { projectData } from "./BHProjectData"
import { event, eventStats, eventNotes } from "./events/formEvents"

export const disabilityAssistanceConfig = {
    dataCollection: dataCollection,

    project: projectData,

    event: {
        modelName: "eventTest",
        objectName: "Event",
        labelKey: "eventName",
        tabs: [
            event,
            eventStats,
            eventNotes
        ]
    }
}