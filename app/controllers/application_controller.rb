class ApplicationController < ActionController::Base
  protect_from_forgery

  # TODO: We should not have to list them all individually
  helper 'k3/ribbon/ribbon'

  # Temporary hack until we have an authentication engine
  def logged_in?
    true
  end
  helper_method :logged_in?
end
