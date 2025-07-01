export const BASE_URL = "https://job-ready-bf3r.onrender.com"; 

export const API_PATHS = {
  AUTH: {
    REGISTER: `${BASE_URL}/api/auth/register`,
    LOGIN: `${BASE_URL}/api/auth/login`,
    GET_PROFILE: `${BASE_URL}/api/auth/profile`,
  },
  IMAGE: {
    UPLOAD_IMAGE: `${BASE_URL}/api/auth/upload-image`,
  },
  AI: {
    GENERATE_QUESTIONS: `${BASE_URL}/api/ai/generate-Questions`,
    GENERATE_EXPLANATION: `${BASE_URL}/api/ai/generate-explanation`,
  },
  SESSION: {
    CREATE: `${BASE_URL}/api/sessions/create`,
    GET_ALL: `${BASE_URL}/api/sessions/my-sessions`,
    GET_ONE: (id) => `${BASE_URL}/api/sessions/${id}`,
    DELETE: (id) => `${BASE_URL}/api/sessions/${id}`,
  },
  QUESTION: {
    ADD_TO_SESSION: `${BASE_URL}/api/questions/add`,
    PIN: (id) => `${BASE_URL}/api/questions/${id}/pin`,
    UPDATE_NOTE: (id) => `${BASE_URL}/api/questions/${id}/note`,
  },
};
