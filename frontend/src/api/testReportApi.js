

export async function fetchTestReports({ customer, partName, material, startDate, endDate, page }) {
    try {
        const params = new URLSearchParams({
            customer: customer || '', // Handle null/undefined
            partName: partName || '',
            material: material || '',
            startDate: startDate || '',
            endDate: endDate || '',
            page: page || 1
        });
        const res = await fetch(`/api/testreports?${params}`);

        if (!res.ok) {
            // Handle HTTP errors (e.g., 400, 500)
            const errorData = await res.json(); // Attempt to get error message from JSON
            throw new Error(errorData.message || `Failed to fetch reports: ${res.status}`);
        }
        const result = await res.json();
        console.log("Fetch successful. Result:", result); // Log the result
        return result; //  Return parsed JSON
    } catch (error) {
        // Catch network errors, JSON parsing errors, and errors thrown above
        console.error('Error fetching test reports:', error);
        alert(`Error fetching test reports: ${error.message}`); // Show user-friendly error
        throw error; // Re-throw the error to be caught by caller if needed
    }
}

export async function fetchCustomers(page = 0, limit = 5) {
    try {
        const params = new URLSearchParams({ page, limit });
        const res = await fetch(`/api/testreports/customers?${params}`);

        if (!res.ok) {
            // Improved error handling: Get error message from server if available
            let errorMessage = `Failed to fetch customers: ${res.status}`;
            try {
                const errorData = await res.json();
                if (errorData && errorData.error) {
                    errorMessage = errorData.error; // Use server's error message
                }
            } catch (jsonError) {
                // If JSON parsing fails, keep the default message with status
                console.error("Error parsing error response:", jsonError);
            }
            throw new Error(errorMessage);
        }

        const data = await res.json();
        console.log("Fetch successful. Result:", data); // Log the result
        return data;
    } catch (error) {
        // Handle network errors and errors from non-ok responses
        console.error("Error fetching customers:", error);
        alert(`Error fetching customers: ${error.message}`); // Show user-friendly error message
        throw error; // Re-throw so caller can also handle
    }
}


export async function fetchParts(customer, page = 0, limit = 5) {
    try {
        const params = new URLSearchParams({ customer, page, limit });
        const res = await fetch(`/api/testreports/parts?${params}`);

        if (!res.ok) {
            // Improved error handling: Get error message from server if available
            let errorMessage = `Failed to fetch parts: ${res.status}`;
            try {
                const errorData = await res.json();
                if (errorData && errorData.error) {
                    errorMessage = errorData.error; // Use server's error message
                }
            } catch (jsonError) {
                // If JSON parsing fails, keep the default message with status
                console.error("Error parsing error response:", jsonError);
            }
            throw new Error(errorMessage);
        }

        const data = await res.json();
        console.log("Fetch successful. Result:", data); // Log the result
        return data;
    } catch (error) {
        // Handle network errors and errors from non-ok responses
        console.error("Error fetching parts:", error);
        alert(`Error fetching parts: ${error.message}`); // Show user-friendly error message
        throw error; // Re-throw so caller can also handle
    }
}

export async function fetchReportsByParts(customer, partName, material, page = 0, limit = 5) {
    try {
        const params = new URLSearchParams({ customer, partName, material, page, limit });
        const res = await fetch(`/api/testreports/reports?${params}`);

        if (!res.ok) {
            // Improved error handling: Get error message from server if available
            let errorMessage = `Failed to fetch reports by parts: ${res.status}`;
            try {
                const errorData = await res.json();
                if (errorData && errorData.error) {
                    errorMessage = errorData.error; // Use server's error message
                }
            } catch (jsonError) {
                // If JSON parsing fails, keep the default message with status
                console.error("Error parsing error response:", jsonError);
            }
            throw new Error(errorMessage);
        }

        const data = await res.json();
        console.log("Fetch successful. Result:", data); // Log the result
        return data;
    } catch (error) {
        // Handle network errors and errors from non-ok responses
        console.error("Error fetching reports by parts:", error);
        alert(`Error fetching reports: ${error.message}`); // Show user-friendly error message
        throw error; // Re-throw so caller can also handle
    }
}

