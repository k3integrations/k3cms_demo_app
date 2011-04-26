K3cms_S3Podcast = {
  config: {
    pagination: {
      per_row: 4,
    },
  },

  fix_clears: function() {
    $('.k3cms_s3_podcast.episode_list .the_list>.k3cms_s3_podcast_episode.show_small').clear_every_nth_element(K3cms_S3Podcast.config.pagination.per_row);
  },
}

k3cms_s3_podcast_episode = {
  url_for: function(id) {
     return '/episodes/' + id;
  },

  // FIXME: We shouldn't have to duplicate all this presentation logic between Rails views and JS. Consider moving all views to a JS template library.
  // Then we can just pass the object to the template and completely re-render it, *replacing* the entire box, instead of trying to figure out which subelements need to be *updated*.
  updatePage: function(object_name, object_id, object, source_element) {
    K3cms_InlineEditor.updatePageFromObject(object_name, object_id, object, source_element)

    // TODO: Only update title if page title was originally set to @episode.title. Perhaps we should set some JS variable to indicate which object/attribute the page title was taken from?
    // For now, assume page title comes from the episode if there's only one episode on the page:
    if ($('.k3cms_s3_podcast_episode').length == 1) {
      $('title').html($.sanitizeString(object.title));
      $('h1 a').html(object.title);
    }

    //$('[data-object=' + object_name + '][data-object-id=' + object_id + '][data-attribute=' + attr_name + ']')

    var container = $('.k3cms_s3_podcast_episode#' + object_id);

    var link = container.find('.download_link a');
    link.attr('href', object.download_url);

    var img = container.find('.thumbnail img');
    img.attr('src', object.thumbnail_image_url);

    var video = container.find('video');
    video.attr('poster', object.thumbnail_image_url);
    video.find('source').each(function(i) {
      // TODO: Update src attribute
      //$(this).attr('src', '?');
    });

    container.find('.status.unpublished').remove();
    if (object['published?']) {
      container.addClass('published').removeClass('unpublished');
    } else {
      container.removeClass('published').addClass('unpublished');
      container.find('.status.unpublished').remove();
      // Duplicated with app/cells/k3cms/s3_podcast/episodes/published_status.html.haml
      container.find('.title').after($('<div>', {'class': 'status unpublished', text: 'Not yet published'}))
    }

    K3cms_Ribbon.set_saved_status(new Date(object.updated_at));
  },

  // Given a root element (jQuery object), it will extract the current state of the object from the DOM and return it as a JS object.
  get_object_from_page: function(root_element) {
  }
};


//==================================================================================================
// Generic, reusable code

(function($) {
  $.fn.clear_every_nth_element = function(n) {
    this.css('clear', 'none');
    this.filter(':visible').
      filter(function(index) {
        //console.debug("Considering clearing index=", index, ': ', this);
        //console.debug("clear it? ", (index % n == 0));
        return index % n == 0;
      }).
      css('clear', 'left')

  };

  // Trim and strip HTML from a string
  $.sanitizeString = function(s) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = s;
    s = tmp.textContent || tmp.innerText;
    return jQuery.trim(s);
  };

})(jQuery);

