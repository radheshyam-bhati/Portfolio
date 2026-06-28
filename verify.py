from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:4173/Portfolio/")
    page.wait_for_timeout(2000)

    # Note memory says: The application features a preloader that temporarily sets overflow: hidden on the document body.
    # Playwright testing scripts must wait for this style to be removed (e.g., page.wait_for_selector('body:not([style*="overflow: hidden"])'))
    # before interacting with or scrolling the page.
    page.wait_for_selector('body:not([style*="overflow: hidden"])', timeout=10000)
    page.wait_for_timeout(1000)

    # Scroll to Projects section
    projects_section = page.locator("#projects")
    projects_section.scroll_into_view_if_needed()
    page.wait_for_timeout(2000)

    # Hover over the first project's GitHub link
    github_link = page.locator("a[aria-label*='source code on GitHub']").first
    github_link.hover()
    page.wait_for_timeout(1000)

    # Take a screenshot while hovering
    page.screenshot(path="/home/jules/verification/screenshots/projects_verification.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()  # MUST close context to save the video
            browser.close()
