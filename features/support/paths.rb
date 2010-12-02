module NavigationHelpers
  # Maps a name to a path. Used by the
  #
  #   When /^I go to (.+)$/ do |page_name|
  #
  # step definition in web_steps.rb
  #
  def path_to(page_name)
    case page_name

    when /the home\s?page/
      '/'
    when /the new page page/
      new_page_path

    when /the new page page/
      new_page_path

    when /^the page page for "(.*)"$/i
      page_path(K3::Pages::Page.where(:title => $1).first)

    #   when /^(.*)'s profile page$/i
    #     user_profile_path(User.find_by_login($1))

    else
      begin
        if page_name =~ /the (.*) page/
          path_components = $1.split(/\s+/)
          self.send(path_components.push('path').join('_').to_sym)
        elsif page_name =~ /"(.*)"/
          $1
        else
          raise "Unknown format"
        end
      rescue Object => e
        raise "Can't find mapping from \"#{page_name}\" to a path.\n" +
          "Now, go and add a mapping in #{__FILE__}"
      end
    end
  end
end

World(NavigationHelpers)
