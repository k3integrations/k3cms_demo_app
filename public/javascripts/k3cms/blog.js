K3cms_Blog = {
}

k3cms_blog_blog_post = {
  updatePage: function(object_name, object_id, object, source_element) {
    K3cms_InlineEditor.updatePageFromObject(object_name, object_id, object, source_element)

    // TODO: only update title if page title was originally set to @page.title. Perhaps we should set some JS variable to indicate which object/attribute the page title was taken form?
    $('title').html(object.title)
    $('meta[name=description]').attr('content', object.meta_description);
    $('meta[name=keywords]').   attr('content', object.meta_keywords);
  }
}
