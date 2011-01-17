source 'http://rubygems.org'

k3_gems = %w[
  k3_core
  k3_pages 
  k3_ribbon 
  k3_inline_editor 
  k3_trivial_authorization 
  k3_authorization 
  k3_cancan
  k3_blog
]

if File.exists?("Gemfile.local")
  begin
    contents  = File.read("Gemfile.local")
    eval(contents, binding, __FILE__, __LINE__)
  rescue Exception => e
    puts "Exception = #{e.inspect}"
  end
end

def find_gem(name, *args)
  options = Hash === args.last ? args.pop : {}
  version = args || [">= 0"]
  dep = Dependency.new(name, version, options)
  @dependencies.find { |d| d.name == dep.name }
end

k3_gems.each do |gem_name|
  # Avoid conflicts with gems specified in Gemfile.local
  unless find_gem(gem_name)
    gem gem_name
  end
end

gem 'rails', '3.0.3'

# Bundle edge Rails instead:
# gem 'rails', :git => 'git://github.com/rails/rails.git'

gem 'sqlite3-ruby', :require => 'sqlite3'

# Use unicorn as the web server
# gem 'unicorn'

# Deploy with Capistrano
# gem 'capistrano'

gem 'ruby-debug19'

# Bundle the extra gems:
# gem 'bj'
# gem 'nokogiri'
# gem 'sqlite3-ruby', :require => 'sqlite3'
# gem 'aws-s3', :require => 'aws/s3'

# Bundle gems for the local environment. Make sure to
# put test-only gems in this group so their generators
# and rake tasks are available in development mode:
# group :development, :test do
#   gem 'webrat'
# end

gem 'mysql2'
# Depending on this fork in order to be able to use outer_content_for in k3_ribbon
gem 'cells', :git => 'git://github.com/TylerRick/cells.git'
gem 'haml'
gem 'haml-rails'
gem 'devise' unless find_gem('devise')

group :test do
  gem "rspec-rails"
end

group :cucumber do
  gem 'capybara'
  gem 'database_cleaner'
  gem 'cucumber-rails'
  gem 'cucumber'
  gem 'rspec-rails'
  gem 'spork'
  gem 'launchy'    # So you can do Then show me the page
end  
