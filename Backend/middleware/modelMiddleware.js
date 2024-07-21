const asyncHandler = require('express-async-handler');
const { mongoose, Schema } = require('mongoose')

const models = {};

const modelMiddleware = asyncHandler(async (req, res, next) => {
    if (req.body.objects.formConfig) {
        const formConfig = req.body.objects.formConfig

        if (!models[formConfig.modelName]) {
          const schema = new Schema(getModel(formConfig));
          const newModel = mongoose.model(formConfig.modelName, schema);
          models[formConfig.modelName] = newModel;
        }

        req.model = models[formConfig.modelName];
      }
    next();
})

function getModel(config) {
    let newModel = {
        project: {
            type: Schema.Types.ObjectId,
            ref: 'Project'
        },
    };

    if (config.tabs) {
        for (let i = 0; i < config.tabs.length; i++) {
            newModel = { ...newModel, ...getModel(config.tabs[i]) }
        }
    }
    else {
        config.containers?.forEach(container => {
            switch (container.containerType) {
                case "addRowTableContainer":
                    container.tables?.forEach(element => {
                        if (element.elements.length === 1) {
                            newModel[element.tableName] = [getFieldConfig(element.elements[0])];
                        }
                        else {
                            const tableContent = {}
                            element.elements.forEach(field => {
                                tableContent[field.value] = getFieldConfig(field);
                            })

                            newModel[element.tableName] = [tableContent];
                        }
                    })
                    break;

                case "basicTableContainer":
                    container.elements.forEach((element) => {
                        element.forEach((tableCell) => {
                            if (tableCell.value) {
                                newModel[tableCell.value] = getFieldConfig(tableCell);
                            }
                        })
                    })
                    break;

                default:
                    container.elements?.forEach(element => {
                        if (element.value) {
                            newModel[element.value] = getFieldConfig(element);
                        }
                    })
            }
        })
    }

    return newModel;
}

function getFieldConfig(element) {
    let fieldConfig;

    if (element.specialTypeField === "withDisplayNumberOfFields") {
        return {
            type: Array
        };
    }
    else {
        switch (element.inputType) {

            case "checkbox":
                fieldConfig = {
                    type: Boolean
                }
                break;

            case "select":
                if (element.specialTypeField === "withDependentSelection") {
                    fieldConfig = {
                        type: String
                    }
                }
                else {
                    fieldConfig = {
                        type: Number,
                        default: 1
                    }
                }
                break;

            case "number":
                fieldConfig = {
                    type: Number
                }

            default:
                fieldConfig = {
                    type: String
                };
        }

        return fieldConfig;
    }
}

module.exports = { modelMiddleware }