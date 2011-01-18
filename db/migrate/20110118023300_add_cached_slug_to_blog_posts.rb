class AddCachedSlugToBlogPosts < ActiveRecord::Migration
  def self.up
    add_column :k3_blog_blog_posts, :cached_slug, :string
    add_index  :k3_blog_blog_posts, :cached_slug, :unique => true
  end

  def self.down
    remove_column :k3_blog_blog_posts, :cached_slug
  end
end
