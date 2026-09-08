# Project OS supplied artwork

Owner-supplied transparent PNGs are retained here byte-for-byte. No redraw, recoloring, flattening, trimming or scene editing was performed. Motto: **estimate, schedule, deliver**.

| Original | Owner filename | SHA-256 |
|---|---|---|
| project-os-icon.png | F3074708-80C8-4C03-ABD4-5B8F7870A1A6.png | a2f2f293f84d6f00d9581202703d981745aedb6cfda7668692b9e6f4e4d9c2d1 |
| project-os-stacked.png | AE258C21-7C70-407F-8349-B80B41107515.png | 9f1b0aacda3a558deeeb915c13431aaec4e5d7a4d18ee2013413a79afd0d16f6 |
| project-os-horizontal.png | 495F83E3-44AD-4949-924A-6110BD3FF919.png | b43457ff3072cbef881da36253964bd4a500920223b59cdb14df9040a0d35436 |
| project-os-stacked-inverse.png | 17D6FBB7-6570-4125-BE12-44EBB96436CF.png | 42ab1524ffd88fffc15b237b1bbfd079cb7ca2770090350386cb382fe3259cd2 |

Runtime assets under `public/images/brand/` are ordinary aspect-preserving width resizes (no enlargement) using Sharp 0.35.4, WebP lossless/effort 6 or PNG compressionLevel 9. Alpha is retained. `public/favicon.ico` contains the same 32px PNG in a standard single-image ICO container.

| Runtime output | Source stem | Width |
|---|---|---:|
| project-os-icon.webp | project-os-icon | 256 |
| project-os-horizontal.webp | project-os-horizontal | 800 |
| project-os-stacked.webp | project-os-stacked | 800 |
| project-os-stacked-inverse.webp | project-os-stacked-inverse | 480 |
| project-os-social.png | project-os-horizontal | 1200 |
| project-os-icon-512.png | project-os-icon | 512 |
| favicon-32.png | project-os-icon | 32 |
| apple-touch-icon.png | project-os-icon | 180 |

Horizontal navy is for the light marketing header/footer and social metadata; stacked navy is the decorative homepage artwork; stacked white is for the dark legal/contact header. The icon is used for the Project OS catalog item and browser icons. This asset update changes no product availability, plan, entitlement or provider claims.

## Interface demonstrations

The eight `public/images/{dashboard,estimate-builder,gantt,logic-network}-{light,dark}.png` images are browser captures at 1440 × 1000. They replace earlier screenshots with embedded obsolete branding. They are demonstrations of current components, not production customer sessions or proof of deployment.

Source: `seabee2007/calc` commit `608edee3df04456636a994ff5e13a7c1d2f03aed`, tree `ec5c2b4c575a20495ffeb7eba5e89eac0443808f`. An external, isolated fixture imports the unchanged `OperationsDashboard`, `EstimateDivisionBucketList`, `EstimateSummaryCard`, `LevelThreeGanttWorkspace`, `LogicNetworkWorkspace` and `ProjectOsLogo` components with the source stylesheet. Its wrapper labels every capture **Demonstration · sample data**. It does not alter tracked application source.

- Dashboard: an empty demonstration workspace. Authentication, entitlements and read-only query adapters are fixture substitutes; mutation methods throw.
- Estimate: the existing `sampleEstimateVersion` fixture, projected through `buildEstimateSnapshot`, `draftLineFromDomainTask` and `mergeDivisionBucketsWithActivities`.
- Gantt and logic: the two-activity A/B fixture from `levelThreeGanttUtils.test.ts` with a finish-to-start link. The real `runCpmCalculation` workflow produces the schedule. No solver result or diagram is drawn by the capture harness. Workspace tips are dismissed through the UI; Gantt uses its Fit width control and logic uses Fit view. Existing open-start/open-finish and unavailable-forecast indications remain visible.
- Playwright with Edge captures both themes. All non-local network requests are blocked; the successful capture run recorded zero attempted external requests and zero page errors. No production account, customer record, provider API or persistence mutation is used.

The original hero scene is no longer mounted. The replacement hero renders the supplied stacked logo directly, avoiding an edited or invented device scene.
