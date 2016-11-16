
// Userlist data array for filling in info box
var pokemonListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populatePokemonTable();

    $('#btnAddPokemon').on('click', addPokemon);

    $('#pokemonList table tbody').on('click', 'td a.linkdeletepokemon', deletePokemon);
});

// Functions =============================================================

// Fill table with data
function populatePokemonTable() {

    // Empty content string
    var pokemonTableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/admin/pokemon', function( data ) {
        pokemonListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            pokemonTableContent += '<tr>';
            pokemonTableContent += '<td>' + this.pid + '</td>';
            pokemonTableContent += '<td>' + this.name + '</td>';
            pokemonTableContent += '<td>' + this.lat + '</td>';
            pokemonTableContent += '<td>' + this.lng + '</td>';
            pokemonTableContent += '<td><a href="#" class="linkdeletepokemon" rel="' + this._id + '">Verwijder</a></td>';
            pokemonTableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#pokemonList table tbody').html(pokemonTableContent);
    });
};

function addPokemon(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addPokemon input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newPokemon = {
            'pid': $('#addPokemon input#inputPokemonId').val(),
            'name': $('#addPokemon input#inputPokemonName').val(),
            'lat': $('#addPokemon input#inputLatitude').val(),
            'lng': $('#addPokemon input#inputLongtitude').val(),
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newPokemon,
            url: '/admin/pokemon',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {
                $('#addPokemon input').val(''); // Clear the form inputs
                populatePokemonTable(); // Update the table
            }
            else
            {
                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);
            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete User
function deletePokemon(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this pokemon?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/admin/pokemon/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populatePokemonTable();
        });
    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};