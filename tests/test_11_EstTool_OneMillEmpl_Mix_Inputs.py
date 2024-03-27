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
    page.get_by_label("Cloud 50%On-prem 50%").click()
    page.get_by_label("Cloud 50%On-prem 50%").press("ArrowLeft")
    page.get_by_label("Cloud 45%On-prem 55%").press("ArrowLeft")
    page.get_by_label("Cloud 40%On-prem 60%").press("ArrowLeft")
    page.get_by_label("Cloud 35%On-prem 65%").press("ArrowLeft")
    page.get_by_label("Cloud 30%On-prem 70%").press("ArrowLeft")
    page.get_by_label("Cloud 25%On-prem 75%").press("ArrowLeft")
    page.get_by_label("Cloud 20%On-prem 80%").press("ArrowLeft")
    expect(page.get_by_text("Cloud 15%")).to_be_visible()
    page.get_by_label("What is your monthly cloud").select_option("10000-50000")
    
    # Users
    expect(page.get_by_role("heading", name="Users")).to_be_visible()
    expect(page.get_by_text("Tell us about your users. At")).to_be_visible()
    expect(page.get_by_text("Where are your users")).to_be_visible()
    page.get_by_label("Where are your users").select_option("global")
    expect(page.get_by_text("How many monthly active users")).to_be_visible()
    page.get_by_label("How many monthly active users").click()
    page.get_by_label("How many monthly active users").fill("800000")
    expect(page.get_by_text("What percentage of your users")).to_be_visible()
    page.get_by_label("What percentage of your users").click()
    page.get_by_label("What percentage of your users").click()
    page.get_by_label("What percentage of your users").press("ArrowLeft")
    page.get_by_label("What percentage of your users").press("ArrowLeft")
    page.get_by_label("What percentage of your users").press("ArrowLeft")
    page.get_by_label("What percentage of your users").press("ArrowLeft")
    page.get_by_label("What percentage of your users").press("ArrowLeft")
    page.get_by_label("What percentage of your users").press("ArrowLeft")
    page.get_by_label("What percentage of your users").press("ArrowLeft")
    page.get_by_label("What's the purpose of your").select_option("socialMedia")
    page.get_by_text("Mobile 15%").click()
   
    # Calculate
    page.get_by_role("button", name="Calculate").click()
    expect(page.get_by_text("Upstream Emissions:")).to_be_visible()
    expect(page.get_by_text("31%")).to_be_visible()
    expect(page.get_by_text("Indirect Emissions:")).to_be_visible()
    expect(page.get_by_text("0%", exact=True).first).to_be_visible()
    expect(page.get_by_text("Direct Emissions:", exact=True)).to_be_visible()
    expect(page.get_by_text("68%")).to_be_visible()
    expect(page.get_by_text("Downstream Emissions:")).to_be_visible()
    expect(page.get_by_text("1%", exact=True)).to_be_visible()

