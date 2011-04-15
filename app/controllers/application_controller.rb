require 'k3cms_ribbon'

class ApplicationController < ActionController::Base
  protect_from_forgery

  # TODO: We should not have to list them all individually
  helper 'k3cms/ribbon/ribbon'
end
