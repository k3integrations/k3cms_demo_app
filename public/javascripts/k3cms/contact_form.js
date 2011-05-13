K3cms_ContactForm = {
}

k3cms_contact_form_contact_form = {
  url_for: function(object) {
     return '/contact_forms/' + object.id;
  },

  // FIXME: We shouldn't have to duplicate all this presentation logic between Rails views and JS. Consider moving all views to a JS template library.
  // Then we can just pass the object to the template and completely re-render it, *replacing* the entire box, instead of trying to figure out which subelements need to be *updated*.
  updatePage: function(object_name, object_id, object, source_element) {
    K3cms_InlineEditor.updatePageFromObject(object_name, object_id, object, source_element)

    // TODO: Only update title if page title was originally set to @contact_form.title. Perhaps we should set some JS variable to indicate which object/attribute the page title was taken from?
    // For now, assume page title comes from the contact_form if there's only one contact_form on the page:
    if ($('.k3cms_contact_form_contact_form').length == 1) {
      $('title').html($.sanitizeString(object.title));
      $('h1 a').html(object.title);
    }

    //$('[data-object=' + object_name + '][data-object-id=' + object_id + '][data-attribute=' + attr_name + ']')

    var container = $('.k3cms_contact_form_contact_form#' + object_id);

    K3cms_Ribbon.set_saved_status(new Date(object.updated_at));
  },

  // Given a root element (jQuery object), it will extract the current state of the object from the DOM and return it as a JS object.
  get_object_from_page: function(root_element) {
  }
};


//==================================================================================================
// Spam prevention: Do something that only user agents having JavaScript support can do. When form is submitted, require these inputs to have the value set here.
jQuery(function($) {
  $('.new_k3cms_contact_form_contact input.fill_in_via_javascript').val('Not spam!');
})

