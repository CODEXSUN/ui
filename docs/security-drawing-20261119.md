# Drawing dependency security audit — 2026-11-19

Follow-up: [UI0.1.18 resolution and consumer policy](drawing-dependency-policy.md) records the subsequently tested deliberate overrides. The frozen0.1.17 findings below remain historical evidence; they still apply to unchanged installations.

Status: assessment complete; remediation remains open. This is NOT a browser security certification or a demonstrated exploit. UI0.1.17 and Whiteboard contracts were preserved; no runtime dependency change, version bump, tag move, deployment or app repin was made.

## Frozen source and counts

Audited immutable UI0.1.17, commit7a6bbfee17b8775b3a5140041e8aa2da0cc37fc0, in isolated checkout C:/Users/sunda/AppData/Local/Temp/ui-security-20261119. npm audit against its unchanged lock reports12 affected package entries:9high,1moderate,2low; eight distinct GHSAs. The previously reported13 is a different consumer snapshot, not13 independent flaws. The existing packed consumer now reports14 entries because @workspace/ui and @workspace/comments add propagation entries; it has the same underlying drawing advisory IDs. See security-drawing-20261119/{ui17-audit,consumer-audit,advisories}.json. Advisory databases and consumer resolution can change these counts.

Both direct runtime dependencies are relevant: Excalidraw0.18.1 and Mermaid12.2.0. Excalidraw imports converter2.2.2, which brings Mermaid11.17.2, parser0.6.3/Langium3.3.1/Chevrotain11 and KaTeX0.16.47. Direct Mermaid12.2.0 separately resolves KaTeX0.18.10; that newer copy does not fix the nested copy.

## Exact advisories

