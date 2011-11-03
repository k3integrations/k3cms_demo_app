/*
  Project: ImageMapper jQuery Plugin
  Version: 0.1
  Authors: John Ash <jash@k3integrations.com>,
           Tyler Rick <tyler@k3integrations.com>

Description
-----------

  Provides a user interface for creating and editing image-maps (an image with clickable areas that are linked to hrefs).

  When the image-map editor is enabled, the user can create new regions or edit existing regions. Regions currently can only be polygons. To create/edit a region, the user clicks directly on the image to mark the verticies of the region/polygon. These points can be adjusted by dragging them around.

Internals
---------

  During editing, the region/polygon data is stored in SVG format (with the help of Raphael) so that it can be seen on the screen. The SVG element is only used during editing and is discarded when editing is finished.

  The canonical place that this data is stored is in the area element (http://www.w3schools.com/tags/tag_area.asp). This element is (also) kept up-to-date as you edit by update_selected_polygon_from_dots() so that when editing is concluded, the actual image map (map/area tags) is already ready.

  The verticies of the polygon are stored as dots in the dot_lists object (each region has an element in the object, keyed by region ID). As the user moves dots, the locations of the dots is used as the canonical representation of the polygons and is then used to update the SVG path element and the area element (see update_selected_polygon_from_dots).

  Terms:
  * The term/variable 'polygon' generaly refers to an SVG <path> element. (<path> elements can also support curves, but in our case we're limiting it to polygons, since that's all the <area shape="polygon"> element can support.)
  * The term 'region' usually refers to the box for the region within the tools box and not the polygon itself.
  * The term 'image-map' usually refers to the <map> element and its contents.

*/

