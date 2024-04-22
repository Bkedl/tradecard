function clearFilters() {
    document.getElementById('pokemonNameSearchKey').value = ''; // Clear search input field

    // Clear checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Clear radio buttons
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });

    document.getElementById('searchForm').submit(); // Submit the form to clear filters
}
