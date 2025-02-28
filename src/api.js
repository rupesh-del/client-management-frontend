import axios from "axios";

// Use the live backend URL on Render
const API_BASE_URL = "https://client-management-backend-8x91.onrender.com";

/**
 * Get all insurance clients from the PostgreSQL database
 */
export const getClients = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/clients`);
    return response.data;
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
};

/**
 * Get a specific insurance client by ID
 */
export const getClientById = async (clientId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/clients/${clientId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching client with ID ${clientId}:`, error);
    return null;
  }
};

/**
 * Upload policy document to AWS S3
 */
export const uploadPolicyDocument = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.fileUrl; // Returns uploaded S3 file URL
  } catch (error) {
    console.error("Error uploading policy document:", error);
    return null;
  }
};

/**
 * Add a new insurance client (stores data in PostgreSQL)
 */
export const addClient = async (clientData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/clients`, clientData);
    return response.data;
  } catch (error) {
    console.error("Error adding client:", error);
    return null;
  }
};

/**
 * Update an existing insurance client in PostgreSQL
 */
export const updateClient = async (clientId, updatedData) => {
  try {
    console.log(`🔄 Updating client with ID ${clientId}:`, updatedData);

    const response = await axios.put(`${API_BASE_URL}/clients/${clientId}`, updatedData, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error) {
    console.error(`❌ Error updating client with ID ${clientId}:`, error.response?.data || error);
    return null;
  }
};


/**
 * Delete a client from the PostgreSQL database
 */
export const deleteClient = async (clientId) => {
  try {
    await axios.delete(`${API_BASE_URL}/clients/${clientId}`);
    return true;
  } catch (error) {
    console.error("Error deleting client:", error);
    return false;
  }
};

/**
 * Delete an attachment from AWS S3
 */
export const deleteAttachment = async (fileUrl) => {
  try {
    await axios.delete(`${API_BASE_URL}/delete-file`, { data: { fileUrl } });
    return true;
  } catch (error) {
    console.error(`Error deleting attachment: ${fileUrl}`, error);
    return false;
  }
};
