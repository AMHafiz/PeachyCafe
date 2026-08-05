# name : The Peachy

# reference website

Reference website:
https://www.thepeachy.ca

The goal is to create a faithful recreation of the current website while preserving:

- Branding
- Colors
- Typography
- Layout
- Product imagery
- Overall aesthetic
- Existing functionality

Study the current website carefully before implementation.

This is not a redesign.

This is a UX enhancement project.

Only implement the improvements listed in this document.

# additional reference

Uber Eats menu reference:
https://www.ubereats.com/ca/store/the-peachy/clG8wgnpVXqlLuvipXTbaA

Use this as a reference for:

- Product categories
- Drinks
- Menu organization
- Product descriptions
- Cross-selling opportunities
- Pairing suggestions

# objective
Create a pixel-close recreation of the existing The Peachy website while preserving the current branding, aesthetic, colors, typography, imagery, and overall premium minimalist feel.

This is NOT a visual redesign.

The goal is to improve the user experience, accessibility, navigation, and conversion rate while making the fewest visual changes possible.

The website should feel like The Peachy, but more polished and easier to shop.

# design principles

- Preserve existing Peachy branding
- Preserve existing color palette
- Preserve typography
- Preserve layout wherever possible
- Maintain premium minimal aesthetic
- Mobile-first responsive design
- Fast loading
- Smooth animations
- WCAG accessibility friendly

# UX goals

- Reduce scrolling
- Improve product discovery
- Increase customer confidence
- Increase average order value
- Increase conversion rate
- Reduce friction during browsing
- Keep customers engaged longer
- Improve mobile experience

# navigation improvements

Implement a sticky category navigation that remains visible while scrolling.

Categories should automatically highlight based on the section currently visible.

Include:

Whole Cakes

Spoon Cakes

Bingsu

Drinks

Bakery

Gift Sets (if applicable)

Smooth scrolling between categories.

# search

Add a live search bar.

Search by:

Product name

Flavor

Category

Description keywords

Display matching products instantly.

# filters

Allow filtering by:

Best Sellers

New

Seasonal

Chocolate

Fruit

Coffee

Whole Cakes

Drinks

Price range

Filters should work without reloading the page.

# product cards

Keep the existing visual style but improve information hierarchy.

Each card should include:

Product image

Product name

Short description

Price

Rating

Badges:

Best Seller

Staff Pick

New

Limited Time

Seasonal

Hover animation (desktop)

Subtle elevation animation

# product information

Remove the ingredient PDF workflow.

Every product should contain its own information.

Include:

Description

Ingredients

Allergens

Storage instructions

Serving information

Shelf life

Available sizes

Nutrition (optional if available)

No PDFs.

# product interactions

Small products:

Drinks

Pastries

Cookies

Display inside a Quick View modal.

Modal contains:

Large image

Description

Ingredients

Allergens

Price

Add to Cart

Close without leaving page.

Large products:

Whole Cakes

Celebration Cakes

Premium desserts

Open dedicated product pages.

Each product page includes:

Large gallery

Description

Flavor notes

Ingredients

Allergens

Storage

Serving guide

Available sizes

Sticky Add to Cart

Related products

Perfect Pairings

Customers also bought

# pairings

Suggest drinks that pair well with desserts.

Examples:

Spanish Latte

Matcha Latte

Peach Ade

Milk Tea

Display:

Perfect Pairings

Customers also bought

Frequently ordered together

# social proof

Support displaying:

Ratings

Review count

Best Seller badge

Staff Pick badge

New badge

Popular badge

Design the UI so these can easily be populated later.

# accessibility

Keyboard accessible

Visible focus states

Alt text for all images

High contrast

Large touch targets

Responsive typography

ARIA labels where appropriate

# mobile

Sticky category chips

Sticky Add to Cart

Large touch targets

Responsive product grid

Bottom navigation if appropriate

Fast scrolling

# animations

Keep animations subtle.

Use:

Fade

Scale

Slide

Hover lift

No excessive motion.

# performance

Lazy load images

Optimize images

Responsive image loading

Fast page transitions

Minimal layout shift

# implementation

Maintain existing Peachy branding.

Do not redesign the website.

Implement improvements as enhancements to the existing experience.

Everything should feel like an upgraded version of the current Peachy website rather than a completely new website.

# analytics & experimentation

Structure the codebase so it is ready for analytics and A/B testing.

Every important user interaction should have a unique ID or data attribute that can later be connected to Google Analytics 4, GrowthBook, Microsoft Clarity, or similar analytics tools.


Prepare components for tracking events such as:

- Product Viewed
- Product Page Viewed
- Quick View Opened
- Category Selected
- Search Used
- Filter Applied
- Product Added to Cart
- Pairing Clicked
- Recommendation Clicked
- Checkout Started
- Purchase Completed

Do not implement analytics yet.
Only prepare the application so analytics can be added easily later without refactoring.

# cloning requirements

The goal is to faithfully recreate the existing The Peachy website.

Keep the following unchanged unless explicitly listed in this plan:

- Branding
- Colors
- Typography
- Logo
- Imagery
- Layout
- Spacing
- Navigation structure
- Product organization
- Overall aesthetic

Only implement the UX improvements listed in this document.

Do not redesign the website.

The final product should feel like an official Version 2 of The Peachy website rather than a new website inspired by it.

