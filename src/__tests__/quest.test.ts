import { describe, it, expect, beforeEach } from 'vitest'
import {
  Quest,
  QuestAction,
  QuestReward,
  QuestConnection,
  QuestSchema,
  QuestActionSchema,
  calculateQuestProgress,
  canStartAction,
  generateQuestTimeline,
  filterQuestsByStatus,
  sortQuestsByPriority,
  getActiveQuests,
  getCompletedQuests,
} from '@/types/quest'

describe('Quest System', () => {
  let sampleQuest: Quest
  let sampleActions: QuestAction[]

  beforeEach(() => {
    sampleActions = [
      {
        id: 'action-1',
        title: 'Talk to Village Elder',
        description:
          'Speak with the village elder to learn about the ancient treasure',
        type: 'talk_to_npc',
        npcId: 'npc-1',
        npcName: 'Elder Marcus',
        isRequired: true,
        isCompleted: false,
        prerequisites: [],
        order: 0,
      },
      {
        id: 'action-2',
        title: 'Find the Old Map',
        description: 'Search the library for the ancient map',
        type: 'find_item',
        itemId: 'item-1',
        itemName: 'Ancient Map',
        isRequired: true,
        isCompleted: false,
        prerequisites: ['action-1'],
        order: 1,
      },
      {
        id: 'action-3',
        title: 'Visit the Ruins',
        description: 'Travel to the ancient ruins marked on the map',
        type: 'visit_location',
        locationId: 'location-1',
        locationName: 'Ancient Ruins',
        isRequired: true,
        isCompleted: false,
        prerequisites: ['action-2'],
        order: 2,
      },
      {
        id: 'action-4',
        title: 'Defeat the Guardian',
        description: 'Battle the ancient guardian protecting the treasure',
        type: 'defeat_enemy',
        isRequired: true,
        isCompleted: false,
        prerequisites: ['action-3'],
        order: 3,
      },
    ]

    sampleQuest = {
      id: 'quest-1',
      title: 'The Lost Treasure of Eldoria',
      description:
        'A legendary treasure is hidden in the ancient ruins near the village',
      summary: 'Find the lost treasure',
      type: 'main',
      priority: 'high',
      status: 'active',
      actions: sampleActions,
      rewards: [
        {
          id: 'reward-1',
          type: 'experience',
          description: '1000 XP for completing the quest',
          amount: 1000,
        },
        {
          id: 'reward-2',
          type: 'gold',
          description: 'Ancient treasure worth 500 gold',
          amount: 500,
        },
      ],
      connections: [
        {
          id: 'conn-1',
          type: 'npc',
          entityId: 'npc-1',
          entityName: 'Elder Marcus',
          relationshipType: 'questgiver',
          description: 'The elder who gives the quest',
        },
      ],
      questGiverId: 'npc-1',
      questGiverName: 'Elder Marcus',
      lastUpdated: new Date(),
      isKnownToPlayers: true,
      tags: ['treasure', 'ruins', 'ancient'],
      relatedQuestIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  })

  describe('Quest Schema Validation', () => {
    it('should validate a valid quest', () => {
      const result = QuestSchema.safeParse(sampleQuest)
      expect(result.success).toBe(true)
    })

    it('should reject quest without required fields', () => {
      const invalidQuest = { ...sampleQuest, title: '' }
      const result = QuestSchema.safeParse(invalidQuest)
      expect(result.success).toBe(false)
    })

    it('should validate quest actions', () => {
      const result = QuestActionSchema.safeParse(sampleActions[0])
      expect(result.success).toBe(true)
    })

    it('should reject action without required fields', () => {
      const invalidAction = { ...sampleActions[0], title: '' }
      const result = QuestActionSchema.safeParse(invalidAction)
      expect(result.success).toBe(false)
    })
  })

  describe('Quest Progress Calculation', () => {
    it('should calculate progress correctly with no completed actions', () => {
      const progress = calculateQuestProgress(sampleQuest)

      expect(progress?.completedActions).toBe(0)
      expect(progress?.totalActions).toBe(4)
      expect(progress?.progressPercentage).toBe(0)
      expect(progress?.nextAction?.id).toBe('action-1')
    })

    it('should calculate progress correctly with some completed actions', () => {
      const questWithProgress = {
        ...sampleQuest,
        actions: sampleQuest.actions.map((action, index) => ({
          ...action,
          isCompleted: index < 2, // Complete first 2 actions
        })),
      }

      const progress = calculateQuestProgress(questWithProgress)

      expect(progress?.completedActions).toBe(2)
      expect(progress?.totalActions).toBe(4)
      expect(progress?.progressPercentage).toBe(50)
      expect(progress?.nextAction?.id).toBe('action-3')
    })

    it('should calculate progress correctly with all actions completed', () => {
      const completedQuest = {
        ...sampleQuest,
        actions: sampleQuest.actions.map(action => ({
          ...action,
          isCompleted: true,
        })),
      }

      const progress = calculateQuestProgress(completedQuest)

      expect(progress?.completedActions).toBe(4)
      expect(progress?.totalActions).toBe(4)
      expect(progress?.progressPercentage).toBe(100)
      expect(progress?.nextAction).toBeUndefined()
    })
  })

  describe('Action Prerequisites', () => {
    it('should allow starting first action with no prerequisites', () => {
      const canStart = canStartAction(sampleActions[0]!, sampleActions)
      expect(canStart).toBe(true)
    })

    it('should not allow starting action with unfulfilled prerequisites', () => {
      const canStart = canStartAction(sampleActions[1]!, sampleActions)
      expect(canStart).toBe(false)
    })

    it('should allow starting action when prerequisites are completed', () => {
      const actionsWithCompleted = sampleActions.map(action =>
        action.id === 'action-1' ? { ...action, isCompleted: true } : action
      )

      const canStart = canStartAction(
        actionsWithCompleted.find(a => a.id === 'action-2')!,
        actionsWithCompleted
      )
      expect(canStart).toBe(true)
    })

    it('should not allow starting completed action', () => {
      const completedAction = { ...sampleActions[0]!, isCompleted: true }
      const canStart = canStartAction(completedAction, sampleActions)
      expect(canStart).toBe(false)
    })
  })

  describe('Quest Timeline Generation', () => {
    it('should generate timeline with correct action order', () => {
      const timeline = generateQuestTimeline(sampleQuest)

      expect(timeline).toHaveLength(4)
      expect(timeline[0]?.id).toBe('action-1')
      expect(timeline[1]?.id).toBe('action-2')
      expect(timeline[2]?.id).toBe('action-3')
      expect(timeline[3]?.id).toBe('action-4')
    })

    it('should mark first action as startable', () => {
      const timeline = generateQuestTimeline(sampleQuest)

      expect(timeline[0]?.canStart).toBe(true)
      expect(timeline[1]?.canStart).toBe(false)
      expect(timeline[2]?.canStart).toBe(false)
      expect(timeline[3]?.canStart).toBe(false)
    })

    it('should correctly identify dependencies', () => {
      const timeline = generateQuestTimeline(sampleQuest)

      expect(timeline[0]?.dependencies).toEqual([])
      expect(timeline[1]?.dependencies).toEqual(['Talk to Village Elder'])
      expect(timeline[2]?.dependencies).toEqual(['Find the Old Map'])
      expect(timeline[3]?.dependencies).toEqual(['Visit the Ruins'])
    })
  })

  describe('Quest Filtering and Sorting', () => {
    let questList: Quest[]

    beforeEach(() => {
      questList = [
        { ...sampleQuest, id: 'quest-1', status: 'active', priority: 'high' },
        {
          ...sampleQuest,
          id: 'quest-2',
          status: 'completed',
          priority: 'medium',
        },
        {
          ...sampleQuest,
          id: 'quest-3',
          status: 'not_started',
          priority: 'low',
        },
        { ...sampleQuest, id: 'quest-4', status: 'active', priority: 'medium' },
        { ...sampleQuest, id: 'quest-5', status: 'failed', priority: 'high' },
      ]
    })

    it('should filter quests by status', () => {
      const activeQuests = filterQuestsByStatus(questList, 'active')
      expect(activeQuests).toHaveLength(2)
      expect(activeQuests.every(q => q.status === 'active')).toBe(true)
    })

    it('should get active quests', () => {
      const activeQuests = getActiveQuests(questList)
      expect(activeQuests).toHaveLength(2)
      expect(activeQuests.every(q => q.status === 'active')).toBe(true)
    })

    it('should get completed quests', () => {
      const completedQuests = getCompletedQuests(questList)
      expect(completedQuests).toHaveLength(1)
      expect(completedQuests[0]?.status).toBe('completed')
    })

    it('should sort quests by priority correctly', () => {
      const sortedQuests = sortQuestsByPriority(questList)

      // High priority quests should come first
      expect(sortedQuests[0]?.priority).toBe('high')
      expect(sortedQuests[1]?.priority).toBe('high')

      // Then medium priority
      expect(sortedQuests[2]?.priority).toBe('medium')
      expect(sortedQuests[3]?.priority).toBe('medium')

      // Finally low priority
      expect(sortedQuests[4]?.priority).toBe('low')
    })
  })

  describe('Quest Integration Points', () => {
    it('should properly connect to NPC system', () => {
      const npcConnections = sampleQuest.connections.filter(
        c => c.type === 'npc'
      )
      expect(npcConnections).toHaveLength(1)
      expect(npcConnections[0]?.entityName).toBe('Elder Marcus')
      expect(npcConnections[0]?.relationshipType).toBe('questgiver')
    })

    it('should handle NPC references in actions', () => {
      const npcAction = sampleQuest.actions.find(a => a.type === 'talk_to_npc')
      expect(npcAction).toBeDefined()
      expect(npcAction?.npcName).toBe('Elder Marcus')
      expect(npcAction?.npcId).toBe('npc-1')
    })

    it('should handle location references in actions', () => {
      const locationAction = sampleQuest.actions.find(
        a => a.type === 'visit_location'
      )
      expect(locationAction).toBeDefined()
      expect(locationAction?.locationName).toBe('Ancient Ruins')
      expect(locationAction?.locationId).toBe('location-1')
    })

    it('should handle item references in actions', () => {
      const itemAction = sampleQuest.actions.find(a => a.type === 'find_item')
      expect(itemAction).toBeDefined()
      expect(itemAction?.itemName).toBe('Ancient Map')
      expect(itemAction?.itemId).toBe('item-1')
    })
  })

  describe('Quest Rewards', () => {
    it('should handle experience rewards', () => {
      const xpReward = sampleQuest.rewards.find(r => r.type === 'experience')
      expect(xpReward).toBeDefined()
      expect(xpReward?.amount).toBe(1000)
      expect(xpReward?.description).toContain('1000 XP')
    })

    it('should handle gold rewards', () => {
      const goldReward = sampleQuest.rewards.find(r => r.type === 'gold')
      expect(goldReward).toBeDefined()
      expect(goldReward?.amount).toBe(500)
      expect(goldReward?.description).toContain('500 gold')
    })

    it('should handle item rewards', () => {
      const questWithItemReward = {
        ...sampleQuest,
        rewards: [
          ...sampleQuest.rewards,
          {
            id: 'reward-3',
            type: 'item' as const,
            description: 'Magic sword found in the treasure',
            itemId: 'item-magic-sword',
            itemName: 'Flame Blade',
          },
        ],
      }

      const itemReward = questWithItemReward.rewards.find(
        r => r.type === 'item'
      )
      expect(itemReward).toBeDefined()
      expect(itemReward?.itemName).toBe('Flame Blade')
      expect(itemReward?.itemId).toBe('item-magic-sword')
    })
  })

  describe('Quest Status Management', () => {
    it('should track quest completion date', () => {
      const completedQuest = {
        ...sampleQuest,
        status: 'completed' as const,
        completedDate: new Date('2023-12-01'),
      }

      expect(completedQuest.status).toBe('completed')
      expect(completedQuest.completedDate).toBeInstanceOf(Date)
    })

    it('should track quest start date', () => {
      const startedQuest = {
        ...sampleQuest,
        startDate: new Date('2023-11-01'),
      }

      expect(startedQuest.startDate).toBeInstanceOf(Date)
    })

    it('should handle player visibility correctly', () => {
      const hiddenQuest = { ...sampleQuest, isKnownToPlayers: false }
      expect(hiddenQuest.isKnownToPlayers).toBe(false)

      const visibleQuest = { ...sampleQuest, isKnownToPlayers: true }
      expect(visibleQuest.isKnownToPlayers).toBe(true)
    })
  })

  describe('Quest Tags and Organization', () => {
    it('should handle quest tags properly', () => {
      expect(sampleQuest.tags).toContain('treasure')
      expect(sampleQuest.tags).toContain('ruins')
      expect(sampleQuest.tags).toContain('ancient')
    })

    it('should support related quest relationships', () => {
      const questWithRelated = {
        ...sampleQuest,
        relatedQuestIds: ['quest-2', 'quest-3'],
      }

      expect(questWithRelated.relatedQuestIds).toHaveLength(2)
      expect(questWithRelated.relatedQuestIds).toContain('quest-2')
      expect(questWithRelated.relatedQuestIds).toContain('quest-3')
    })

    it('should support parent-child quest relationships', () => {
      const subQuest = {
        ...sampleQuest,
        id: 'sub-quest-1',
        parentQuestId: 'main-quest-1',
      }

      expect(subQuest.parentQuestId).toBe('main-quest-1')
    })
  })
})
