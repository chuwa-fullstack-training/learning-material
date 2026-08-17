# GitHub User List

> 🟢 AI can assist with implementation, but you must understand the custom Hook abstraction.

## Description

![github_list](hw1.gif)

## Requirements

- [ ] Show a list of GitHub users with their avatar and username, fetched from the [GitHub API](https://api.github.com/users)
- [ ] Each user in the list is clickable, showing the user's profile page on the right side
- [ ] The profile page should show the user's avatar, username, name, and some repositories
- [ ] **Extract data fetching logic into a custom `useFetch` hook** (reuse it for both user list and user detail)
- [ ] Handle loading and error states using your custom hook
- [ ] Wrap the main content area with an **Error Boundary** component
