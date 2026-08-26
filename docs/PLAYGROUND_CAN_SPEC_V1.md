# Playground Can Spec V1

Status: production handoff and runtime contract. The Blender GLB is the production geometry source of truth; the procedural can remains a retained reference/fallback. This document does **not** authorize sticker-system changes.

## Scope and sources of truth

The current reference implementation is:

- `src/components/playground/can/can-config.ts`
- `src/components/playground/can/CanModel.tsx`
- `src/components/playground/can/CanMesh.tsx`
- `src/components/playground/can/PlaygroundCanSpike.tsx`
- `src/components/playground/stickers/sticker-surface.ts`
- `src/lib/performance/gpu-config.ts`

The production asset path is `public/models/playground/can-v1.glb`, loaded by `CanModel` at `/models/playground/can-v1.glb`.

## Production GLB runtime decision

The Blender-authored GLB is the visible production can. Its inspected native runtime bounds are approximately `2 × 3.6800005 × 2` world units (width × height × depth), with a near-zero center offset on Y. It renders at `modelScale: 1`; the tiny configured Y correction recenters the raw bounds without changing its geometry or proportions.

The production visible can therefore has an approximately radius-`1` cylindrical footprint. The historical procedural can's derived overall height of approximately `2.95` is reference information only, not a production scale requirement. Do not normalize the GLB to that old height.

The next dedicated sticker integration task will match the invisible analytical interaction cylinder, usable straight-body height, and vertical constraints to the Blender model's actual straight body region. Sticker files remain unchanged until that task.

## Frozen runtime reference

### Coordinate system and central stickerable body

Three.js world units are the runtime source of truth. The can stands upright on the Y axis and is centered horizontally at `X = 0`, `Z = 0`.

| Contract item | Runtime value |
| --- | --- |
| Main body radius | `1` |
| Main body height | `2.52` |
| Main body center | `(0, 0, 0)` |
| Main body Y range | `-1.26` to `1.26` |
| Body radial detail in the procedural spike | `96` segments |
| Stickerable region | The clean external cylindrical body, radius `1`, height `2.52`, centered at `Y = 0` |

The main body is the only area intended to receive stickers. The shoulder, top, lower taper, rim, and inset must not be treated as stickerable surface.

### Top and bottom profile

The following values reproduce the present procedural silhouette. They are the target proportions for the production model.

| Feature | Current dimensions and placement |
| --- | --- |
| Upper shoulder | Height `0.18`; expands from neck radius `0.9` to body radius `1`; spans `Y = 1.26` to `1.44` |
| Neck / top rim center | `Y = 1.44` |
| Top rim | Torus major radius `0.91`, tube radius `0.045` (outer radius `0.955`) |
| Top inset | Radius `0.85`, thickness `0.025`, center `Y = 1.422` |
| Lower taper | Height `0.16`; contracts from body radius `1` to radius `0.9`; spans `Y = -1.26` to `-1.42` |
| Bottom rim center | `Y = -1.42` |
| Bottom rim | Torus major radius `0.91`, tube radius `0.045` (outer radius `0.955`) |
| Bottom inset | Radius `0.85`, thickness `0.024`, center `Y = -1.408` |

The current code does not expose one authoritative procedural `overallHeight` value. Derived from the procedural outer rim extents, it was approximately `2.95` units tall (`-1.465` to `1.485`). This is historical prototype information only: the production GLB's native approximately `3.68`-unit height is authoritative.

### Origin and scale convention for Blender

Set the asset origin at the total can's visual vertical center and at the radial center: `(0, 0, 0)`. Use `+Y` as upright, with the cylindrical body centered at `Y = 0`. Apply all object transforms before export.

No real-world unit conversion is encoded in the current app. For modeling comfort, a normal 330 mL can-sized reference (roughly 66 mm diameter and 120–130 mm overall height) is reasonable, but export the final, applied GLB so that it keeps its authored runtime dimensions. The current production GLB uses native runtime scale `1`; do not use a non-unit import scale to force the historical procedural height.

