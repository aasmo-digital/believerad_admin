import axios from "axios";
import { API_ENDPOINTS, API_BASE_URL } from "../API/authApi";
import axiosInstance from "../../interceptor";

const token = localStorage.getItem('token');
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(API_ENDPOINTS.REGISTER, userData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        console.error("Error in registerUser function:", error);
        throw error;
    }
};



export const loginUser = async (userData) => {
    try {
        const response = await axios.post(API_ENDPOINTS.LOGIN, userData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response;
    } catch (error) {
        console.error("Error in registerUser function:", error);
        throw error;
    }
};

export const addZips = async (data) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.GENERATE_ZIPS, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        return response?.data;
    } catch (error) {
        console.error("Error in function:", error);
        throw error;
    }
};

export const getAllZips = async () => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.GET_ALL_ZIPS, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return response?.data?.zipRecords;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return { categories: [], totalPages: 1 };
    }
};
export const downloadByIdZip = async (id) => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.DOWNLOAD_BYID_ZIPS(id), {
            headers: { Authorization: `Bearer ${token}` },
            responseType: 'blob', // 🔥 This ensures the response is treated as a file
        });

        // Create a blob and trigger download
        const blob = new Blob([response.data], { type: 'application/zip' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `patients_data_${id}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        return response;
    } catch (error) {
        console.error("Error fetching zip file:", error);
        throw error;
    }
};

export const deleteZips = async (id) => {
    try {
        const response = await axiosInstance.delete(API_ENDPOINTS.DELETE_ZIPS(id), {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response?.data?.data;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};

export const addUser = async (userData) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(API_ENDPOINTS.ADD_USER, userData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error in addUser function:", error);
        throw error.response?.data || { message: "Something went wrong" };
    }
};

export const getAllUsers = async (search = "", page = 1) => {
    try {
        const token = localStorage.getItem('token');

        const response = await axiosInstance.get(API_ENDPOINTS.GET_ALL_USERS, {
            params: { search, page, limit: 10 },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("API Response:", response.data);

        return {
            users: response.data.users,
            totalPages: response.data.totalPages,
        };
    } catch (error) {
        console.error("Error fetching users:", error);
        return { users: [], totalPages: 1 };
    }
};


export const getAllUsersWithoutSearch = async () => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.GET_ALL_USERS, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });


        return response?.data
    } catch (error) {
        console.error("Error fetching categories:", error);

    }
};

export const deleteUser = async (id) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.delete(API_ENDPOINTS.DELETE_USER(id), {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};

export const getbyidUser = async (id) => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.GETBYID_USER(id), {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response?.data;
    } catch (error) {
        console.error("Error feching user:", error);
        throw error;
    }
};


export const updateByIDUser = async (id, userData,) => {
    try {
        const response = await axiosInstance.put(API_ENDPOINTS.UPDATEBYID_USER(id), userData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}` // Ensure token is correctly passed
            }
        });
        return response?.data;
    } catch (error) {
        console.error("Error in updateByIDUser function:", error);
        throw error;
    }
};


export const importUser = async (data) => {
    try {

        const response = await axiosInstance.post(API_ENDPOINTS.IMPORT_USER, { users: data }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response?.data;
    } catch (error) {
        console.error("Error importing users:", error);
        throw error;
    }
};

export const addCategory = async (data) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.ADD_CATEGORY, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        return response?.data;
    } catch (error) {
        console.error("Error in function:", error);
        throw error;
    }
};



export const getAllCategory = async (search = "", page = 1) => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.GETALL_CATEGORY, {
            headers: { Authorization: `Bearer ${token}` },
            params: { search, page, limit: 10 },
        });

        if (response?.data?.data) {
            return {
                categories: response?.data?.data,  // Changed 'users' to 'categories'
                totalPages: response?.data.totalPages,
            };
        }
        return { categories: [], totalPages: 1 };
    } catch (error) {
        console.error("Error fetching categories:", error);
        return { categories: [], totalPages: 1 };
    }
};

export const getAllCategoryWithoutSearch = async () => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.GETALL_CATEGORY, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return response?.data?.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return { categories: [], totalPages: 1 };
    }
};

