// Fucntion to clear filters and reset the search criteria 
function clearFilters() {
    // Clear search bar for the pokemon name 
    document.getElementById('pokemonNameSearchKey').value = '';

    // Unchecks all boxes on page 
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Unchecks radio on page 
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });

    document.getElementById('searchForm').submit();
}
