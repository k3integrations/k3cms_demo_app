require 'k3/authorization/drivers/devise'

# Devise must initialize first, so use the following hook.
module ActionDispatch::Routing
  class RouteSet #:nodoc:
    def finalize_with_my_app!
      finalize_without_my_app!
      Cell::Base.send :include, Devise::Controllers::Helpers
      Cell::Base.send :include, K3::Authorization::Drivers::Devise
      Cell::Base.send :include, K3::Authorization::GeneralControllerMethods
      ApplicationController.send :include, K3::Authorization::Drivers::Devise
      ApplicationController.send :include, K3::Authorization::GeneralControllerMethods
    end
    alias_method_chain :finalize!, :my_app
  end
end
