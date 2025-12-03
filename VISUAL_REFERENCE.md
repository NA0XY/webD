# Visual Reference Guide

This document provides visual ASCII diagrams to help understand the FinanceIQ structure.

## Background Layer System

```
┌─────────────────────────────────────────────────────────┐
│                     VIEWPORT                             │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  Layer 3: Floating Shapes (z-index: 0)        │    │
│  │  • Circles • Squares • Pulsing Dots           │    │
│  │        ⭘         ◇         •  •  •            │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  Layer 2: Gradient Orbs (z-index: 0)          │    │
│  │  Three large glowing spheres                   │    │
│  │    🟢 (emerald-cyan)    🟣 (purple-pink)      │    │
│  │           🔵 (cyan-emerald)                    │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  Layer 1: Grid Pattern (z-index: 0)           │    │
│  │  ┌───┬───┬───┬───┬───┬───┬───┬───┐            │    │
│  │  │   │   │   │   │   │   │   │   │            │    │
│  │  ├───┼───┼───┼───┼───┼───┼───┼───┤            │    │
│  │  │   │   │   │   │   │   │   │   │            │    │
│  │  ├───┼───┼───┼───┼───┼───┼───┼───┤            │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  CONTENT LAYER (z-index: 1)                    │    │
│  │  • Hero Text                                   │    │
│  │  • Credit Card                                 │    │
│  │  • Feature Cards                               │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  HEADER (z-index: 10)                          │    │
│  │  Logo | Nav Links | Try Demo Button           │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## Credit Card Structure

```
┌─────────────────────────────────────────────────────────┐
│           CREDIT CARD CONTAINER                          │
│              (height: 600px)                             │
│                                                          │
│              ┌─ Glow 1 (top-right)                      │
│              │  Pulsing white light                     │
│              │                                           │
│    ┌─────────────────────────────────────────┐          │
│    │  CREDIT CARD                             │          │
│    │  ┌───────────────────────────────────┐  │          │
│    │  │ CARD INNER                        │  │          │
│    │  │ ╔═══╗          Contactless       │  │          │
│    │  │ ║ █ ║          ))) ))) )))       │  │          │
│    │  │ ╚═══╝                             │  │          │
│    │  │         4562 1122 3344 5566       │  │          │
│    │  │                                   │  │          │
│    │  │  CARDHOLDER        EXPIRES       │  │          │
│    │  │  Harsh Singhal      12/28        │  │          │
│    │  │                                   │  │          │
│    │  │  ╔══════════════════════════╗    │  │          │
│    │  │  ║  SHINE EFFECT (overlay)  ║    │  │          │
│    │  │  ╚══════════════════════════╝    │  │          │
│    │  └───────────────────────────────────┘  │          │
│    └─────────────────────────────────────────┘          │
│                                         │                │
│                          Glow 2 (bottom-left) ─┘        │
│                          Pulsing cyan light             │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Floating Animation Cycle

```
Time: 0s (Start)                    Time: 3s (Middle)                    Time: 6s (End)
┌──────────────┐                    ┌──────────────┐                    ┌──────────────┐
│              │                    │              │                    │              │
│              │                    │      ╱──╲    │                    │              │
│              │                    │     │Card│   │                    │              │
│     ┌───┐    │         →          │      ╲──╱    │         →          │     ┌───┐    │
│     │   │    │                    │       ⤴      │                    │     │   │    │
│     │ C │    │                    │   (rotated)  │                    │     │ C │    │
│     │ a │    │                    │              │                    │     │ a │    │
│     │ r │    │                    │              │                    │     │ r │    │
│     │ d │    │                    │              │                    │     │ d │    │
│     └───┘    │                    │              │                    │     └───┘    │
│              │                    │              │                    │              │
└──────────────┘                    └──────────────┘                    └──────────────┘
  Position: 0                        Position: -20px                     Position: 0
  Rotation: 0°                       Rotation: 5°                        Rotation: 0°
```

## Shine Effect Movement

```
Frame 1 (0s)              Frame 2 (1s)              Frame 3 (2s)              Frame 4 (3s)
┌───────────┐             ┌───────────┐             ┌───────────┐             ┌───────────┐
│███        │             │    ███    │             │        ███│             │           │
│███        │             │    ███    │             │        ███│             │           │
│███        │             │    ███    │             │        ███│             │           │
│███  Card  │   →         │    Card   │   →         │  Card  ███│   →         │   Card    │
│███        │             │    ███    │             │        ███│             │           │
│███        │             │    ███    │             │        ███│             │           │
└───────────┘             └───────────┘             └───────────┘             └───────────┘
Off-screen left           Moving across              Almost off-screen          Cycle restarts
                                                     
Legend: ███ = Shine gradient (transparent → white → transparent)
```

## Contactless Wave Animation

```
Frame 1         Frame 2         Frame 3         Frame 4
  (0.0s)          (0.2s)          (0.4s)          (0.6s)

   ) ) )           ) ) )           ) ) )           ) ) )
   │ │ │           │ │ │           │ │ │           │ │ │
   ▼ │ │           ▼ ▼ │           ▼ ▼ ▼           │ ▼ ▼
 [Pulse]         [Pulse]         [Pulse]         [Pulse]
  Wave 1          Waves 1&2      All Waves        Wave 1 again
```