// Handles all API calls for test reports
export async function fetchParameters(customer, partName, material) {
  try {
    console.log(`Calling fetchParameters with customer: ${customer}, partName: ${partName}, material: ${material}`);
    const params = new URLSearchParams({ customer, partName, material });
    const res = await fetch(`/api/testreports/parameters?${params}`);

    if (!res.ok) {
      let errorMessage = `Failed to fetch parameters: ${res.status}`;
      try {
        const errorData = await res.json();
        if (errorData && errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (jsonError) {
        console.error("Error parsing error response:", jsonError);
      }
      throw new Error(errorMessage);
    }

    const result = await res.json();
    console.log("fetchParameters successful. Result:", result);
    return result;
  } catch (error) {
    console.error("Error fetching parameters:", error);
    alert(`Error fetching parameters: ${error.message}`);
    throw error;
  }
}

export async function createTestReport(data) {
  try {
    console.log("Calling createTestReport with data:", data);
    const res = await fetch('/api/testreports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      let errorMessage = `Failed to create test report: ${res.status}`;
      try {
        const errorData = await res.json();
        if (errorData && errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (jsonError) {
        console.error("Error parsing error response:", jsonError);
      }
      throw new Error(errorMessage);
    }

    const result = await res.json();
    console.log("createTestReport successful. Result:", result);
    return result;
  } catch (error) {
    console.error("Error creating test report:", error);
    alert(`Error creating test report: ${error.message}`);
    throw error;
  }
}

export async function editTestReport(id, data) {
  try {
    console.log(`Calling editTestReport with id: ${id} and data:`, data);
    const res = await fetch(`/api/testreports/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      let errorMessage = `Failed to edit report: ${res.status}`;
      try {
        const errorData = await res.json();
        if (errorData && errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (jsonError) {
        console.error("Error parsing error response:", jsonError);
      }
      throw new Error(errorMessage);
    }

    const result = await res.json();
    console.log("editTestReport successful. Result:", result);
    return result;
  } catch (error) {
    console.error("Error editing test report:", error);
    alert(`Error editing test report: ${error.message}`);
    throw error;
  }
}

export async function getReportById(id) {
  try {
    console.log(`Calling getReportById with id: ${id}`);
    const res = await fetch(`/api/testreports/report/${id}`);

    if (!res.ok) {
      let errorMessage = `Failed to get report: ${res.status}`;
      try {
        const errorData = await res.json();
        if (errorData && errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (jsonError) {
        console.error("Error parsing error response:", jsonError);
      }
      throw new Error(errorMessage);
    }

    const result = await res.json();
    console.log("getReportById successful. Result:", result);
    return result;
  } catch (error) {
    console.error("Error getting report by ID:", error);
    alert(`Error getting report: ${error.message}`);
    throw error;
  }
}


export async function fetchCustomerSuggestions(query) {
  const res = await fetch(`/api/testreports/suggestions/customer?customer=${encodeURIComponent(query)}`);
  const data = await res.json();
  // Remove duplicates and return array of { customer }
  const seen = new Set();
  return data.filter(r => {
    if (!r.customer || seen.has(r.customer)) return false;
    seen.add(r.customer);
    return true;
  });
}

export async function fetchPartNameSuggestions(query) {
  const res = await fetch(`/api/testreports/suggestions/part-name?partName=${encodeURIComponent(query)}`);
  const data = await res.json();
  const seen = new Set();
  return data.filter(r => {
    if (!r.partName || seen.has(r.partName)) return false;
    seen.add(r.partName);
    return true;
  });
}

export async function fetchMaterialSuggestions(query) {
  const res = await fetch(`/api/testreports/suggestions/material?material=${encodeURIComponent(query)}`);
  const data = await res.json();
  const seen = new Set();
  return data.filter(r => {
    if (!r.material || seen.has(r.material)) return false;
    seen.add(r.material);
    return true;
  });
}
