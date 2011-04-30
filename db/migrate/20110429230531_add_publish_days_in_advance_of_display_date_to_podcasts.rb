class AddPublishDaysInAdvanceOfDisplayDateToPodcasts < ActiveRecord::Migration
  def self.up
    change_table :k3cms_s3_podcast_podcasts do |t|
      t.integer :publish_days_in_advance_of_display_date
    end
    change_table :k3cms_s3_podcast_episodes do |t|
      t.rename :published_at, :display_date
    end
  end

  def self.down
    change_table :k3cms_s3_podcast_podcasts do |t|
      t.remove :publish_days_in_advance_of_display_date
    end
    change_table :k3cms_s3_podcast_episodes do |t|
      t.rename :display_date, :published_at
    end
  end
end