export const deleteCategory = async (id) => {
    try {
        const response = await axiosInstance.delete(API_ENDPOINTS.DELETE_CATEGORY(id), {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response?.data?.data;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};

export const getbyidCategory = async (id) => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.GETBYID_CATEGORY(id), {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response?.data?.data;
    } catch (error) {
        console.error("Error feching user:", error);
        throw error;
    }
};


export const updateByIDCategory = async (userData, id) => {
    try {
        const response = await axiosInstance.put(API_ENDPOINTS.UPDATEBYID_CATEGORY(id), userData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}` // Ensure token is correctly passed
            }
        });
        return response?.data;
    } catch (error) {
        console.error("Error in updateByIDUser function:", error);
        throw error;
    }
};

export const addMeasurements = async (data) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.ADD_MESUREMENT, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        return response?.data;
    } catch (error) {
        console.error("Error in function:", error);
        throw error;
    }
};

export const getAllMeasurements = async (search = "") => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.GETALL_MESUREMENT, {
            headers: { Authorization: `Bearer ${token}` },
            params: { search },
        });

        if (response?.data?.data) {
            return {
                categories: response?.data?.data,
                // totalPages: response?.data.totalPages,
            };
        }
        return { categories: [] };
    } catch (error) {
        console.error("Error fetching categories:", error);
        return { categories: [] };
    }
};

export const deleteMeasurements = async (id, deleteEntireMeasurement) => {
    try {
        const response = await axiosInstance.delete(API_ENDPOINTS.DELETE_MESUREMENT(id), {
            headers: { Authorization: `Bearer ${token}` },
            data: {

                deleteEntireMeasurement
            }
        });
        return response?.data;
    } catch (error) {
        console.error("Error deleting measurement:", error);
        throw error;
    }
};

export const deleteMeasurementsPArticular = async (id, measurementId) => {
    try {
        const response = await axios.delete(API_ENDPOINTS.DELETE_MESUREMENT(id), {
            headers: { Authorization: `Bearer ${token}` },
            data: { measurementId }, // Send measurementId as part of the request body
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting measurement:", error);
        throw error;
    }
};

export const getbyidMeasurements = async (id) => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.GETBYID_MESUREMENT(id), {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response?.data;
    } catch (error) {
        console.error("Error feching user:", error);
        throw error;
    }
};

export const updateByIDMeasurements = async (userData, id) => {
    try {
        const response = await axiosInstance.put(API_ENDPOINTS.UPDATEBYID_MESUREMENT(id), userData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        return response?.data;
    } catch (error) {
        console.error("Error in updateByIDUser function:", error);
        throw error;
    }
};


export const getAllOrders = async (search = "", page = 1) => {
    try {

        const response = await axiosInstance.get(API_ENDPOINTS.GETALL_ORDERS, {
            headers: { Authorization: `Bearer ${token}` },
            params: { search, page, limit: 10 }
        });

        if (response?.data?.orders) {
            return {
                users: response.data.orders,
                totalPages: response.data.totalPages
            };
        }
        return { users: [], totalPages: 1 };
    } catch (error) {
        console.error("Error fetching users:", error);
        return { users: [], totalPages: 1 };
    }
};


export const updateByIDOrders = async (userData, id) => {
    try {
        const response = await axiosInstance.put(API_ENDPOINTS.UPDATEBYID_ORDERS(id), userData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}` // Ensure token is correctly passed
            }
        });
        return response?.data;
    } catch (error) {
        console.error("Error in updateByIDUser function:", error);
        throw error;
    }
};




export const getAllTaskWithoutSearch = async () => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.GET_ALL_TASK, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response?.data
    } catch (error) {
        console.error("Error fetching tasks:", error);

    }
};


export const getbyUserIdData = async (id) => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.GET_BY_USERID_TASK(id), {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error feching user:", error);
        throw error;
    }
};

export const updateData = async (id, userData) => {
    try {
        const response = await axiosInstance.put(API_ENDPOINTS.UPDATE_BY_DATA(id), userData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}` // Ensure token is correctly passed
            }
        });
        return response?.data;
    } catch (error) {
        console.error("Error in updateByIDUser function:", error);
        throw error;
    }
};


//ASSIGNED USER
export const assignUserTask = async (userData) => {
    try {
        // Check if token is available
        if (!token) {
            throw new Error('Token is missing. Please authenticate again.');
        }

        // Log the headers to check if token is included
        console.log("Authorization Header:", `Bearer ${token}`);

        const response = await axios.post(API_ENDPOINTS.ASSINGED_TASK_USER, userData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // token being sent here
            }
        });

        return response; // Return only the data
    } catch (error) {
        console.error("Error in assignUserTask function:", error);
        throw error.response?.data || { message: "Something went wrong" };
    }
};





export const deleteAssignTask = async (id) => {
    try {
        const response = await axiosInstance.delete(API_ENDPOINTS.DELETE_ASSIGN_TASK(id), {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response?.data?.data;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};

export const getbyidAssignTask = async (id) => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.GETBYID_ASSIGN_TASK(id), {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response?.data;
    } catch (error) {
        console.error("Error feching user:", error);
        throw error;
    }
};


export const updateByIDAssignTask = async (id, userData,) => {
    try {
        const response = await axiosInstance.put(API_ENDPOINTS.UPDATEBYID_ASSIGN_TASK(id), userData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}` // Ensure token is correctly passed
            }
        });
        return response?.data;
    } catch (error) {
        console.error("Error in updateByIDUser function:", error);
        throw error;
    }
};


