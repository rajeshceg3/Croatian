
from playwright.sync_api import sync_playwright
import time

def verify_ux_improvements():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # Desktop Context
        context_desktop = browser.new_context(viewport={'width': 1440, 'height': 900})
        page_desktop = context_desktop.new_page()

        # Mobile Context (iPhone 12 Pro)
        context_mobile = browser.new_context(
            viewport={'width': 390, 'height': 844},
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
            is_mobile=True,
            has_touch=True
        )
        page_mobile = context_mobile.new_page()

        print("Navigating to Desktop...")
        page_desktop.goto("http://localhost:8080")
        page_desktop.wait_for_selector(".marker-pin", timeout=10000)
        time.sleep(2) # Allow map tiles to load

        # Desktop Interactions
        # 1. Focus search to see style
        page_desktop.click("#search-input")
        time.sleep(0.5)

        # 2. Click a filter
        page_desktop.click(".filter-chip:first-child")
        time.sleep(1)

        # 3. Open a popup
        page_desktop.click(".marker-pin >> nth=0")
        time.sleep(1)

        page_desktop.screenshot(path="verification/desktop_polish_final.png")
        print("Desktop screenshot saved.")

        print("Navigating to Mobile...")
        page_mobile.goto("http://localhost:8080")
        page_mobile.wait_for_selector("#sidebar", timeout=10000)
        time.sleep(2)

        # Mobile Interactions
        # 1. Expand sidebar (emulate touch) - though click should work for toggling logic
        page_mobile.click("#mobile-handle-container")
        time.sleep(1)

        # 2. Focus search
        page_mobile.click("#search-input")
        time.sleep(0.5)

        page_mobile.screenshot(path="verification/mobile_polish_final.png")
        print("Mobile screenshot saved.")

        browser.close()

if __name__ == "__main__":
    verify_ux_improvements()
