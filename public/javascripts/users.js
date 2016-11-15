
// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateUserTable();

    $('#btnAddUser').on('click', addUser);

    $('#usersList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
});

// Functions =============================================================

// Fill table with data
function populateUserTable() {

    // Empty content string
    var userTableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/admin/userlist', function( data ) {
        userListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            userTableContent += '<tr>';
            userTableContent += '<td>' + this.local.username + '</td>';
            userTableContent += '<td>' + this.Admin + '</td>';
            userTableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">Verwijder</a></td>';
            userTableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#usersList table tbody').html(userTableContent);
    });
};

function addUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'username': $('#addUser input#inputUserName').val(),
            'password': $('#addUser input#inputUserPass').val(),
            'Admin': ($('#addUser input#inputUserAdmin').is(':checked')) ? 'on' : 'off',
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/admin/user',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#adduser fieldset input').val('');

                // Update the table
                populateUserTable();

                console.log('refreshed the user set');
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

// Delete User
function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/admin/user/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateUserTable();
        });
    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};