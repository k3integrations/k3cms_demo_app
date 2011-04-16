class CreateEpisodes < ActiveRecord::Migration
  def self.up
    create_table "k3cms_s3_podcast_episodes" do |t|
      t.string   "title"
      t.string   "code"
      t.text     "description"
      t.integer  "view_count"
      t.date     "published_at"
      t.timestamps
      t.integer  "author_id"
    end
  end

  def self.down
    drop_table "k3cms_s3_podcast_episodes"
  end
end
