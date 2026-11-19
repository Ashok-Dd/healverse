# Settings backlog

The Settings screen only contains things that work today:

| Item | What it does |
| --- | --- |
| Theme (System / Light / Dark) | Saved on the device, applied on launch |
| Meal reminders (breakfast 8:00, lunch 13:00, dinner 20:00) | Local daily notifications, one switch per meal. Permission is asked when a switch is turned on. Tap opens the Logging tab |
| Signed in as | Shows the username |
| Sign out | Clears local data and the token |
| Version | App version from `app.json` |

Everything below was removed from the old Settings screen because it had no logic behind it
(rows that did nothing, or copy from another app). Each can come back once the work in the
last column is done.

| Removed item | Why it did nothing | What it needs |
| --- | --- | --- |
| Edit name, age, gender, height, current weight | The row built a URL and never navigated; no detail screen exists | Client: an edit screen reusing the onboarding rulers/pickers. Server: `PUT /api/user/profile` **already exists** |
| Edit goal, activity level, dietary restriction, health conditions | Same | Client: reuse the onboarding `ChoiceCard` steps. Server: same endpoint. A changed profile should also offer to regenerate the diet plan |
| Unit system (metric / imperial) | Modal changed nothing | Client: a persisted units preference used by the weight and height rulers, the profile card and logs |
| Add exercise calories to daily goal | A switch bound to local state only | Server: dashboard summary must apply the flag; a profile field or setting to store it |
| Language, Country | Modal changed nothing | Client: i18n setup and translations. There is no localisation yet |
| Rate us | Only logged to the console | Store listing URL (Play Store link) and `expo-store-review` |
| Contact us | Only logged to the console | A support email or form; open with `Linking.openURL("mailto:...")` |
| Terms of Service, Privacy Policy | Only logged to the console | Hosted URLs; open with `expo-web-browser`. Required for the Play Store listing anyway |
| Manage subscriptions, Upgrade to PRO, Lifetime offer, "Try FitAI" | Copied from another app. There is no paid plan | Only relevant if a paid tier is added (billing, entitlement checks on the server) |
| Delete account | Not present before | Server endpoint to delete the user and their data. Play Store requires an in-app way to request deletion |

## Chat history

| Removed item | Why | What it needs |
| --- | --- | --- |
| Rename conversation | Only logged to the console | Server: an endpoint to update a conversation title (`/api/conversations` only supports list, read messages, send message) |
| Delete conversation | Only logged to the console | Server: delete endpoint; client: confirm dialog and cache update |
| Last message preview in the list | Not returned by the list endpoint | Server: include the last message (or a short preview) in `GET /api/conversations/` |
