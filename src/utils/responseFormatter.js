// utils/responseFormatter.js
export const formatSuccessResponse = (data, message = 'Success') => {
    return { status: 'success', message, data };
};

export const formatErrorResponse = (error, message = 'An error occurred') => {
    return { status: 'error', message, error: error.message || error };
};