export const deleteUserAssignTask = async (id) => {
    try {
        const response = await axiosInstance.delete(API_ENDPOINTS.DELETE_USERID_TASK(id), {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response?.data;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};


//data
export const getAlldata = async (search, page = 1) => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.GET_ALL_DATA, {
            params: { search, page, limit: 10 },
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response?.data?.data) {
            return {
                data: response?.data?.data,
                totalPages: response?.data.totalPages,
            };
        }
        return { data: [], totalPages: 1 };
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return { data: [], totalPages: 1 };
    }
};

export const deleteAssignData = async (id) => {
    try {
        const response = await axiosInstance.delete(API_ENDPOINTS.DELETE_USERID_TDATA(id), {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response?.data?.data;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};

export const getbyidAssignData = async (id) => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.GET_BY_USERID_DATA(id), {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response?.data;
    } catch (error) {
        console.error("Error feching user:", error);
        throw error;
    }
};


export const updateByIDAssignData = async (id, userData) => {
    try {
        const response = await axiosInstance.put(API_ENDPOINTS.UPDATE_BY_DATA(id), userData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Ensure token is correctly passed
            },
        });
        return response?.data; // Return the response from the API to be used in the frontend
    } catch (error) {
        console.error("Error in updateByIDUser function:", error);
        throw error;
    }
};

export const getAllTimeslots = async () => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.GET_ALL_TIMESLOTS, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });


        return response?.data
    } catch (error) {
        console.error("Error fetching categories:", error);

    }
};

export const addLocation = async (formData) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.CREATE_LOCATION, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`, // add token if needed
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || "Error adding location");
    }
};

export const getAllLocations = async () => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.GET_ALL_LOCATIONS, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });


        return response.data
    } catch (error) {
        console.error("Error fetching categories:", error);

    }
};

export const uploadMedia = async (formData, token) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.UPLOAD_MEDIA, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        return response?.data;
    } catch (error) {
        console.error('Error uploading media:', error);
        throw error;
    }
};

export const getSlotsByLocation = async (locationId, date) => {
    try {
        const response = await axiosInstance.get(`${API_ENDPOINTS.GET_SLOTS_BY_LOCATION(locationId)}`, // Use the template literal to construct the URL
            {
                params: { date }, // This turns into ?date=YYYY-MM-DD
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );

        return response?.data;
    } catch (error) {
        console.error('Error fetching slots by location:', error);
        throw error;
    }
};

export const fetchPlaylist = async (locationId) => {
    try {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        const response = await axiosInstance.get(`${API_ENDPOINTS.FETCH_PLAYLIST(locationId)}`, {
            method: 'GET', // Specify the request method
            headers: {
                Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch playlist data');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching playlist:', error);
        throw error;
    }
};


export const updateLocation = async (id, updatedLocation) => {
    try {
        const response = await axiosInstance.put(`${API_ENDPOINTS.UPDATE_LOCATION}/${id}`, updatedLocation, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating location:", error);
        throw new Error("Failed to update location.");
    }
};

export const deleteLocation = async (id, token) => {
    try {
        const response = await axios.delete(`${API_ENDPOINTS.DELETE_LOCATION}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Add a new sub-admin
export const addSubadmin = async (formData) => {
    try {
        const response = await axios.post(API_ENDPOINTS.ADD_SUBADMIN, formData, {
            headers: {
                Authorization: `Bearer ${token}`, // Add token to headers for authorization
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : 'Failed to add user');
    }
};

export const getAllSubAdmins = async (searchTerm = '', page = 1) => {
    try {
        const response = await axios.get(API_ENDPOINTS.GET_ALL_SUBADMINS, {
            params: { searchTerm, page },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`, // Add token to headers for authorization
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : 'Failed to fetch sub-admins');
    }
};

// Delete a sub-admin
export const deleteSubAdmin = async (id) => {
    try {
        const response = await axios.delete(`${API_ENDPOINTS.DELETE_SUBADMIN}/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : 'Failed to delete sub-admin');
    }
};

// Update a sub-admin
export const updateSubAdmin = async (id, formData) => {
    try {
        const response = await axios.put(`${API_ENDPOINTS.UPDATE_SUBADMIN}/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : 'Failed to update sub-admin');
    }
};

//  slots distribution..
export const getAllBookedSlots = async (date) => {
    try {
        const response = await axios.get(`${API_ENDPOINTS.GET_ALL_BOOKED_SLOTS}?date=${date}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching booked slots:', error.message);
        throw error;
    }
};


// API call to get Peak Slots
export const getPeakSlots = async () => {
    try {
        const response = await axios.get(`${API_ENDPOINTS.BASE_URL}/admin/peak-slots`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching peak slots:', error);
        throw error;
    }
};

// API call to get Normal Slots
export const getNormalSlots = async () => {
    try {
        const response = await axios.get(`${API_ENDPOINTS.BASE_URL}/admin/normal-slots`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching normal slots:', error);
        throw error;
    }
};

// API call to get All Slots with user details to show in profile..
export const getUserSlotDetails = async (campaignBookingId) => {
    try {
        const token = localStorage.getItem('token'); // Adjust key if different

        const response = await axios.get(API_ENDPOINTS.GET_ALL_SLOTS_PROFILE(campaignBookingId), {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching user slot details:", error);
        return null;
    }
};

export const addCampaign = async (formData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(API_ENDPOINTS.ADD_CAMPAIGN, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return response.data;
};

export const getUserById = async (id) => {
    try {
        const response = await axios.get(API_ENDPOINTS.GET_USER_PROFILE_DATA(id), {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        return null;
    }
};
