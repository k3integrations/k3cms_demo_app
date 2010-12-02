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
    #Then show me the page
    Then I should see "Page not found"
    Then I should see /[Cc]reate it now/