| GHSA / primary source | Affected ranges | Locked affected copies | Fixed version floor |
| --- | --- | --- | --- |
| [r5fr-rjxr-66jc](https://github.com/advisories/GHSA-r5fr-rjxr-66jc) lodash template code injection | >=4.0.0 <=4.17.23 | lodash-es4.17.23 and4.17.21 |4.18.0 |
| [f23m-r3pf-42rh](https://github.com/advisories/GHSA-f23m-r3pf-42rh) lodash array-path pollution | =4.17.23 | lodash-es4.17.23 |4.18.1 |
| [xxjr-mmjv-4gpg](https://github.com/advisories/GHSA-xxjr-mmjv-4gpg) lodash path pollution | >=4.0.0 <4.17.23 | lodash-es4.17.21 |4.17.23 (insufficient for other GHSAs) |
| [mwcw-c2x4-8c55](https://github.com/advisories/GHSA-mwcw-c2x4-8c55) nanoid fractional sizes | <3.3.8; >=4.0.0 <5.0.9 |3.3.3 and4.0.2 |3.3.8 /5.0.9 |
| [28wg-ghj8-5hjv](https://github.com/advisories/GHSA-28wg-ghj8-5hjv) nanoid negative nonsecure size | <3.3.16; >=4.0.0 <5.1.16 |3.3.3 and4.0.2 |3.3.16 /5.1.16 |
| [2v37-7h3g-55p8](https://github.com/advisories/GHSA-2v37-7h3g-55p8) nanoid custom zero size | <3.3.18; >=4.0.0 <5.1.6 |3.3.3 and4.0.2 |3.3.18 /5.1.6 |
| [xwg4-73v4-xw9w](https://github.com/advisories/GHSA-xwg4-73v4-xw9w) nanoid pool integer overflow | <3.3.12; >=4.0.0 <5.1.11 |3.3.3 and4.0.2 |3.3.12 /5.1.11 |
| [238p-pmpm-9mq7](https://github.com/advisories/GHSA-238p-pmpm-9mq7) KaTeX inherited options | >=0.11.0 <0.18.2 |0.16.47 |0.18.2 |

Remaining npm entries (Chevrotain, gast, cst-dts-gen, Langium, parser, Mermaid, converter, Excalidraw) propagate these advisories; they are not additional independent vulnerabilities. lodash-es4.18.1 at the root is unaffected but does not replace exact nested pins.

## Browser reachability and limits

Codeitz src/web/modules/projects/whiteboard.tsx reexports the public shared Whiteboard; project-workspace.tsx lazy-mounts it for editing and WhiteboardPreview for thumbnails. Shared whiteboard.tsx imports Excalidraw, serializeAsJSON and exportToBlob. Thus this is runtime browser code, not merely a development tool. Lazy loading delays execution; it does not remove the dependency. No Codeitz source was changed.

A production Vite8.3.8 library build of the exact UI17 Whiteboard source completed successfully (ES modules, normal tree shaking, React external, no dev server/browser/container). The source checkout used a read-only node_modules junction to the existing UI installation; relevant package versions were compared with the frozen lock. This is a representative compiled dependency graph, not certification of every deployed host build. Artifact module IDs and rendered lengths are in security-drawing-20261119/browser-module-evidence.json (362 matching drawing/parser/lodash modules).

- Both nanoid browser implementations are emitted:3.3.3 in chunk-K2UTITRG-C2C2ZCqP.js and4.0.2 in dist-wxLxE7FL.js. Reviewed Excalidraw imports only nanoid(), with default21 or fixed40; converter uses default nanoid(). No user-influenced size was found in these callers. customRandom/customAlphabet and nonsecure generators are absent from those emitted chunks. The integer-pool advisory describes the Node pool path; the browser implementation uses crypto.getRandomValues directly. These facts reduce applicability of these exact triggers in this build; they do not upgrade the vulnerable packages or prove every consumer safe.
- KaTeX0.16.47 is emitted in katex-24cyVXVV.js (rendered494758bytes), reachable through converter Mermaid math rendering. The advisory needs prior prototype pollution or attacker influence over options/prototypes and relevant unsanitized output insertion. No working combined exploit was demonstrated. Mermaid's sanitization/configuration is a further condition, not a reason to discard the advisory. Shared direct MermaidPreview initializes strict mode, but the converter maintains its own Mermaid11 runtime/configuration; the direct setting does not certify that separate path.
- lodash-es has238 nonzero emitted modules, but template.js, unset.js, omit.js and pullAt.js (the vulnerable functions named by these GHSAs) and cst-dts-gen are not emitted in this representative build. The installed vulnerable copies remain audit findings. Other host entries/build configurations require their own graph check; do not generalize this tree-shaking result to all apps.
- MarkdownContent/AssistantChatPanel use shared MermaidPreview; that direct12.2.0 path is distinct from the vulnerable converter's11.17.2. No assistant/Whiteboard feature, serialization/hydration behavior, auth or storage contract was altered.

A zero npm audit --omit=dev result in a consuming server cannot certify its compiled frontend. Evaluate the build-time dependency graph and shipped chunks as well as the installed server dependency set.

## Upgrade assessment / exact blocker

Registry checks on2026-11-19: Excalidraw latest remains0.18.1. Its manifest pins nanoid exactly3.3.3. Converter2.2.2 pins nanoid exactly4.0.2 and Mermaid^11.12.1; its nested Mermaid11.17.2 requires KaTeX^0.16.47. Chevrotain11 packages pin lodash-es4.17.23; Langium3.3.1 also retains lodash-es4.17.21. No normal compatible refresh within these declared constraints clears all findings. npm audit suggests Excalidraw0.17.6, a downgrade across the current0.18 API contract; it was rejected, not applied with audit fix --force.

- nanoid3.3.20 is an available same-major patched candidate for Excalidraw's3.x copy. It requires overriding an upstream exact pin (or upstream patch), followed by drawing/serialization/export tests. It would not fix converter4.0.2. No patched4.x line was found; converter needs a validated5.1.16+ transition.
- lodash-es4.18.1 is a same-major patched candidate, but exact nested constraints require an upstream change or explicit host-root override. Test parser variants as well as diagram conversions before release.
- KaTeX0.18.2+ is outside nested Mermaid's^0.16.47 constraint. A blind override across0.x minor API boundaries is not a demonstrated compatible fix. Mermaid12.2.0 already uses a patched copy; replacing the converter's Mermaid11 runtime with12 is a major integration change requiring upstream/adapter proof.
- Latest converter3.6.0 is a major upgrade, changes dependency architecture to pele1.13.0, and STILL declares nanoid4.0.2. It is not a safe automatic security solution for Excalidraw0.18.1.
- [npm overrides](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/#overrides) apply only at the installing root; adding overrides to shared UI alone does not propagate them into app consumers. A clean UI lock after such an override would not be a delivered cross-app fix.

Therefore no unproven cross-major override, downgrade, vendor patch or dependency-only cosmetic release was applied. Remediation remains OPEN for all consumers retaining these versions. Next implementation must demonstrate patched upstream compatibility or a reviewed shared adapter/vendor strategy, then publish a fresh UI patch and have owners verify their immutable rebuilt browser artifacts. Existing17 tag stays immutable. Owners should retain explicit risk tracking and assess trust boundaries for untrusted diagram/math input while that work is pending; no global safety/zero-vulnerability claim is warranted.

## Operations

No UIUX repin/redeploy solely for libraries, sibling app edits, project-manager/ecommerce changes, database/migration, engine/container restart, lock deletion or load tests were performed. UIUX's separate post-recovery health report remains authoritative for runtime checks; source security assessment does not change its approved deployment identity.


### Producer versus consumer resolution

Codeitz's build assembles and installs the sibling UI producer before building the host. Its React-only dedupe does not necessarily relocate drawing dependencies to the app root. Therefore an app-root-only override is also insufficient proof when the compiled import resolves through producer node_modules. Validate BOTH the producer installation/lock and the final host module graph. The representative bundle here resolved drawing imports from the UI producer tree. Neither a producer audit alone nor a consumer audit alone replaces that final artifact check. The independent reviewer additionally reported live Codeitz1.0.11 serves the old KaTeX0.16.47 chunk; this owner did not repeat that live browser check. UI16 and17 drawing lock entries are unchanged. Keep that reported live observation distinct from the frozen source/compiled evidence collected here.
