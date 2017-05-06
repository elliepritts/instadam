$(function() {

    $('.js-fetch-form').submit(function() {
        var username = $(this).find('[name="username"]').val();
        // TODO: clean up username if its actually a url

        return false;
    });

});
