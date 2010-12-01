class ApplicationController < ActionController::Base
  protect_from_forgery

  # Temporary hack until we have an authentication engine
  def logged_in?
    true
  end
  helper_method :logged_in?
end
