class AddMetaDescriptionToBlogPosts < ActiveRecord::Migration
  def self.up
    change_table :k3_blog_blog_posts do |t|
      t.text :meta_description
      t.text :meta_keywords
    end
  end

  def self.down
    change_table :k3_blog_blog_posts do |t|
      t.remove :meta_description
      t.remove :meta_keywords
    end
  end
end
