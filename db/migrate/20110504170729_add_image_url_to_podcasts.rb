class AddImageUrlToPodcasts < ActiveRecord::Migration
  def self.up
    change_table :k3cms_s3_podcast_podcasts do |t|
      t.string :image_url
    end
  end
  
  def self.down
    change_table :k3cms_s3_podcast_podcasts do |t|
      t.remove :image_url
    end
  end
end
