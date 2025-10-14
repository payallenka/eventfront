// Reusable API call function
export const apiCall = async (url, options = {}) => {
  const token = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });
    
    // If we get a 401 (Unauthorized) and we have a token, the token might be invalid
    if (response.status === 401 && token) {
      localStorage.removeItem('authToken');
      // Retry without token
      const retryHeaders = {
        'Content-Type': 'application/json',
        ...options.headers,
      };
      const retryResponse = await fetch(url, { ...options, headers: retryHeaders });
      
      if (retryResponse.ok) {
        // Handle 204 No Content responses (like DELETE operations)
        if (retryResponse.status === 204) {
          return null;
        }
        const data = await retryResponse.json();
        return data;
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    // Handle 204 No Content responses (like DELETE operations)
    if (response.status === 204) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (networkError) {
    console.error('Network error:', networkError);
    // Check if it's a network connectivity issue
    if (networkError.name === 'TypeError' && networkError.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please check if the backend is running on http://localhost:8080');
    }
    throw networkError;
  }
};
