import re
from playwright.sync_api import Page, expect

# This test is to check that the page loads, labels, scroll bars, dropdowns are all visible and set at the default when page loads
# 10 empoyees
# Variety of input: users/desktops/servers etc
# Calcs match spreadsheet


def test_example(page: Page) -> None:
    # page.goto("http://localhost:57056/")
    page.goto("http://localhost:4200/")
    
    page.set_viewport_size({"width": 1920, "height": 1200})
    expect(page.get_by_role("heading", name="Carbon Estimator")).to_be_visible()
    
    #Organisation
    expect(page.get_by_text("How many employees are in the")).to_be_visible()
    page.get_by_label("How many employees are in the").click()
    page.get_by_label("How many employees are in the").fill("10")
    expect(page.get_by_text("What percentage of those")).to_be_visible()
    expect(page.get_by_label("What percentage of those")).to_be_visible()
    page.get_by_label("What percentage of those").click()
    page.get_by_label("What percentage of those").press("ArrowLeft")
    page.get_by_label("What percentage of those").press("ArrowLeft")
    page.get_by_label("What percentage of those").press("ArrowLeft")
    page.get_by_label("What percentage of those").press("ArrowLeft")
    page.get_by_label("What percentage of those").press("ArrowLeft")
    page.get_by_label("What percentage of those").press("ArrowLeft")
    page.get_by_label("What percentage of those").press("ArrowLeft")
    page.get_by_label("What percentage of those").press("ArrowLeft")
    page.get_by_label("What percentage of those").press("ArrowLeft")
    page.get_by_label("What percentage of those").press("ArrowLeft")
    expect(page.get_by_text("Desktops 0%")).to_be_visible()
    
    # On Prem Servers
    expect(page.get_by_text("Number of Servers:")).to_be_visible()
    page.get_by_label("Number of Servers:").click()
    page.get_by_label("Number of Servers:").fill("5")
    expect(page.get_by_label("Where are they primarily")).to_be_visible()
    page.get_by_label("Where are they primarily").select_option("uk")
    
    # Cloud
    expect(page.get_by_role("heading", name="Cloud Services")).to_be_visible()
    expect(page.get_by_label("We don't use cloud services")).not_to_be_checked()
    page.get_by_label("We don't use cloud services").check()
    expect(page.get_by_label("We don't use cloud services")).to_be_checked()
    expect(page.get_by_text("What percentage of your servers are cloud services vs on-premise?")).not_to_be_visible()
    
    # Users
    expect(page.get_by_role("heading", name="Users")).to_be_visible()
    expect(page.get_by_text("Tell us about your users. At")).to_be_visible()
    expect(page.get_by_text("Where are your users")).to_be_visible()
    page.get_by_label("Where are your users").select_option("uk")
    expect(page.get_by_text("How many monthly active users")).to_be_visible()
    page.get_by_label("How many monthly active users").click()
    page.get_by_label("How many monthly active users").fill("5000")
    expect(page.get_by_text("What percentage of your users")).to_be_visible()
    page.get_by_label("What percentage of your users").click()
    page.get_by_label("What percentage of your users").press("ArrowLeft")
    page.get_by_label("What percentage of your users").press("ArrowRight")
    page.get_by_label("What percentage of your users").press("ArrowRight")
    page.get_by_label("What percentage of your users").press("ArrowRight")
    page.get_by_label("What percentage of your users").press("ArrowRight")
    page.get_by_label("What percentage of your users").press("ArrowRight")
    expect(page.get_by_text("Mobile 70%")).to_be_visible()
    expect(page.get_by_text("What's the purpose of your")).to_be_visible()
    page.get_by_label("What's the purpose of your").select_option("eCommerce")
   
    # Calculate
    page.get_by_role("button", name="Calculate").click()
    expect(page.get_by_text("Upstream Emissions:")).to_be_visible()
    expect(page.get_by_text("35%")).to_be_visible()
    expect(page.get_by_text("Indirect Emissions:")).to_be_visible()
    expect(page.get_by_text("0%", exact=True).first).to_be_visible()
    expect(page.get_by_text("Direct Emissions:", exact=True)).to_be_visible()
    expect(page.get_by_text("64%")).to_be_visible()
    expect(page.get_by_text("Downstream Emissions:")).to_be_visible()
    expect(page.get_by_text("1%", exact=True)).to_be_visible()

