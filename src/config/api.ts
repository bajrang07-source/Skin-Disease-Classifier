// API Configuration - Update this URL to match your XAMPP htdocs path
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/skin-health-hub-main/skin-health-hub-main/api';

export const API_ENDPOINTS = {
    // Auth
    LOGIN: `${API_BASE_URL}/auth/login.php`,
    SIGNUP: `${API_BASE_URL}/auth/signup.php`,

    // Users
    DOCTORS: `${API_BASE_URL}/users/doctors.php`,
    PROFILE: `${API_BASE_URL}/users/profile.php`,
    UPDATE_PROFILE: `${API_BASE_URL}/users/update_profile.php`,

    // Appointments
    BOOK_APPOINTMENT: `${API_BASE_URL}/appointments/book.php`,
    LIST_APPOINTMENTS: `${API_BASE_URL}/appointments/list.php`,
    UPDATE_APPOINTMENT_STATUS: `${API_BASE_URL}/appointments/update_status.php`,

    // Predictions
    UPLOAD_IMAGE: `${API_BASE_URL}/predict/upload.php`,
    SAVE_PREDICTION: `${API_BASE_URL}/predict/save.php`,
    PREDICTION_HISTORY: `${API_BASE_URL}/predict/history.php`,

    // Heatmap
    SAVE_HEATMAP: `${API_BASE_URL}/heatmap/save.php`,

    // Calls
    SCHEDULE_CALL: `${API_BASE_URL}/calls/callSchedule.php`,
};

export default API_BASE_URL;
