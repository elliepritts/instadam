function injectPhotos(photos) {
    var $photos = $($.parseHTML(
        photos.map(function(photo) {
            return '<div class="photo" style="background-image:url(' +
                photo.display_src + ')" data-id="' + photo.id +
                '" data-src="' + photo.display_src +
                '"><span class="spacer" style="padding-top:' +
                ((photo.dimensions.height / photo.dimensions.width) * 100) +
                '%"></span></div>';
        }).join('')
    ));

    $('.page-photos .photos').append($photos);
};

$(function() {

    $('.js-fetch-form').submit(function() {
        var username = $(this).find('[name="username"]').val();
        // TODO: clean up username if its actually a url


        var Profile = $.get(['', 'api', username].join('/'));
        var Photos = Profile.then(function(data) {
            return data.photos;
        });


        Photos.then(injectPhotos).then(function() {
            $('.page-photos').removeAttr('hidden');
        });

        return false;
    });

    $('.js-load-more').click(function() {
        var username = $('.js-fetch-form [name="username"]').val();
        var max_id = $('.page-photos .photos .photo').last().attr('data-id');

        var Photos = $.get(['', 'api', username, 'photos', max_id].join('/'));

        Photos.then(injectPhotos);
    });

});
