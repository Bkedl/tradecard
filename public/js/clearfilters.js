function clearFilters() {
    document.getElementById('pokemonNameSearchKey').value = ''; // Clear search input field

    // Clear checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    document.getElementById('searchForm').submit(); // Submit the form to clear filters
}
 