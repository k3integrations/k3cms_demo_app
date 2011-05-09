source 'http://rubygems.org'

k3cms_gems = %w[
  k3cms
  k3cms_blog
  k3cms_s3_podcast
  k3cms_trivial_authorization
]

if File.exists?("Gemfile.local")
  eval(File.read("Gemfile.local"), binding, __FILE__, __LINE__)
end

def find_gem(name, *args)
  options = Hash === args.last ? args.pop : {}
  version = args || [">= 0"]
  dep = Dependency.new(name, version, options)
  @dependencies.find { |d| d.name == dep.name }
end

k3cms_gems.each do |gem_name|
  # Avoid conflicts with gems specified in Gemfile.local
  unless find_gem(gem_name)
    gem gem_name, :git => "git@github.com:k3integrations/#{gem_name}.git"
  end
end

gem 'rails', '~> 3.0.7'
gem 'devise' unless find_gem('devise')
gem 'ruby-debug19'

group :production do
  gem 'mysql2'
  gem 'exception_notification', :git => 'git://github.com/pyrat/exception_notification.git', :require => 'exception_notifier'
  gem 'capistrano'
end

group :development, :test do
  gem 'sqlite3'
end

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
