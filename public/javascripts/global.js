
// Userlist data array for filling in info box
var locationListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

    $('#locationList table tbody').on('click', 'td a.linkshowlocation', showLocationInfo);

    $('#btnAddLocation').on('click', addLocation);
});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';


    // jQuery AJAX call for JSON
    $.getJSON( '/admin/locationlist', function( data ) {
        locationListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td>' + this.pid + '</td>';
            tableContent += '<td><a href="#" class="linkshowlocation" rel="' + this.name + '">' + this.name + '</a></td>';
            tableContent += '<td>' + this.lat + '</td>';
            tableContent += '<td>' + this.lng + '</td>';
            tableContent += '<td><a href="#" class="linkdeletelocation" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#locationList table tbody').html(tableContent);
    });
};

function showLocationInfo(event) {
    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisPokemonId = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = locationListData.map(function(arrayItem) { return arrayItem.name; }).indexOf(thisPokemonId);

    // Get our User Object
    var thisLocationObject = locationListData[arrayPosition];

    //Populate Info Box
    $('#locationInfoPid').text(thisLocationObject.pid);
    $('#locationInfoName').text(thisLocationObject.name);
    $('#locationInfoLat').text(thisLocationObject.lat);
    $('#locationInfoLng').text(thisLocationObject.lng);
}

function addLocation(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addLocation input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newLocation = {
            'pid': $('#addLocation fieldset input#inputLocationPid').val(),
            'name': $('#addLocation fieldset input#inputaddLocationName').val(),
            'lat': $('#addLocation fieldset input#inputaddLocationLat').val(),
            'lng': $('#addLocation fieldset input#inputaddLocationLng').val(),
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newLocation,
            url: '/admin/addlocation',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addlocation fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

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