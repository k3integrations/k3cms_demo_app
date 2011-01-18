class CreateK3BlogPosts < ActiveRecord::Migration
  def self.up
    create_table 'k3_blog_blog_posts' do |t|
      t.string   'title'
      t.string   'url'
      t.text     'summary'
      t.text     'body'
      t.date     'date'
      t.integer  'author_id'
      t.timestamps
    end
  end

  def self.down
    drop_table 'k3_blog_blog_posts'
  end
end
