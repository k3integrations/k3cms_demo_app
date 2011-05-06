class AddFieldsForAtomFeed < ActiveRecord::Migration
  def self.up
    change_table :k3cms_s3_podcast_episodes do |t|
      t.string :author_name
      t.rename :display_date, :date
    end
    change_table :k3cms_s3_podcast_podcasts do |t|
      t.string :icon_url
      t.string :logo_url
      t.text   :rights
      t.rename :image_url, :episode_image_url
      t.rename :sources,   :episode_source_urls
      t.rename :publish_days_in_advance_of_display_date, :publish_episodes_days_in_advance_of_date
    end
  end

  def self.down
    change_table :k3cms_s3_podcast_episodes do |t|
      t.rename :date, :display_date
      t.remove :author_name
    end
    change_table :k3cms_s3_podcast_podcasts do |t|
      t.remove :icon_url
      t.remove :logo_url
      t.remove :rights
      t.rename :episode_image_url,   :image_url
      t.rename :episode_source_urls, :sources
      t.rename :publish_episodes_days_in_advance_of_date, :publish_days_in_advance_of_display_date
    end
  end
end
