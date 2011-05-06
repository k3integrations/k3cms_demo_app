Rails.application.class_eval do
  config.k3cms_s3_podcast_video_tag_options = {
    :width => 326, :height => 269
  }
  config.k3cms_s3_podcast_pagination = {
    :per_row => 3, :per_page => 12
  }
  config.k3cms_s3_index_view = :tiles
  config.k3cms_s3_show_view  = :page

  local_file = __FILE__.gsub(/\.rb$/, '.local.rb')
  if File.exists?(local_file)
    eval(File.read(local_file), binding, __FILE__, __LINE__)
  end
end
