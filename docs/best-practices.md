# Toggle Best Practices

- All new features should be wrapped by a toggle
- Avoid nesting toggles
- Try to wrap each feature with a single toggle if statement
- Append the changelog when changing the state of a toggle

## Toggle Types


| Release         | Business           |
| -------------------------------------------------|-------------------------------------------------------|
| Used to facilitate trunk based development   | All Release Toggles will graduate into Business Toggles |
| Wraps a non-complete feature      | For complete features      |  
| Allows us to make smaller pull requests and to ship builds with non-complete features | They can be turned on and off remotely   |
| Cannot be turned on remotely| After a period of time when they become stale they will be removed |
| Always off in production | |