## Gradient Orb Movement Pattern

```
Orb 1 Path (15 seconds):          Orb 2 Path (20 seconds):
      
    Start ●─────→ ●                   ● ←───── ● Start
      ↓                                         ↑
      ↓                                         ↑
      ● ←───── ● Mid                   Mid ● ─────→ ●
```

## Z-Index Stack Order (Side View)

```
┌─────────────────────────────────────┐  ← Header (z-index: 10)
└─────────────────────────────────────┘
        
┌─────────────────────────────────────┐  ← Content Layer (z-index: 1)
│  Hero Text                           │
│  ┌───────────┐                      │
│  │Credit Card│                      │
│  └───────────┘                      │
│  Feature Cards                       │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐  ← Floating Shapes (z-index: 0)
│  ⭘  •  ◇  •  •                      │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐  ← Gradient Orbs (z-index: 0)
│     🟢       🟣       🔵              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐  ← Grid Pattern (z-index: 0)
│ ┌─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┐      │
│ ├─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┤      │
│ └─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┘      │
└─────────────────────────────────────┘
```

## Color Gradient Visualization

```
Credit Card Gradient (135° diagonal):

Start                   Middle                    End
(emerald)              (cyan)                  (purple)
#10b981                #06b6d4                 #8b5cf6

  ┌───────────────────────────────────────┐
  │████                                   │
  │  ████                                 │
  │    ████                               │
  │      ████                             │
  │        ████                           │
  │          ████                         │
  │            ████                       │
  │              ████                     │
  │                ████                   │
  │                  ████                 │
  │                    ████               │
  │                      ████             │
  │                        ████           │
  │                          ████         │
  │                            ████       │
  │                              ████     │
  │                                ████   │
  │                                  ████ │
  └───────────────────────────────────────┘
```

## Glow Effect Positions

```
┌──────────────────────────────────────┐
│  ⚪ Glow 1                           │
│   │ (white, top-right)               │
│   │                                   │
│   │     ┌─────────────┐              │
│   └────→│             │              │
│         │   CREDIT    │              │
│         │    CARD     │←────┐        │
│         │             │     │        │
│         └─────────────┘     │        │
│                             │        │
│                   Glow 2 ⚪ │        │
│              (cyan, bottom-left)     │
└──────────────────────────────────────┘
```

## Animation Timing Comparison

```
Timeline (seconds):     0    5    10   15   20   25   30
                        │    │    │    │    │    │    │
Card Float (6s):        ▰▰▰▰▰▰    ▰▰▰▰▰▰    ▰▰▰▰▰▰    ▰▰▰▰▰▰
Card Shine (3s):        ▰▰▰  ▰▰▰  ▰▰▰  ▰▰▰  ▰▰▰  ▰▰▰  ▰▰▰  ▰▰▰
Glow 1 Pulse (4s):      ▰▰▰▰     ▰▰▰▰     ▰▰▰▰     ▰▰▰▰     ▰▰▰▰
Glow 2 Pulse (4s):        ▰▰▰▰     ▰▰▰▰     ▰▰▰▰     ▰▰▰▰   
Orb 1 Float (15s):      ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰              ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
Orb 2 Float (20s):      ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰         
Orb 3 Float (22s):      ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰       

Legend: ▰ = Animation cycle
```

## Element Size Comparison

```
                    Actual Size Reference
                    
Grid Pattern:       100px × 100px squares
Card Width:         400px
Card Height:        250px
Orb 1:              400px × 400px
Orb 2:              500px × 500px
Orb 3:              450px × 450px
Circle 1:           256px × 256px
Circle 2:           384px × 384px
Circle 3:           320px × 320px
Square:             128px × 128px
Dots:               8px × 8px
Glow Effects:       160px × 160px
Blur Amount:        80px (orbs), 40px (glows)
```

## Mobile vs Desktop Comparison

```
Desktop View:                      Mobile View:
┌────────────────────────┐        ┌──────────────┐
│  Header (full width)   │        │  Hamburger   │
├────────────────────────┤        ├──────────────┤
│                        │        │              │
│  Hero Text │ Card      │        │  Hero Text   │
│                        │        │              │
│                        │        │     Card     │
│  [Feature] [Feature]   │        │              │
│  [Feature]             │        ├──────────────┤
│                        │        │  [Feature]   │
│  Full background       │        │  [Feature]   │
│  animations            │        │  [Feature]   │
│                        │        │              │
└────────────────────────┘        │  Simplified  │
                                  │  animations  │
                                  └──────────────┘
```

## Performance Optimization

```
Animation Properties Used:

✅ GPU-Accelerated (FAST):          ❌ CPU-Intensive (SLOW):
   • transform                        • width/height
   • opacity                          • top/left/right/bottom
   • filter (blur)                    • margin/padding
                                      • background-position

Our animations only use ✅ properties for smooth 60fps performance!
```

These diagrams help visualize the structure and behavior of the FinanceIQ visual effects system. For detailed code examples, see `TECHNICAL_EXPLANATION.md`.
