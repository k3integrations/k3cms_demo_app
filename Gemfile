source 'http://rubygems.org'

k3cms_gems = %w[
  k3cms
  k3cms_blog
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
    gem gem_name
  end
end

gem 'rails', '3.0.3'
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

# TODO: these should be in the k3cms gemspec
#gem 'haml'
#gem 'haml-rails'
#gem 'validates_timeliness', :git => 'git://github.com/adzap/validates_timeliness.git'

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
