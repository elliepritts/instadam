var request = require('request-promise-native').defaults({ json: true });

module.exports.scrapeProfile = username => request('https://www.instagram.com/' + username + '/?__a=1')
    .then(function({ user }) {
        const { biography, external_url, followed_by, full_name, username } = user;

        const photos = user.media.nodes
            .map(node => {
                return {
                    id: node.id,
                    is_video: node.is_video,
                    display_src: node.display_src,
                    caption: node.caption,
                    comments: node.comments.count,
                    likes: node.likes.count,
                }
            })
            .filter(node => !node.is_video);

        return { biography, external_url, followed_by: followed_by.count, full_name, username, photos };
    })
    .catch(function(error) {
        return Promise.reject({error: 'An error occured (' + error.statusCode + ')' });
    });

module.exports.scrapePhotos = (username, max_id) => request('https://www.instagram.com/' + username + '/media/?__a=1&max_id=' + max_id)
    .then(function({ items }) {
        return photos = items.map(node => {
            return {
                id: node.id,
                is_video: 'video' === node.type,
                display_src: node.images.standard_resolution.url,
                caption: node.caption ? node.caption.text : null,
                comments: node.comments.count,
                likes: node.likes.count,
            }
        }).filter(node => !node.is_video);
    })
    .catch(function(error) {
        return Promise.reject({error: 'An error occured (' + error.statusCode + ')' });
    });
