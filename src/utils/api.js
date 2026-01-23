export const authenticatedFetch = async (url, options = {}) => {
    const token = localStorage.getItem('token');

    // Create headers object if it doesn't exist
    const headers = options.headers ? new Headers(options.headers) : new Headers();

    // Add Authorization header if token exists
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    // Update options with new headers
    const newOptions = {
        ...options,
        headers
    };

    try {
        const response = await fetch(url, newOptions);

        // Check for 401 Unauthorized
        if (response.status === 401) {
            // Clear token
            localStorage.removeItem('token');
            // Redirect to login
            window.location.href = '/login';
            return response; // Return response so caller can handle it if needed (though redirect happens)
        }

        return response;
    } catch (error) {
        throw error;
    }
};