(function( $ ){
  
  // This may be called when no image-map yet exists (in which case one will be created via create_image_map) or
  // when one already exists (in which case the existing one will be loaded via parse_image_map).
  ImageMapper = function($img, options) {
    var self = this;
    this.$img = $img;
    this.$map = null;
    var $map;
    var dot_lists = new Object();
    var polygons = new Object();
    var imagemap_paper;
    var img_width = 0;
    var img_height = 0;
    var region_count = 0;
    var suppress_callbacks = false;

    //----------------------------------------------------------------------------------------------
    // Initialize

    suppress_callbacks = true;

    if (!options.map_name) {
      if        ($img.attr('usemap')) {
        options.map_name = $img.attr('usemap').replace(/^#/, '');
      } else if ($img.attr('id')) {
        options.map_name = $img.attr('id') + '_imagemap';
      } else {
        // Could have also used http://plugins.jquery.com/project/uidGen but seemed like overkill
        var unique_id = Math.floor( Math.random() * 99999999 );
        options.map_name = 'imagemap_' + unique_id;
      }
    }
    
    var x = Math.round($img.offset().left);
    var y = Math.round($img.offset().top);
    img_width = parseInt($img.css('width'));
    img_height = parseInt($img.css('height'));
    imagemap_paper = Raphael(x, y, img_width, img_height);
    //imagemap_paper = Raphael(x, y, $img.width(), $img.height());

    $img.addClass('imagemap_target');

    // Render ImageMapper editor UI (toolbox)
    if (!options.toolbox) {
      options.toolbox = $('<div/>').appendTo(document.body).hide();
      var pos = options.toolbox_position.call(self);
      options.toolbox.css({position: 'absolute', top: pos.top, left: pos.left});
    }
    options.toolbox.addClass('imagemap_toolbox').attr('data-for_image_map', options.map_name);
    console.log("options.toolbox=", options.toolbox);
    options.toolbox.append(
      '<div class="imagemap_tools"> \
        <div class="imagemap_region_list"></div> \
        <input class="imagemap_new_region_button"  type="button" value="New Region"/> \
        <input class="imagemap_save_button"        type="button" value="Save"/> \
      </div>'
    );
    if (options.onBeforeShowToolbox)
        options.onBeforeShowToolbox.call($img);
    options.toolbox.show()
    // Compile named template
    $.template('ImageMapper.region_template', options.region_template)
    
    console.log("$('map')=", $('map'), 'looking for', options.map_name);
    this.$map = $map = $('map[name="' + options.map_name + '"]');
    console.log("this.$map=", this.$map);
    if (this.$map.length > 0) {
      parse_image_map();
    } else {
      create_image_map();
    }
    $img.attr('usemap', '#' + options.map_name);
    
    // Register Save button
    $('input.imagemap_save_button').click(function(event) {
      var e = $.Event('onClickSave', {image_mapper: self})
      $(self).trigger(e);
      if (e.isDefaultPrevented()) { return self; }

      // Default action: remove editor UI (toolbox)
      // We could just use self here, but the custom callback may have already called destroy, so reload it to be safe.
      image_mapper = $img.data("ImageMapper");
      image_mapper && image_mapper.destroy();
    });
    
    // Register New Region button
    $('input.imagemap_new_region_button').click(create_region);
    
    // Background image is generally clickable to add new points
    var background = imagemap_paper.rect(0, 0, img_width - 1, img_height - 1);
    background.toBack();
    background.attr('fill', 'white');
    background.attr('fill-opacity', 0);
    
    background.node.onclick = function(event) {
      ImageMapper.debug("clicked at: ", event.pageX, '-', $(this).offset().left, ',',
                                        event.pageY, '-', $(this).offset().top);
      var x = Math.round(event.pageX - $(this).offset().left);
      var y = Math.round(event.pageY - $(this).offset().top);
      var offset = $.browser.mozilla ? -4 : 0;
      create_dot(x, y, offset);
    }
    
    $img.data('ImageMapper', self);
    
    suppress_callbacks = false;
    if (options.onInitialize) options.onInitialize.call($img);

    //----------------------------------------------------------------------------------------------
    // Register callbacks
    $.each("onClickSave".split(","), function(i, name) {

      if ($.isFunction(options[name])) {
        $(self).bind(name, options[name]);
      }

      // API
      self[name] = function(fn) {
        if (fn) { $(self).bind(name, fn); }
        return self;
      };
    });

    //----------------------------------------------------------------------------------------------
    // ImageMapper instance methods / Public API, available via $('#img').data('ImageMapper')

    $.extend(self, {
      // Removes all traces of the ImageMapper editor UI
      destroy: function( ) {
        $img.removeData('ImageMapper')
        
        // # Undo all
        $map.insertAfter('.imagemap_target');
        $img.removeClass('imagemap_target');
        try { imagemap_paper.remove(); } catch(e) { ImageMapper.debug(e.message) }
        options.toolbox.remove();
        if (options.onDestroy) options.onDestroy.call($img);
      }
    });

    //----------------------------------------------------------------------------------------------
    // Private methods
  
    function $get_area(i)          { return $map.find('#imagemap_area_' + i); }

    function $get_region_list()    { return options.toolbox.find('.imagemap_region_list'); }
    // TODO: require a number, i, to be passed in instead of a free-form string value, id
    function $get_region(id)       { return $get_region_list().find('#' + ('_' + id).replace(/^[a-z_]+/, 'imagemap_region_')); }
    function $selected_region()    { return $get_region_list().find('.selected'); }
    function $get_url_input(id)    { return $get_region(id).find(':input[name=url]'); }
    function $get_target_input(id) { return $get_region(id).find(':input[name=target]'); }
    function selected_region_id()  { return $selected_region().attr('id'); }

    function id_to_i(id)           { return parseInt(('_' + id).replace(/^[a-z_]*/, '')); }
    function to_region_id(full_id) { return     ('_' + full_id).replace(/^[a-z_]+/, 'region_'); }
    function get_dots(id)          { return dot_lists[to_region_id(id)]; }
    function get_polygon(id)       { return  polygons[to_region_id(id)]; }
    function set_polygon(id, val)  { return  polygons[to_region_id(id)] = val; }
    
    function create_region(id) {
      // Don't need to create new area if id provided
      if (id && typeof id == 'string') {
        // id may be something like "imagemap_area_1" if this gets called by parse_image_map when an existing image-map already exists, so we strip out just the numeric portion with id_to_i
        // Looks like we're assuming that create_region will *only* be called sequentially (1, 2, 3...), because we actually *set* region_count based on the id passed in.
        region_count = id_to_i(id);
      } else {
        region_count++;
        // Create the <area> tag for the new polygon
        $map.append('<area shape="polygon" id="imagemap_area_' + region_count + '" coords="0,0,0,0">');
      }
      console.log("$get_region_list()=", $get_region_list());
      $.tmpl('ImageMapper.region_template', {i: region_count}).appendTo($get_region_list());
      
      // Create array for dots
      dot_lists['region_' + region_count] = new Array();
      
      // Create polygon
      set_polygon(region_count, imagemap_paper.path('M0 0'));
      
      // Activate the delete button in new region
      $('img.imagemap_delete_region').click(function() {
        var id = $(this).parents('.imagemap_region').attr('id');
        delete_region(id);
      });
      
      // Tie url field updates to change the corresponding area attribute
      $get_url_input(region_count).change(function() {
        var i = id_to_i($(this).parents('.imagemap_region').attr('id'))
        $get_area(i).attr('href', this.value);
        if (options.onRegionChange && !suppress_callbacks) options.onRegionChange.apply($img, [i]);
      });
      $get_target_input(region_count).change(function() {
        var i = id_to_i($(this).parents('.imagemap_region').attr('id'))
        $get_area(i).attr('target', this.value);
        if (options.onRegionChange && !suppress_callbacks) options.onRegionChange.apply($img, [i]);
      });
      
      // Enable clicking on region to select it
      $('#imagemap_region_' + region_count + ' label').click( function() {
        select_region($(this).parent('.imagemap_region').attr('id'));
      });
      
      // Select the newly added region
      select_region(region_count);
      if (options.onRegionCreate && !suppress_callbacks) options.onRegionCreate.apply($img, [region_count]);
    }
    
    function delete_region(id) {
      var i = id_to_i(id);
      $get_region(i).remove();
      $get_area(  i).remove();
      remove_dots(i);
      get_polygon(i).remove();
      
      // If the selected region was deleted, select a different one, if found
      if ($selected_region().length == 0 && $get_region_list().find('.imagemap_region').length > 0) {
        select_region();
      }
      if (options.onRegionDelete && !suppress_callbacks) options.onRegionDelete.apply($img, [i]);
    }
    
    // TODO: move to public API
    function select_region(id) {
      if (!id) {
        // If none specified, select the first region
        id = $get_region_list().find('.imagemap_region').eq(0).attr('id');
        if (id == undefined)
          return;
      }
      // Deselect all other selected regions
      $('.selected').each(function() {
        $(this).removeClass('selected');
        deselect_dots(this.id);
      });
      
      $get_region(id).addClass('selected');
      $get_region_list().find('.selected :input:visible:eq(0)').focus();
      select_dots(id);
    }
    
    // After moving one of the dots, which mark the vertices of the polygon, the path for the polygon will be out-of-sync.
    // This method removes the SVG path element for the polygon and replaces it with a new path based on the user-updated verticies (dots).
    function update_selected_polygon_from_dots() {
      var poly = get_polygon(selected_region_id());
      var dots = get_dots(selected_region_id());
      if (poly)
        poly.remove();
      if (dots.length < 2)
        return;
      var path = 'M' + dots[0].attr('cx') + ' ' + dots[0].attr('cy'); // M10 10L90 90Z
      var coords = dots[0].attr('cx') + ',' + dots[0].attr('cy');
      for (var i=1; i < dots.length; i++) {
        path += 'L' + dots[i].attr('cx') + ' ' + dots[i].attr('cy');
        coords += ',' + dots[i].attr('cx') + ',' + dots[i].attr('cy');
      }
      //console.log("$get_area=", $get_area(id_to_i(selected_region_id())));
      $get_area(id_to_i(selected_region_id())).attr('coords', coords);
      poly = imagemap_paper.path(path + 'Z');
      poly.attr('fill', '#000');
      poly.attr('opacity', 0.1);
      poly.toBack();
      //ImageMapper.debug("poly=", $(poly.node).outerHTML());
      set_polygon(selected_region_id(), poly);
    }
    
    function create_dot(x, y, offset) {
      offset = typeof offset == 'number' ? offset : 0;
      // Don't allow drawing until they've first created/selected a region
      if ($selected_region().length == 0)
        return;
      var dot = imagemap_paper.circle(x + offset, y + offset, 5);
      dot.attr("fill", options.selectedColor);
      dot.attr('stroke', "#000");
      $(dot.node).data('ImageMapper_region', selected_region_id());
      dot.drag(drag_dot_move, drag_dot_start, drag_dot_up);
      var dots = get_dots(selected_region_id());
      dots.push(dot);
      // NOTE: We should have an algorithm that orders the points so that no lines are crossed
      update_selected_polygon_from_dots();
      if (options.onRegionChange && !suppress_callbacks) options.onRegionChange.apply($img, [id_to_i(selected_region_id())]);
      return dot;
    }
    
    function dot_distance(a, b) {
      return Math.sqrt(Math.pow(a.attr('cx') - b.attr('cx'), 2) + Math.pow(a.attr('cy') - b.attr('cy'), 2));
    }
    
    function drag_dot_start() {
      // storing original coordinates
      this.ox = this.attr("cx");
      this.oy = this.attr("cy");
      select_region($(this.node).data('ImageMapper_region'));
      this.attr({fill: options.movingColor});
    }
    
    function drag_dot_move(dx, dy) {
      // move will be called with dx and dy
      this.attr({cx: this.ox + dx, cy: this.oy + dy});
      if (this.ox + dx > img_width)  this.attr('cx', img_width);
      if (this.oy + dy > img_height) this.attr('cy', img_height);
      if (this.ox + dx < 0) this.attr('cx', 0);
      if (this.oy + dy < 0) this.attr('cy', 0);
      update_selected_polygon_from_dots();
    }
    
    function drag_dot_up() {
      // restoring state
      this.attr({fill: options.selectedColor});
      update_selected_polygon_from_dots();
      if (options.onRegionChange && !suppress_callbacks) options.onRegionChange.apply($img, [id_to_i(selected_region_id())]);
    }
    
    // Change fill color of dots to show which region/polygon is selected
    function select_dots(id) {
      var dots = get_dots(id);
      for (var i=0; i < dots.length; i++)
        dots[i].attr('fill', options.selectedColor);
    }
    function deselect_dots(id) {
      var dots = get_dots(id);
      for (var i=0; i < dots.length; i++)
        dots[i].attr('fill', options.deselectedColor);
    }
    
    function remove_dots(id) {
      var dots = get_dots(id);
      for (var i=0; i < dots.length; i++)
        dots[i].remove();
    }
    
    // Called by init when an existing image-map (<map> tag) is found.
    // Reads coordinate data from <map> tag and its <area> tags and renders the editing UI (draws visible, clickable representation of each region/polygon).
    function parse_image_map() {
      $map.children('area').each(function() {
        create_region(this.id);
        // Make dots
        var points = this.coords.split(',');
        for (var i=0; i<points.length; i+=2) {
          create_dot(parseInt(points[i]), parseInt(points[i + 1]));
        }
        // Update inputs in toolbox with current values from image-map itself
        $get_url_input(   this.id).attr('value', this.href);
        $get_target_input(this.id).attr('value', this.target);
      });
      select_region(); // Select first one
    }
    
    // Called by init when no existing image-map (<map> tag) yet exists.
    function create_image_map() {
      $img.after('<map name="' + options.map_name + '">');
      $map    = $('map[name="' + options.map_name + '"]');
    }
  } // function ImageMapper

  //================================================================================================
  // ImageMapper class methods

  $.extend(ImageMapper, {
    debug: function() {
      if (ImageMapper.options.debug) {
        console.debug.apply(console, arguments);
      }
    }
  });

  //================================================================================================
  $.extend(ImageMapper, {
    // Default settings
    options: {
      // The region callbacks should be functions that take one argument, the region ID number
      // All callbacks have "this" set to $img
      onRegionCreate: null,
      onRegionChange: null,
      onRegionDelete: null,
      onInitialize: null,
      onDestroy: null,
      debug: true,

      toolbox_position: function() {
        var top  = this.$img.offset().top;
        var left = this.$img.offset().left;
        left += this.$img.outerWidth();
        return {top: top, left: left + 12};
      },
    
      map_name: null,

      deselectedColor: '#ddd',
      selectedColor: '#ff0',
      movingColor: '#f00',

      region_template: '\
        <div class="imagemap_region" id="imagemap_region_${i}"> \
          <label>Region ${i}</label> \
          <img class="imagemap_delete_region" src="/images/k3cms/image_mapper/delete.png"> \
          <div class="imagemap_region_attributes"> \
            URL:    <input type="text" name="url"><br/> \
            Target: <input type="text" name="target"> \
          </div> \
        </div>'
    }
  });

  //================================================================================================
  
  $.fn.ImageMapper = function( options ) {
    options = $.extend(true, {}, ImageMapper.options, options);

    // Install ImageMapper for each match in jQuery query
    this.each(function() {
      api = new ImageMapper($(this), options);
      $(this).data("ImageMapper", api);
    });
    return this;
  };

  //================================================================================================

  $.fn.outerHTML = function() {
    return $(this).clone().wrap('<div></div>').parent().html();
  }
})( jQuery );
