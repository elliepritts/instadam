$(function() {

    $('template').each(function() {
        var $template = $(this);
        $template.data('outlet', $('<div/>').insertAfter($template));
    });

    $('body')
        .on('click', '.photo', function() {
            $(this).parent().toggleClass('is-active');

            var activeCount = $('.is-active').length;

            if (activeCount > 12) {
                alert('Please select at most 12 photos');
                $(this).parent().toggleClass('is-active');
                return false;
            }

            $('.js-photos').attr('data-count', activeCount);
        })
        .on('click', '.js-load-more', function() {
            var $button = $(this).prop('disabled', true).html('...');
            var username = parseUsername($('[name="username"]').val());
            var max_id = $('.js-photos .photo-container:last-child').attr('data-id');

            if (!username) {
                alert('Sorry, but I do not recognize this as a valid username or instagram URL');
                return false;
            }

            var Photos = $.get(['', 'api', username, 'photos', max_id].join('/'));

            Photos.then(injectPhotos).then(function() {
                $button.prop('disabled', false).html('Load More');
            });
        })
        .on('submit', '.js-fetch-form', function() {
            var $button = $(this).find('button').prop('disabled', true).html('...');
            var username = parseUsername($(this).find('[name="username"]').val());

            if (!username) {
                alert('Sorry, but I do not recognize this as a valid username or instagram URL');
                return false;
            }

            document.title = username;

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

function parseUsername(username) {
    try {
        return /^(?:(?:https?:\/\/)?(?:www.)?instagram.com\/)?([^\/?#]+)/.exec(username)[1];
    } catch(e) {
        return false;
    }
}

function injectPhotos(photos) {
    var $photos = $($.parseHTML(
        photos.map(function(photo) {
            return '<div class="photo-container" data-id="' +
            photo.id + '"><img class="photo" src="' +
            photo.display_src + '" alt=""></div>';
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
            return profile[key] || '';
        }));
    });
}
