# Fix Dropdown Menus

## Tasks
- [x] Investigate ProfileDropdown.tsx component for visibility issues
- [x] Investigate UserMenu.tsx component for visibility issues
- [x] Check CSS and positioning in dashboard and modules pages
- [x] Refactor ProfileDropdown.tsx to use shadcn/ui DropdownMenu for better reliability
- [ ] Verify LanguageSelector.tsx dropdown functionality
- [ ] Verify UserMenu.tsx dropdown functionality
- [ ] Test all dropdown menus for proper open/close behavior, alignment, and z-index

## Current Status
- Identified that ProfileDropdown.tsx uses custom dropdown implementation that may have positioning issues
- UserMenu.tsx uses shadcn/ui DropdownMenu components which should be more reliable
- LanguageSelector.tsx uses shadcn/ui DropdownMenu components
- ProfileDropdown dropdown uses absolute positioning with z-100, but may be positioned incorrectly
- Need to refactor ProfileDropdown to use shadcn/ui DropdownMenu for consistency and reliability
