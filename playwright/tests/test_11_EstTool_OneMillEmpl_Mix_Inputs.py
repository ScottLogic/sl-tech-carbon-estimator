import re
from playwright.sync_api import Page, expect

# This test is to check that the page loads, labels, scroll bars, dropdowns are all visible and set at the default when page loads
# 1 Million empoyees
# Variety of input: users/desktops/servers etc
# Calcs match spreadsheet


def test_example(page: Page) -> None:
    # page.goto("http://localhost:57056/")
    page.goto("http://localhost:4200/")
    
    page.set_viewport_size({"width": 1920, "height": 1200})
    expect(page.get_by_role("heading", name="Carbon Estimator")).to_be_visible()
    
    #Organisation
    page.get_by_label("How many employees are in the").fill("1000000")
    expect(page.get_by_text("What percentage of those")).to_be_visible()
    page.get_by_label("What percentage of those").press("ArrowRight")
    page.get_by_label("What percentage of those").press("ArrowRight")
    page.get_by_label("What percentage of those").press("ArrowRight")
    page.get_by_label("What percentage of those").press("ArrowRight")
    page.get_by_label("What percentage of those").press("ArrowRight")
    page.get_by_label("What percentage of those").press("ArrowRight")
    page.get_by_label("What percentage of those").press("ArrowRight")
    page.get_by_label("What percentage of those").press("ArrowRight")
    page.get_by_label("What percentage of those").press("ArrowRight")
    page.get_by_label("What percentage of those").press("ArrowRight")
    expect(page.get_by_text("Desktops 100%")).to_be_visible()
    expect(page.get_by_text("Laptops 0%")).to_be_visible()
    
    # On Prem Servers
    expect(page.get_by_role("heading", name="On-Premise Servers")).to_be_visible()
    page.get_by_label("Number of Servers:").click()
    page.get_by_label("Number of Servers:").fill("100")
    page.get_by_label("Where are they primarily").select_option("unknown")
    
    # Cloud
    page.get_by_label("What percentage of your servers are cloud services vs on-premise?").click()
    page.get_by_label("What percentage of your servers are cloud services vs on-premise?").press("ArrowLeft")
    page.get_by_label("What percentage of your servers are cloud services vs on-premise?").press("ArrowLeft")
    page.get_by_label("What percentage of your servers are cloud services vs on-premise?").press("ArrowLeft")
    page.get_by_label("What percentage of your servers are cloud services vs on-premise?").press("ArrowLeft")
    page.get_by_label("What percentage of your servers are cloud services vs on-premise?").press("ArrowLeft")
    page.get_by_label("What percentage of your servers are cloud services vs on-premise?").press("ArrowLeft")
    page.get_by_label("What percentage of your servers are cloud services vs on-premise?").press("ArrowLeft")
    expect(page.get_by_text("Cloud 15%")).to_be_visible()
    page.get_by_label("What is your monthly cloud").select_option("4: Object")
    
    # Users
    expect(page.get_by_role("heading", name="End-Users")).to_be_visible()
    expect(page.get_by_text("Tell us about your end-users -")).to_be_visible()
    expect(page.get_by_text("Where are your end-users")).to_be_visible()
    page.get_by_label("Where are your end-users primarily located?", exact=True).select_option("Globally")
    expect(page.get_by_text("How many monthly active users")).to_be_visible()
    page.get_by_label("How many monthly active users").click()
    page.get_by_label("How many monthly active users").fill("800000")
    expect(page.get_by_text("What percentage of your end-users")).to_be_visible()
    page.get_by_label("What percentage of your end-users").click()
    page.get_by_label("What percentage of your end-users").click()
    page.get_by_label("What percentage of your end-users").press("ArrowLeft")
    page.get_by_label("What percentage of your end-users").press("ArrowLeft")
    page.get_by_label("What percentage of your end-users").press("ArrowLeft")
    page.get_by_label("What percentage of your end-users").press("ArrowLeft")
    page.get_by_label("What percentage of your end-users").press("ArrowLeft")
    page.get_by_label("What percentage of your end-users").press("ArrowLeft")
    page.get_by_label("What percentage of your end-users").press("ArrowLeft")
    page.get_by_label("What's the primary purpose of ").select_option("socialMedia")
    page.get_by_text("Mobile 15%").click()
   
    # Calculate
    # Calculate outcome and make sure it matches spreadsheet
    page.get_by_role("button", name="Calculate").click()
    expect(page.locator("foreignobject")).to_contain_text("Upstream Emissions - 58%")
    expect(page.locator("foreignobject")).to_contain_text("Direct Emissions - 40%")
    expect(page.locator("foreignobject")).to_contain_text("Downstream Emissions - 2%")
    expect(page.locator("foreignobject")).to_contain_text("Indirect Emissions - <1%")
    

    
    ##############################################################################
    

