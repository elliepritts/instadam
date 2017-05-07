$(function() {

    $('template').each(function() {
        var $template = $(this);
        $template.data('outlet', $('<div/>').insertAfter($template));
    });

    $('body')
        .on('click', '.photo', function() {
            $(this).toggleClass('active');
        })
        .on('click', '.js-load-more', function() {
            var $button = $(this).prop('disabled', true).html('...');
            var username = $('.js-fetch-form [name="username"]').val();
            var max_id = $('.js-photos .photo:last-child').attr('data-id');

            var Photos = $.get(['', 'api', username, 'photos', max_id].join('/'));

            Photos.then(injectPhotos).then(function() {
                $button.prop('disabled', false).html('Load More');
            });
        })
        .on('submit', '.js-fetch-form', function() {
            var $button = $(this).find('button').prop('disabled', true).html('...');
            var username;

            try {
                username = /^(?:https?:\/\/www.instagram.com\/)?([^\/?#]+)/.exec($(this).find('[name="username"]').val())[1];
            } catch(e) {
                return false;
            }

            var Profile = $.get(['', 'api', username].join('/'));
            var Photos = Profile.then(function(data) {
                return data.photos;
            });

            // Clean up photos, show the bottom textarea
            Profile.then(function() {
                $button.prop('disabled', false).html('&rarr;');
                $('.main-bottom').removeAttr('hidden');
                $('.js-photos').empty();
            });

            Profile.then(injectProfile);
            Photos.then(injectPhotos);

            return false;
        });
});

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

    $('.js-photos').append($photos);
}

function injectProfile(profile) {
    $('template').each(function() {
        var $template = $(this),
            $div = $template.data('outlet'),
            template = $template[0].innerHTML;

        $div.html(template.replace(/\{(.*)\}/gi, function(match, key) {
            return profile[key];
        }));
    });
}
