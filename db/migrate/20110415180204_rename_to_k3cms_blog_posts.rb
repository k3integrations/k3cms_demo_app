class RenameToK3cmsBlogPosts < ActiveRecord::Migration
  def self.up
    rename_table :k3_blog_blog_posts, :k3cms_blog_blog_posts
  end

  def self.down
    rename_table :k3cms_blog_blog_posts, :k3_blog_blog_posts
  end
end
