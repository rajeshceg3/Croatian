// This module will be responsible for fetching data.
export function fetchData() {
    return fetch('data.geojson')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        });
}