## Sticker and interaction contract

The existing sticker system is an analytical curved-surface system, not a raycast against can mesh triangles. Its current cylinder math uses radius `1`, which already matches the can body exactly.

For the next dedicated sticker integration, retain an invisible interaction cylinder rather than raycasting the visible GLB. Its radius is expected to remain `1`, matching the production GLB's diameter of approximately `2`; its height and vertical bounds must be measured from the actual straight body region before changing sticker logic.

The previous procedural target was:

```ts
{
  radius: 1,
  height: 2.52,
  center: [0, 0, 0],
}
```

It is a logic-only surface: stickers should continue to calculate positions, normals, angular placement, vertical clamping, seam behavior, and curved-surface geometry analytically. The rendered GLB must not become the source of sticker hit testing or placement. This protects draggable behavior from mesh topology, tab details, and material-slot changes.

Important current integration note: `sticker-surface.ts` still declares `cylinderSurface.height: 3` for the standalone spike. Do not silently change that value during asset production. A later dedicated integration task must align the interaction-cylinder height and vertical clamping with the Blender model's measured straight body region as one coordinated change, while preserving the existing sticker pose semantics and curved-surface behavior.

The active interaction visibility setting is `visibleArcHalfAngle: 1.77`. Its intended partial wrap near the silhouette remains valid; do not compensate for it in the GLB geometry.

## Recommended mesh structure

Use a small, semantic node hierarchy. Meshes may be combined only when the resulting material slots and readable profile are preserved.

```text
Can
├─ Can_Body
├─ Can_Top
├─ Can_Bottom
└─ Can_Tab (optional)
```

- `Can_Body` must retain a clean, uniformly cylindrical external panel through the full stickerable body range. Avoid embossed branding, deep grooves, seams, or raised labels on this panel.
- `Can_Top` includes the shoulder, rim, inset, opening detail, and any tab support geometry.
- `Can_Bottom` includes the lower taper, rim, and inset.
- `Can_Tab` is optional but preferred if a pull tab is modeled. Keep it simple and physically plausible.

A pull tab and restrained opening detail are allowed on the top only. Do not add brand marks, text, printed graphics, labels, decorative seams, or exaggerated dents.

## Geometry guidance

The can should read as a clean brushed-aluminum beverage can at the current camera distance. Match the profile in this order of importance:

1. Smooth radius-`1` cylindrical body with no sticker-obstructing relief.
2. Gentle upper shoulder into the radius-`0.9` neck.
3. Thin, rounded top rim and recessed lid.
4. Short lower taper, rounded lower rim, and recessed base.

Use enough radial and silhouette resolution for a smooth close-up at the present camera framing. The procedural reference uses 96 radial segments; production topology may differ, but it must not introduce visibly faceted outlines. Keep geometry economical, avoid hidden internal surfaces, and avoid subdivision-heavy detail that is invisible at the intended distance.

Do not model stickers into the asset. Do not use the can mesh as a substitute interaction collider.

## Material and texture handoff

### Ownership boundary

Blender/GLB owns:

- geometry and UVs;
- optional restrained roughness and normal detail;
- a minimal set of material slots that distinguish body, top/rim, and bottom when needed.

Three.js owns:

- final material tuning;
- studio environment lighting and reflections;
- active/inactive rendering behavior;
- idle rotation, hover pause, and reduced-motion behavior;
- all sticker rendering and interaction.

The current procedural material is a neutral aluminum-like finish: base color `#b8bab7`, metalness `0.97`, roughness `0.38`, and environment intensity `0.8` on the body/shoulder/lower taper. The top and bottom use the same base color with restrained variation: rim roughness `0.30`; top inset roughness `0.45` and environment intensity `0.60`; bottom inset roughness `0.48` and environment intensity `0.56`.

