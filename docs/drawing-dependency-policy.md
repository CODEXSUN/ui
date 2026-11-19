# Drawing dependency resolution policy — UI0.1.18

[Original frozen0.1.17 advisory assessment](security-drawing-20261119.md)

UI0.1.18 deliberately overrides the affected transitive drawing packages at the UI producer installation root. Existing Excalidraw0.18.1, converter2.2.2, nested Mermaid11.17.2 and direct Mermaid12.2.0 remain unchanged. Public Whiteboard, preview, serialization/hydration and all other UI17 APIs are unchanged. This patch changes dependency resolution, not application data, routes, privileges or visual design.

## Policy and compatibility

The installing root package.json must contain:

```json
{
  "overrides": {
    "@excalidraw/excalidraw": { "nanoid": "3.3.20" },
    "@excalidraw/mermaid-to-excalidraw": { "nanoid": "5.1.16" },
    "lodash-es": "4.18.1",
    "katex": "0.18.10"
  }
}
```

The3.x Nanoid upgrade stays on the editor's current major. Converter Nanoid4.0.2 has no patched4.x release; moving only that ancestry to5.1.16 is deliberate, with its named nanoid import/call shape verified through actual browser conversion. Its Node support is^18 or>=20; this workspace tests Node26.13.1. Do not force all Nanoid copies onto a single major. Lodash4.18.1 clears the three audited lodash-es GHSAs. KaTeX0.18.10 exceeds the patched0.18.2 floor and was already used by direct Mermaid12; applying it to Mermaid11 exceeds its original^0.16.47 constraint, so browser math/conversion compatibility was explicitly exercised. Excalidraw downgrade0.17.6 and converter major3 were not used.

These are root override rules, not automatically inherited dependency policy. UI producer npm ci uses the committed lock. Hosts building sibling UI first must pin the new UI commit, install/build that producer using its lock, then inspect final host chunks. Independent packed/npm consumers MUST apply the same root rules and regenerate/commit their own lock. Their UI package version alone does not guarantee patched transitive resolution. An app-root override alone also does not fix a separately installed older producer tree. Preserve existing unrelated overrides and review collisions rather than overwriting the whole object.

Do not claim existing Codeitz, UIUX, Zetro, add-on or other deployed artifacts are fixed by this source publication. App owners must rebuild from approved immutable source, inspect actual resolutions, audit the compiled graph and use their normal controlled deployment. No forced app repin/redeploy was performed here.

## Verified evidence — 2026-11-19

Fresh isolated clone C:/Users/sunda/AppData/Local/Temp/ui-security-fix-20261119; normal npm install and subsequent npm ci (ignore-scripts, no legacy-peer-deps), actual build and tests. Existing Excalidraw nested React18 peer warnings remain; React19 source/consumer browser checks pass. Those warnings were not suppressed by a peer-resolution bypass.

- Producer audit: zero known npm advisories after overrides. This addresses the eight original GHSAs in this resolved tree, not all potential application vulnerabilities.
- Actual-resolution regression checks Excalidraw, converter, nested Mermaid, KaTeX and Nanoid imports and locked Lodash copies.
- Production Vite8.3.8 build, fresh headless Edge: saved scene hydration without false dirty event; actual pointer drawing creates a second element and triggers dirty; serialized scene retains both; PNG blob and WhiteboardPreview image load.
- Converter browser tests: flowchart5elements, sequence12elements, class/ER/state image fallback1element each; math flowchart5elements. No claim these fallbacks became native editable shapes.
- Direct KaTeX math render2996characters; direct Mermaid12 math SVG30867characters and nested Mermaid11 math SVG11481characters. No page errors. These are normal functional cases, not an exploit test or a complete adversarial sanitizer review.
- Packed UI0.1.18 installed in a separate real consumer with the documented root policy; consumer audit zero; production build and the same actual Whiteboard/drawing/math/conversion/PNG checks pass using public @workspace/ui and @workspace/ui/blocks/whiteboard imports. No producer source alias or dependency symlink in that consumer.
- Annotated producer/consumer module evidence confirms emitted drawing dependencies resolve to Nanoid3.3.20/5.1.16, KaTeX0.18.10 and lodash-es4.18.1. See security-drawing-20261119/fix-0.1.18/ for audit JSON, graph/version evidence, browser results and screenshot.

Clean-install verification passed104/104 UI tests in44.166s and4/4 release-tool tests; build and version checks passed. This patch creates a new immutable version; it never changes17 or earlier tags. A packed consumer without the root policy is not covered by the zero-advisory result.
