var scraper = require('insta-scraper');

module.exports = {
    scrapeProfile: function scrape(username) {
        return new Promise((resolve, reject) => {
            scraper.getAccountInfo(username, function(error, data) {
                if (error) {
                    return reject(error);
                }

                const { biography, external_url, followed_by, full_name, username } = data;

                const photos = data.media.nodes
                    .map(node => {
                        return {
                            id: node.id,
                            dimensions: node.dimensions,
                            is_video: node.is_video,
                            display_src: node.display_src,
                            caption: node.caption,
                            comments: node.comments.count,
                            likes: node.likes.count,
                        }
                    })
                    .filter(node => !node.is_video);

                resolve({ biography, external_url, followed_by: followed_by.count, full_name, username, photos });
            });
        });
    },
    scrapePhotos: function photos(username, max_id) {
        return new Promise((resolve, reject) => {
            scraper.getAccountMedia(username, max_id, function(error, data) {
                if (error) {
                    return reject(error);
                }

                const photos = data.map(node => {
                    return {
                        id: node.id,
                        dimensions: { width: node.images.standard_resolution.width, height: node.images.standard_resolution.height },
                        is_video: 'video' === node.type,
                        display_src: node.images.standard_resolution.url,
                        caption: node.caption ? node.caption.text : null,
                        comments: node.comments.count,
                        likes: node.likes.count,
                    }
                })
                .filter(node => !node.is_video);

                resolve(photos);
            });
        });
    }
};
