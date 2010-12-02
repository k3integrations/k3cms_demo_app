Feature: Custom routing

  Scenario: I can access a page by its custom URL
    Given the following pages:
      | url       | body          |
      | /about-us | About us body |
    When I go to "/about-us"
    Then I should see "About us body"

  Scenario: I go to the URL of a page that doesn't exist yet
    When I go to "/about-us"
    Then I should see "Page not found"
    Then I should see /[Cc]reate it now/

    When I follow "create it now"
    Then I should be on "/pages/new"
    Then the "k3_pages_page[title]" field should contain "About us"
    Then the "k3_pages_page[url]"   field should contain "/about-us"

  Scenario: A page has a route that would conflict with a normal route
    Given the following pages (skipping validations):
      | url              | title               |
      | /pages/not_found | My conflicting page |
    When I go to "/pages/not_found"
    #Then show me the page
    #Then I should be on the page page for "My conflicting page"
    Then I should see "choose a different URL for your page"
