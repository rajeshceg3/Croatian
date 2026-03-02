import re

with open('map.js', 'r') as f:
    content = f.read()

search = """import { createCategoryFilters, updateSearchResults, addSearchListener, addClearFiltersListener, setupMobileInteractions, setupScrollEffects, getFavorites, getVisited, setupSurpriseMe, renderCollections, setupTravelTips, openDetailPanel, setupShareTrip, setupMyTripModal, setupSuggestedRoutes, setupOnboarding, setupThemeToggle, setupBadges, setupQuestSystem, getActiveQuestTargets, setupVibeMatcher } from './ui-module.js';"""

replace = """import { createCategoryFilters, updateSearchResults, addSearchListener, addClearFiltersListener, setupMobileInteractions, setupScrollEffects, getFavorites, getVisited, setupSurpriseMe, renderCollections, setupTravelTips, openDetailPanel, setupShareTrip, setupMyTripModal, setupSuggestedRoutes, setupOnboarding, setupThemeToggle, setupBadges, setupQuestSystem, getActiveQuestTargets, setupVibeMatcher, setupDynamicGreeting } from './ui-module.js';"""

if search in content:
    content = content.replace(search, replace)
else:
    print("Search block not found")

search = """        setupVibeMatcher(filterSites);"""

replace = """        setupVibeMatcher(filterSites);
        setupDynamicGreeting(filterSites);"""

if search in content:
    with open('map.js', 'w') as f:
        f.write(content.replace(search, replace))
    print("Replaced!")
else:
    print("Search block not found")
