// This module will be responsible for fetching data.
export function fetchData() {
    return fetch('data.geojson')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            throw error; // Re-throw the error to be caught by the caller
        });
}
