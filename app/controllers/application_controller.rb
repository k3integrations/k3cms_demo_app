class ApplicationController < ActionController::Base
  protect_from_forgery

  # Override lib/devise/controllers/helpers.rb, since that references root_path
  def after_sign_in_path_for(resource_or_scope)
    scope = Devise::Mapping.find_scope!(resource_or_scope)
    home_path = "#{scope}_root_path"
    '/'
  end

  def after_sign_out_path_for(resource_or_scope)
    '/'
  end

  # Not necessary the way we're doing things, but allows the file to be reloaded during development
  helper K3cms::InlineEditor::InlineEditorHelper
end
