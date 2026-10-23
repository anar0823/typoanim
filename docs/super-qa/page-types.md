# Page types — typoanim.com

| Type | URL pattern | Non-blank guard | Spec |
|---|---|---|---|
| public-page | `/`, `/about`, `/faq`, `/license`, `/terms`, `/privacy`, `/refund`, `/dmca`, `/blog/**`, `/black-friday/**` | one `h1` visible, body text > 200 chars, one meta description | guest/pages.spec.ts |
| list-page | `/free-templates/**`, `/premium-templates/<category>`, `/templates/<category>`, `/templates/search` | ≥ 1 `[data-slug]` card **or** "No templates found" | guest/pages.spec.ts, navigation.spec.ts |
| detail-page | `/(free\|premium)-templates/<software>/<category>/<slug>` | `h1` + preview `<video>` reaches readyState ≥ 2 | guest/templates.spec.ts |
| form-page | `/login`, `/register`, `/forgot-password`, `/contact`, `/pricing` | form visible; submissions intercepted where they would create data or send email | guest/forms.spec.ts |
| settings-page | `/profile`, `/downloads`, `/collection` | plan badge (FREE PLAN / PREMIUM) visible | free/, premium/ |
