
// export const API_BASE_URL =  "http://3.82.103.193:8000/api/admin"; 
// export const API_BASE_URL = "http://143.110.254.201:8000/api/admin";
// export const API_BASE_URL =  "https://d277w8h3-8000.inc1.devtunnels.ms/api/admin"; 
export const API_BASE_URL = "http://localhost:8000/api/admin";
// export const API_BASE_URL = "https://app.believerad.space/api/admin";

export const API_ENDPOINTS = {
  REGISTER: `${API_BASE_URL}/register`,
  LOGIN: `${API_BASE_URL}/login`,
  GENERATE_ZIPS: `${API_BASE_URL}/genrate-files`,
  GET_ALL_ZIPS: `${API_BASE_URL}/get-all-zips`,
  DOWNLOAD_BYID_ZIPS: (zipID) => `${API_BASE_URL}/downloadZip/${zipID}`,
  DELETE_ZIPS: (zipID) => `${API_BASE_URL}/delete-zip/${zipID}`,

  ADD_USER: `${API_BASE_URL}/add-user`,
  GET_ALL_USERS: `${API_BASE_URL}/getall-user`,
  DELETE_USER: (id) => `${API_BASE_URL}/delete-user/${id}`,
  GETBYID_USER: (id) => `${API_BASE_URL}/getbyid-user/${id}`,
  UPDATEBYID_USER: (id) => `${API_BASE_URL}/update-user/${id}`,
  IMPORT_USER: `${API_BASE_URL}/import`,
  EXPORT_USER: `${API_BASE_URL}/export`,

  ASSINGED_TASK_USER: `${API_BASE_URL}/assign-task`,
  GET_PAYMENT_REPORT: `${API_BASE_URL}   /payment-report`, // Replace 'your-route' with the actual path from your Express router


  DELETE_ASSIGN_TASK: (id) => `${API_BASE_URL}/delete-assign-task/${id}`,
  GETBYID_ASSIGN_TASK: (id) => `${API_BASE_URL}/getbyid-assign-task/${id}`,
  UPDATEBYID_ASSIGN_TASK: (id) => `${API_BASE_URL}/update-assign-task/${id}`,

  GET_BY_USERID_TASK: (userId) => `${API_BASE_URL}/getbyid-task/${userId}`,
  DELETE_USERID_TASK: (id) => `${API_BASE_URL}/deleteuserstask/${id}`,

  //update Task
  UPDATE_BY_TASK: (id) => `${API_BASE_URL}/update-task/${id}`,

  GET_ALL_DATA: `${API_BASE_URL}/getall-data`,
  UPLOAD_MEDIA: `${API_BASE_URL}/upload-media`,

  GET_BY_USERID_DATA: (userId) => `${API_BASE_URL}/getbyid-data/${userId}`,
  DELETE_USERID_TDATA: (id) => `${API_BASE_URL}/delete-data/${id}`,

  //update Task
  UPDATE_BY_DATA: (id) => `${API_BASE_URL}/update-data/${id}`,

  GET_ALL_TIMESLOTS: `${API_BASE_URL}/getall-timeslots`,
  GET_ALL_LOCATIONS: `${API_BASE_URL}/getall-location`,
  CREATE_LOCATION: `${API_BASE_URL}/add-location`,
  UPDATE_LOCATION: `${API_BASE_URL}/update-location`,
  DELETE_LOCATION: `${API_BASE_URL}/delete-location`,
  GET_SLOTS_BY_LOCATION: (locationId) => `/location/${locationId}`,
  FETCH_PLAYLIST: (locationId) => `${API_BASE_URL}/playlist/${locationId}`,

  // sub admin..
  ADD_SUBADMIN: `${API_BASE_URL}/create-subadmin`,
  GET_ALL_SUBADMINS: `${API_BASE_URL}/all-sub-admin`,
  UPDATE_SUBADMIN: `${API_BASE_URL}/update-subadmin`,
  DELETE_SUBADMIN: `${API_BASE_URL}/delete-subadmin`,

  // slots details..
  GET_ALL_BOOKED_SLOTS: `${API_BASE_URL}/individual-slots`,
  GET_ALL_SLOTS_PROFILE: (campaignBookingId) => `${API_BASE_URL}/user-slots/${campaignBookingId}`,
  ADD_CAMPAIGN: `${API_BASE_URL}/add-data`,
  GET_USER_PROFILE_DATA: (id) => `${API_BASE_URL}/getbyid-user/${id}`,

};


