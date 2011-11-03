K3cms_ImageMapper.initRibbon = function() {
  // The k3cms_inline_editor tab is assumed to already exist
  var tab = $('#k3cms_ribbon').k3cms_ribbon('get').tabsByName().k3cms_inline_editor

  var button = new K3cms_Ribbon.Button({
    element: $('<li/>', { 'class': "icon button k3cms_image_mapper image_mapper" }).
      append($('<a/>', {title: 'Add/edit image map', href: "javascript:;", html: '&nbsp;'})),

    onMousedown: function(event) {
      $(this).k3cms_ribbon('isEnabled') && $(this).trigger('invoke');

      // returning false doesn't cancel losing editor focus in IE, here's a nasty hacky fix!
      // Question: I changed it to event.preventDefault instead of return false -- is this hack still necessary in IE?
      if (navigator.userAgent.match(/MSIE/)) {
        $(editor.node).one('blur', function () {
          this.focus();
        });
      }
      event.preventDefault();
    },

    onInvoke: function() {
      var editor = InlineEditor.focusedEditor();
      // ignore button presses if no editable area is selected (you can also use InlineEditor.isFocusedEditor())
      if (! editor || ! editor.isEnabled() || $(this).hasClass('disabled')) {
        return false;
      }

      var img = $(InlineEditor.getOnlyContained('img'));
      if (img.length == 0) return;

      var editor = InlineEditor.getEditorOrParentEditor(img);
      var editable = editor.$node();

      //img.data('use_expose_effect', true)

      //init_image_map_context_ribbon();
      //img.trigger('open_image_map_context_ribbon');
      //var tooltip = img.data('tooltip').getTip()
      //console.log("tooltip=", tooltip);

      //toolbox = $('<div/>').addClass('toolbox').appendTo(document.body).hide();

      //console.log("img=", img);
      image_mapper = $(img).ImageMapper({
        toolbox_position: function() {
          var top  = this.$img.offset().top;
          var left = this.$img.offset().left;
          left += this.$img.outerWidth();
          return {top: top, left: left + 0};
        },
        onClickSave: function(event) {
          ImageMapper.debug('onClickSave: Triggering inline_editor save_if_changed')
          event.image_mapper.destroy(); // Need to destroy *before* triggering save; otherwise, onBeforeSave.ImageMapper will prevent the save!
          editable.trigger('save_if_changed');
          InlineEditor.restore_last_focused_element_and_selection();
        }
      }).data("ImageMapper");

      editable.bind('onBeforeSave.ImageMapper', function(event) {
        // Ensure that saving doesn't take place until user presses Save in ImageMapper editor UI, and that ImageMapper has removed any temporary changes to editable elements prior to save
        image_mapper = $(img).data("ImageMapper");
        //image_mapper.destroy()
        // Prevent save from even occuring until this modal UI is closed
        if (image_mapper) {
          ImageMapper.debug("onBeforeSave.ImageMapper: preventing save");
          event.preventDefault();
        }
      });
    },

    refresh: function() {
      var editor = InlineEditor.focusedEditor();
      var btn = this.element;
      var img;
      if (editor && (img = InlineEditor.getOnlyContained('img'))) {
        btn.removeClass('disabled');
      } else {
        btn.addClass('disabled');
      }
    }
  })

  tab.sectionsByName().inline_styles.items.push(button);
}

jQuery(function() {
  //console.log("K3cms_Ribbon.edit_mode_on()=", K3cms_Ribbon.edit_mode_on());
  if (K3cms_Ribbon.edit_mode_on()) {
    K3cms_ImageMapper.initRibbon();
  }
})
