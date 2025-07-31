# Music-Based Spell System

A comprehensive magic system for D&D campaigns where spells are cast through musical performance.

## Overview

This system transforms traditional spellcasting into an interactive musical experience where:

- Spells require musical instruments to cast
- Performance quality affects spell effectiveness
- Different instruments and genres create unique magical effects
- DMs can create custom music-based spells with detailed performance mechanics

## Core Components

### 1. Instrument Categories

- **Wind (Viento)**: Flutes, whistles, horns
  - Magical Association: Air control, communication, inspiration
  - Best for: Evocation, Enchantment, Melody spells

- **Percussion (Percusión)**: Drums, bells, chimes
  - Magical Association: Vital rhythm, protection, invocation
  - Best for: Abjuration, Conjuration, Harmony spells

- **Strings (Cuerdas)**: Guitars, harps, violins
  - Magical Association: Emotions, enchantment, healing
  - Best for: Enchantment, Harmony, Melody spells

- **Keys (Teclas)**: Pianos, organs, harpsichords
  - Magical Association: Complex harmony, transformation, power
  - Best for: Transmutation, Resonance, Evocation spells

### 2. Musical Genres

- **Ballad (Balada)**: Healing, peace, protection
- **March (Marcha)**: Buffs, movement, courage
- **Lament (Lamento)**: Debuffs, fear, sorrow
- **Battle (Batalla)**: Combat, destruction, fury
- **Ritual (Ritual)**: Summoning, transformation, divination
- **Folk (Popular)**: Utility, everyday magic, community

### 3. Performance Quality System

Based on d20 + modifiers performance checks:

- **Poor (1-5)**: Spell may fail or backfire
- **Adequate (6-10)**: Basic spell effect
- **Good (11-15)**: Standard spell effect
- **Excellent (16-20)**: Enhanced effect (+25-50% power)
- **Masterful (21+)**: Maximum effect with bonuses

### 4. New Spell Schools

- **Harmonía**: Healing, buffs, cooperation magic
- **Disonancia**: Debuffs, discord, chaos magic
- **Resonancia**: Matter and energy manipulation
- **Melodía**: Charm, emotion, mind effects

## How It Works

### Creating Music Spells

1. **Toggle Music-Based**: Enable musical components for any spell
2. **Choose Instrument**: Select primary instrument category
3. **Select Genre**: Pick musical style that fits the spell's theme
4. **Set Difficulty**: DC 5-30 for performance checks
5. **Define Duration**: Rounds of performance required
6. **Performance Effects**: Custom effects for each quality level

### Casting Music Spells

1. **Performance Check**: Roll d20 + performance modifier
2. **Quality Determination**: Check result determines effect quality
3. **Duration Tracking**: Multi-round spells require sustained performance
4. **Effect Resolution**: Apply spell effects based on performance quality

### Example: Melodía Curativa (Level 1 Healing)

- **Instrument**: Strings (harp, guitar)
- **Genre**: Ballad (healing music)
- **Difficulty**: DC 12
- **Duration**: 2 rounds

**Performance Effects**:

- **Poor**: Spell fails, performer takes 1d4 psychic damage
- **Adequate**: Heal 1d4 HP to allies in 30 feet
- **Good**: Heal 1d4 + Charisma modifier HP
- **Excellent**: Above + advantage on next saving throw
- **Masterful**: Maximum healing + immunity to fear for 1 minute

## Features

### For DMs

- **Spell Creation Interface**: Easy-to-use form with musical components
- **Sample Spells**: 6 pre-built music spells to get started
- **Performance Dialog**: Interactive casting interface with dice rolling
- **Effect Calculator**: Automatic modifier calculations
- **Quality Reference**: Built-in performance quality guide

### For Players

- **Interactive Casting**: Dice rolling and performance tracking
- **Visual Feedback**: Color-coded quality indicators
- **Effect Descriptions**: Dynamic effect text based on performance
- **Progress Tracking**: Multi-round spell casting management

## Technical Implementation

### Type System

- Extended spell schema with optional musical components
- Type-safe instrument and genre enums
- Performance quality calculations
- Effect modifier system

### UI Components

- `MusicPerformanceDialog`: Interactive spell casting interface
- Enhanced spell creation form with musical options
- Performance quality reference cards
- Instrument and genre selection with descriptions

### Utilities

- `musicSpellEffects.ts`: Effect calculation system
- `sampleMusicSpells.ts`: Pre-built example spells
- Compatibility checking between instruments and genres
- Performance modifier calculations

## Getting Started

1. **Load Sample Spells**: Click "Cargar Hechizos de Ejemplo" to add 6 example music spells
2. **Create Custom Spell**: Use "Nuevo Hechizo" and enable "Hechizo basado en música"
3. **Cast Music Spells**: Click the play button (▶️) on music spells to open performance dialog
4. **Roll Performance**: Set bonuses and roll d20 for performance checks
5. **Apply Effects**: Use quality-based effects for narrative and mechanical impact

## Balance Considerations

### Advantages

- Rich narrative and roleplay opportunities
- Scalable effects based on player skill/luck
- Thematic consistency with bard-type characters
- Visual and audio enhancement potential

### Limitations

- Requires performance checks (can fail)
- Multi-round casting makes casters vulnerable
- Proficiency requirements for some spells
- More complex than traditional spellcasting

### Balancing Guidelines

- Higher DC spells should have proportionally better effects
- Critical failures (roll of 1) should have meaningful consequences
- Ensemble spells (multiple instruments) should be more powerful but harder to coordinate
- Musical spell schools should have both strengths and weaknesses compared to traditional schools

This system transforms spellcasting from a simple button press into an engaging performance mini-game while maintaining the tactical depth and balance of traditional D&D magic.
