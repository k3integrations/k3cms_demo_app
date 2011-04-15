require 'k3cms/authorization/drivers/devise'
#require 'k3cms/authorization/general_controller_methods'
require 'cancan'

# Devise must initialize first, so use the following hook.
module ActionDispatch::Routing
  class RouteSet #:nodoc:
    def finalize_with_my_app!
      finalize_without_my_app!
      Cell::Base.send :include, Devise::Controllers::Helpers
      Cell::Base.send :include, K3cms::Authorization::Drivers::Devise
      Cell::Base.send :include, K3cms::Authorization::GeneralControllerMethods
      Cell::Base.send :include, CanCan::ControllerAdditions
      ApplicationController.send :include, K3cms::Authorization::Drivers::Devise
      ApplicationController.send :include, K3cms::Authorization::GeneralControllerMethods
      ApplicationController.send :include, CanCan::ControllerAdditions
    end
    alias_method_chain :finalize!, :my_app
  end
end