The procedural body currently has one generated 512 × 512 roughness texture: mostly subtle vertical brushing with only very faint hairline marks. It is deterministic, created once, and disposed with the mesh. The GLB should look similarly clean: no logo, no color design, no obvious scratches, no heavy dirt, and no noisy or high-contrast brushed pattern.

For V1, prefer no texture unless it is required to avoid a flat CG appearance. If textures are used, use a small, tileable/UV-appropriate roughness map and optional restrained normal map; keep each at 1K or below. Do not bake lighting, large reflected shapes, ambient occlusion that dirties the body panel, labels, or branding into base color.

## Scene, lighting, and camera reference

The asset must preserve its intended look under the existing scene, rather than asking the scene to be retuned around the asset.

| Scene setting | Current value |
| --- | --- |
| Camera | Perspective, FOV `32`, position `[0, 0.55, 7.5]`, looking at `[0, 0, 0]` |
| Background | `#080808` |
| Environment | PMREM-generated `RoomEnvironment` studio environment |
| Ambient light | Intensity `0.16` |
| Hemisphere light | Intensity `0.32` |
| Key directional light | Intensity `2.1`, position `[4, 5, 6]` |
| Side directional light | Intensity `0.75`, position `[-4, 1.5, 3]` |
| Idle revolution | One full rotation every `24` seconds |

Idle rotation pauses while the can is hovered and when reduced motion is preferred. This behavior is scene-level and must remain outside the GLB.

## GPU and lifecycle constraints

Keep the current GPU policy intact during the eventual replacement:

- The playground scene is registered with `useGpuSceneActivity` at priority `1`.
- It renders with `frameloop="always"` only while active and `frameloop="never"` while inactive.
- The configured desktop DPR ceiling is `1.5`; mobile policy ceiling is `1.25` in `gpu-config.ts`. The current canvas specifically uses `[1, desktopMaxDpr]`.
- The PMREM environment and temporary room-environment resources are created and disposed by the scene.
- Any GLTF-loaded geometry, materials, and textures must follow the project's established disposal/ownership pattern. Do not duplicate PMREM environments per model instance.

The can should remain a single lightweight scene asset. Avoid animations, skinning, cameras, lights, helper objects, or duplicate material variants in the exported file.

## GLB export checklist

Export a glTF 2.0 binary (`.glb`) with:

- applied location, rotation, and scale;
- `+Y` upright orientation and origin at the can center;
- only the semantic render nodes/materials required for the can;
- no Blender cameras, lights, empties, hidden helper geometry, or unused materials;
- no embedded branding or sticker artwork;
- no runtime-dependent scale correction;
- compact geometry and only necessary textures;
- a final visual comparison against the current procedural silhouette under the existing studio scene.

The current production asset destination is:

```text
public/models/playground/can-v1.glb
```

The asset is loaded at native scale; do not add a scale normalization step for the historical procedural height.

## Replacement API contract

The completed code replacement keeps the scene boundary intact. `PlaygroundCanSpike` continues to own the canvas, camera, lights, PMREM environment, GPU activity, idle rotation, hover pause, reduced-motion handling, and future sticker interaction surface. `CanModel` is the active visible rendering unit; procedural `CanMesh` remains a retained reference/fallback.

Conceptually, the later swap is:

```tsx
// Current rendering-only asset.
<CanModel />
```

`CanModel` loads and renders the GLB at native world scale (`1`) with only a tiny deterministic center correction. It exposes the minimal presentation hooks needed by the existing scene. It must not absorb sticker state, analytical placement math, drag handling, canvas lifecycle, or scene lighting setup.

## Explicit non-goals for V1

- No changes to GLB geometry, material constants, camera, lighting, GPU lifecycle, or idle behavior.
- No changes to sticker geometry, drag logic, theta calculation, seam logic, interaction visibility, or final placement behavior.
- No branding, label art, multiple can variants, animation clips, or new dependencies.
