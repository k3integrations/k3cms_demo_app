class CreatePodcasts < ActiveRecord::Migration
  def self.up
    create_table :k3cms_s3_podcast_podcasts do |t|
      t.string     :title
      t.string     :media_type
      t.string     :url
      t.text       :description
      t.text       :summary
      t.belongs_to :author

      t.timestamps
    end

    change_table :k3cms_s3_podcast_episodes do |t|
      t.belongs_to :podcast
    end
    add_index :k3cms_s3_podcast_episodes, :podcast_id
  end

  def self.down
    change_table :k3cms_s3_podcast_episodes do |t|
      t.remove :podcast_id
    end
    drop_table :k3cms_s3_podcast_podcasts
  end
end
