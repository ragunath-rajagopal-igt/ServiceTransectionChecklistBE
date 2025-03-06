const Logger = require('../models/loggerModel'); 
const { createLogger } = require('../utils/loggerService');
const loggerService = createLogger('LoggerService');

/**
 * Log an action in the system.
 * @param {ObjectId} recordId - The ID of the record being acted upon.
 * @param {Object} currentData - The current state of the record.
 * @param {Object} updatedData - The updated state after action.
 * @param {String} module - The name of the module (e.g., "user", "networksetup").
 * @param {String} action - The action performed (e.g., "create", "edit", "delete", "status update").
 * @param {ObjectId} createdBy - The ID of the user who performed the action.
 */
const logAction = async ({ recordId, currentData, updatedData, module, moduleFrom = null, action, createdBy }) => {
    try {
        // Ensure required data is provided
        if (!recordId || !module || !action || !createdBy) {
            throw new Error("Missing required parameters for logging.");
        }

        let changedFields = {};
        if(updatedData) {
            const getChangedFieldsVal = await getChangedFields(currentData, updatedData);
            changedFields = getChangedFieldsVal._doc || getChangedFieldsVal;
        } else {
            changedFields = currentData;
        }
        const logEntry = new Logger({
            recordId,
            changes: changedFields,
            module,
            moduleFrom,
            action,
            createdBy
        });

        await logEntry.save();
    } catch (error) {
        // Log the error and send a server error response
        loggerService.error("Failed to log action:", { 
            message: error.message, 
            stack: error.stack,
        });
    }
};

/**
 * Recursively get differences between current data and updated data.
 * @param {Object} currentData - The current state of the data.
 * @param {Object} updatedData - The new state of the data.
 * @returns {Object} - An object containing only changed fields with their current values.
 */
const getChangedFields = (currentData, updatedData) => {
    const changedFields = {};

    for (const key in updatedData) {
        if (updatedData.hasOwnProperty(key)) {
            const currentValue = currentData[key];
            const newValue = updatedData[key];

            // Check if the current value is an object to handle nested fields
            if (typeof newValue === 'object' && newValue !== null) {
                const nestedChanges = getChangedFields(currentValue, newValue);
                if (Object.keys(nestedChanges).length > 0) {
                    changedFields[key] = nestedChanges; // Store nested changes
                }
            } else if (currentValue !== newValue) {
                // Store only changed fields with their current values
                let value = '';
                if(typeof currentValue === 'boolean') {
                    value = currentValue;
                } else {
                    value = currentValue || null;
                }
                changedFields[key] = {
                    from: value,
                    to: newValue
                };
            }
        }
    }

    return changedFields;
};



module.exports = {logAction};
