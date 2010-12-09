source 'http://rubygems.org'

if File.exists?("Gemfile.local")
  begin
    contents  = File.read("Gemfile.local")
    eval(contents)
  rescue Exception => e
    puts "Exception = #{e.inspect}"
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

def find_gem(name, *args)
  options = Hash === args.last ? args.pop : {}
  version = args || [">= 0"]
  dep = Dependency.new(name, version, options)
  @dependencies.find { |d| d.name == dep.name }
end

# Avoid conflicts with gems specified in Gemfile.local
unless find_gem("k3_core")
  gem "k3_core"
  gem "k3_pages"
  gem "k3_ribbon"
end

gem 'mysql2'
gem 'cells'
gem 'haml'
gem 'haml-rails'

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
