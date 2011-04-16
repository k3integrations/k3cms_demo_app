Rails::Application.configure do
  config.k3cms_s3_podcast_asset_urls = {
    view_url:            "http://bucket-name.s3.amazonaws.com/episodes/{YEAR}/{CODE}.mp4",
    download_url:        "http://bucket-name.s3.amazonaws.com/episodes/{YEAR}/{CODE}.mp4",
    thumbnail_image_url: "http://bucket-name.s3.amazonaws.com/episodes/{YEAR}/{CODE}-thumb.jpg",
  }
  config.k3cms_s3_podcast_video_tag_options = {
    :width => 326, :height => 269
  }
  config.k3cms_s3_podcast_pagination = {
    :per_row => 3, :per_page => 12
  }

  config.k3cms_s3_podcast_title       = 'Podcast title'
  config.k3cms_s3_podcast_link_url    = 'http://example.com/'
  config.k3cms_s3_podcast_podcast_url = 'http://example.com/episodes.rss'
  config.k3cms_s3_podcast_description = 'Podcast description'
  config.k3cms_s3_podcast_summary     = 'Podcast summary'
  config.k3cms_s3_podcast_category    = 'Category'

  local_file = __FILE__.gsub(/\.rb$/, '.local.rb')
  if File.exists?(local_file)
    eval(File.read(local_file), binding, __FILE__, __LINE__)
  end
end
