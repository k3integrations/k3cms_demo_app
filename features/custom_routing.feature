Feature: Custom routing

  Scenario: I can access a page by its custom URL
    Given the following pages:
      | url       | body          |
      | /about-us | About us body |
    When I go to "/about-us"
    #Then show me the page
    Then I should see "About us body"

  Scenario: I go to the URL of a page that doesn't exist yet
    When I go to "/about-us"
    Then I should see "Page not found"
    Then I should see /[Cc]reate it now/

    When I follow "create it now"
    Then I should be on "/pages/new"
    #Then show me the page
    Then the "k3_pages_page[title]" field should contain "About us"
    Then the "k3_pages_page[url]"   field should contain "/about-us"
