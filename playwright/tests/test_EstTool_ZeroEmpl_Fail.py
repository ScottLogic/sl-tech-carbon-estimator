import re

from playwright.sync_api import Page, expect


def test_example(page: Page) -> None:
    page.goto("http://localhost:4200/")
    expect(page.get_by_role("heading", name="Carbon Estimator")).to_be_visible()
    expect(page.get_by_role("heading", name="Organisation")).to_be_visible()
    expect(page.get_by_text("To understand the scale of")).to_be_visible()
    expect(page.get_by_text("How many employees are in the")).to_be_visible()
    expect(page.get_by_label("How many employees are in the")).to_be_visible()
    page.get_by_label("How many employees are in the").click()
    page.get_by_label("How many employees are in the").fill("0")
    page.get_by_role("button", name="Calculate").click()


