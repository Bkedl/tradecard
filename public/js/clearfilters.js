function clearFilters() {
    document.getElementById('pokemonNameSearchKey').value = '';


    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });


    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });

    document.getElementById('searchForm').submit();
}
