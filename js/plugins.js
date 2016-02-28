// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

(function ($) {
    "use strict";
    $.picasa = {
        albums: function (user, callback) {
            var url = "http://picasaweb.google.com/data/feed/base/user/:user_id?alt=json&kind=album&hl=en_US&access=visible&fields=entry(id,media:group(media:content,media:description,media:keywords,media:title))";
            url = url.replace(/:user_id/, user);
            /*$.getJSON(url, function (data) {
                var album = null,
                    albums = [];
                $.each(data.feed.entry, function (i, element) {
                    album = {
                        id: element.id["$t"].split("?")[0].split("albumid/")[1],
                        title: element["media$group"]["media$title"]["$t"],
                        description: element["media$group"]["media$description"]["$t"],
                        thumb: element["media$group"]["media$content"][0]["url"]
                    };
                    album.images = function (callback) {
                        $.picasa.images(user, album.id, callback);
                    };
                    albums.push(album);
                });
                callback(albums);
            });*/

            $.ajax({
                dataType: "jsonp",
                url: url,
                success: function (data) {
                    console.log("ez uj - albums");
                    var album = null,
                        albums = [];
                    $.each(data.feed.entry, function (i, element) {
                        album = {
                            id: element.id["$t"].split("?")[0].split("albumid/")[1],
                            title: element["media$group"]["media$title"]["$t"],
                            description: element["media$group"]["media$description"]["$t"],
                            thumb: element["media$group"]["media$content"][0]["url"]
                        };
                        album.images = function (callback) {
                            $.picasa.images(user, album.id, callback);
                        };
                        albums.push(album);
                    });
                    callback(albums);
                }
            });
        },

        images: function (user, album, callback) {
            var url = "http://picasaweb.google.com/data/feed/base/user/:user_id/albumid/:album_id?alt=json&kind=photo&hl=en_US&fields=entry(title,gphoto:numphotos,media:group(media:content,media:thumbnail))",
                image = null,
                images = [];
            url = url.replace(/:user_id/, user).replace(/:album_id/, album);
            /*$.getJSON(url, function (data) {
                $.each(data.feed.entry, function (i, element) {
                    image = element["media$group"]["media$content"][0];
                    image.title = element.title["$t"];
                    image.thumbs = [];
                    $.each(element["media$group"]["media$thumbnail"], function (j, j_element) {
                        image.thumbs.push(j_element);
                    });
                    images.push(image);
                });
                callback(images);
            });*/

            $.ajax({
                dataType: "jsonp",
                url: url,
                success: function (data) {
                $.each(data.feed.entry, function (i, element) {
                    console.log("ez uj - images");
                    image = element["media$group"]["media$content"][0];
                    image.title = element.title["$t"];
                    image.thumbs = [];
                    $.each(element["media$group"]["media$thumbnail"], function (j, j_element) {
                        image.thumbs.push(j_element);
                    });
                    images.push(image);
                });
                callback(images);
            }
            });
        }
    };

    $.fn.picasaAlbums = function (user, callback) {
        $.picasa.albums(user, function (images) {
            if (callback) {
                callback(images);
            }
        });
    };

    $.fn.picasaGallery = function (user, album, callback) {
        var scope = $(this);
        $.picasa.images(user, album, function (images) {
            if (callback) {
                callback.apply(scope, images);
            } else {
                var picasaAlbum = "<ul class='picasa-album'>\n";
                $.each(images, function (i, element) {
                    picasaAlbum += "  <li class='picasa-image'>\n";
                    picasaAlbum += "    <a rel='prettyPhoto[PlatanApartman]' href='" + element.url + "' title='" + element.title + "'>\n";
                    picasaAlbum += "      <img src='" + element.thumbs[1].url + "'/>\n";
                    picasaAlbum += "    </a>\n";
                    picasaAlbum += "  </li>\n";
                });
                picasaAlbum += "</ul>";
                scope.append(picasaAlbum);
                $("#picasa-gallery a").prettyPhoto({
                    social_tools: false
                });
            }
        });
    };
}(jQuery));
