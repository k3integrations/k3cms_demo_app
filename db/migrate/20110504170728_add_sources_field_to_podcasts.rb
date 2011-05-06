class AddSourcesFieldToPodcasts < ActiveRecord::Migration
  def self.up
    change_table :k3cms_s3_podcast_podcasts do |t|
      t.remove :url
      t.remove :media_type
      t.text :sources
    end
  end
  
  def self.down
    change_table :k3cms_s3_podcast_podcasts do |t|
      t.remove :sources
      t.string :media_type
      t.string :url
    end
  end
end
