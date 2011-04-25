class ApplicationController < ActionController::Base
  protect_from_forgery

  # Not necessary the way we're doing things, but allows the file to be reloaded during development
  helper K3cms::S3Podcast::S3PodcastHelper
  helper K3cms::InlineEditor::InlineEditorHelper
end
