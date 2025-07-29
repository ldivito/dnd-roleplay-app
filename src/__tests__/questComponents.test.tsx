import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QuestCard } from '@/components/QuestCard'
import { QuestForm } from '@/components/QuestForm'
import { QuestTimeline } from '@/components/QuestTimeline'
import { Quest, QuestAction } from '@/types/quest'

// Mock the dialog components to avoid portal issues in tests
vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-content">{children}</div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-header">{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2 data-testid="dialog-title">{children}</h2>
  ),
  DialogTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-trigger">{children}</div>
  ),
}))

describe('Quest Components', () => {
  let sampleQuest: Quest
  let sampleActions: QuestAction[]

  beforeEach(() => {
    sampleActions = [
      {
        id: 'action-1',
        title: 'Talk to Village Elder',
        description: 'Speak with the village elder',
        type: 'talk_to_npc',
        npcName: 'Elder Marcus',
        isRequired: true,
        isCompleted: false,
        prerequisites: [],
        order: 0,
      },
      {
        id: 'action-2',
        title: 'Find the Map',
        description: 'Search for the ancient map',
        type: 'find_item',
        itemName: 'Ancient Map',
        isRequired: true,
        isCompleted: true,
        completedAt: new Date(),
        completedBy: 'Player 1',
        prerequisites: ['action-1'],
        order: 1,
      },
    ]

    sampleQuest = {
      id: 'quest-1',
      title: 'The Lost Treasure',
      description: 'Find the legendary treasure hidden in ancient ruins',
      summary: 'A treasure hunting adventure',
      type: 'main',
      priority: 'high',
      status: 'active',
      actions: sampleActions,
      rewards: [
        {
          id: 'reward-1',
          type: 'experience',
          description: '500 XP',
          amount: 500,
        },
      ],
      connections: [],
      questGiverName: 'Elder Marcus',
      lastUpdated: new Date(),
      isKnownToPlayers: true,
      tags: ['treasure', 'adventure'],
      relatedQuestIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  })

  describe('QuestCard Component', () => {
    const defaultProps = {
      quest: sampleQuest,
      onEdit: vi.fn(),
      onDelete: vi.fn(),
      onViewTimeline: vi.fn(),
    }

    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('renders quest information correctly', () => {
      render(<QuestCard {...defaultProps} />)

      expect(screen.getByText('The Lost Treasure')).toBeInTheDocument()
      expect(
        screen.getByText('A treasure hunting adventure')
      ).toBeInTheDocument()
      expect(
        screen.getByText('Find the legendary treasure hidden in ancient ruins')
      ).toBeInTheDocument()
    })

    it('displays quest status and type badges', () => {
      render(<QuestCard {...defaultProps} />)

      expect(screen.getByText('Principal')).toBeInTheDocument() // type: main
      expect(screen.getByText('Activa')).toBeInTheDocument() // status: active
      expect(screen.getByText('Alta')).toBeInTheDocument() // priority: high
    })

    it('shows progress information', () => {
      render(<QuestCard {...defaultProps} />)

      expect(screen.getByText('1/2 acciones completadas')).toBeInTheDocument()
      expect(screen.getByText('Progreso')).toBeInTheDocument()
    })

    it('displays next action for active quests', () => {
      render(<QuestCard {...defaultProps} />)

      expect(
        screen.getByText('Siguiente: Talk to Village Elder')
      ).toBeInTheDocument()
    })

    it('shows quest giver information', () => {
      render(<QuestCard {...defaultProps} />)

      expect(screen.getByText('Dador: Elder Marcus')).toBeInTheDocument()
    })

    it('displays quest tags', () => {
      render(<QuestCard {...defaultProps} />)

      expect(screen.getByText('treasure')).toBeInTheDocument()
      expect(screen.getByText('adventure')).toBeInTheDocument()
    })

    it('calls onEdit when edit button is clicked', async () => {
      const user = userEvent.setup()
      render(<QuestCard {...defaultProps} />)

      const editButton = screen.getByRole('button', { name: /edit/i })
      await user.click(editButton)

      expect(defaultProps.onEdit).toHaveBeenCalledWith(sampleQuest)
    })

    it('calls onDelete when delete button is clicked', async () => {
      const user = userEvent.setup()
      render(<QuestCard {...defaultProps} />)

      const deleteButton = screen.getByRole('button', { name: /trash/i })
      await user.click(deleteButton)

      expect(defaultProps.onDelete).toHaveBeenCalledWith(sampleQuest.id)
    })

    it('calls onViewTimeline when timeline button is clicked', async () => {
      const user = userEvent.setup()
      render(<QuestCard {...defaultProps} />)

      const timelineButton = screen.getByRole('button', { name: /timeline/i })
      await user.click(timelineButton)

      expect(defaultProps.onViewTimeline).toHaveBeenCalledWith(sampleQuest)
    })

    it('shows hidden indicator for DM-only quests', () => {
      const hiddenQuest = { ...sampleQuest, isKnownToPlayers: false }
      render(<QuestCard {...defaultProps} quest={hiddenQuest} />)

      expect(screen.getByText('Oculta para jugadores')).toBeInTheDocument()
    })
  })

  describe('QuestForm Component', () => {
    const defaultProps = {
      onSubmit: vi.fn(),
      onCancel: vi.fn(),
    }

    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('renders form fields correctly', () => {
      render(<QuestForm {...defaultProps} />)

      expect(screen.getByLabelText('Título *')).toBeInTheDocument()
      expect(screen.getByLabelText('Descripción *')).toBeInTheDocument()
      expect(screen.getByLabelText('Resumen')).toBeInTheDocument()
    })

    it('allows selecting quest type, priority, and status', () => {
      render(<QuestForm {...defaultProps} />)

      expect(screen.getByDisplayValue('Secundaria')).toBeInTheDocument() // default type
      expect(screen.getByDisplayValue('Media')).toBeInTheDocument() // default priority
      expect(screen.getByDisplayValue('No Iniciada')).toBeInTheDocument() // default status
    })

    it('handles form submission with valid data', async () => {
      const user = userEvent.setup()
      render(<QuestForm {...defaultProps} />)

      await user.type(screen.getByLabelText('Título *'), 'Test Quest')
      await user.type(
        screen.getByLabelText('Descripción *'),
        'Test description'
      )

      const submitButton = screen.getByRole('button', { name: /crear misión/i })
      await user.click(submitButton)

      expect(defaultProps.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Quest',
          description: 'Test description',
        })
      )
    })

    it('calls onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup()
      render(<QuestForm {...defaultProps} />)

      const cancelButton = screen.getByRole('button', { name: /cancelar/i })
      await user.click(cancelButton)

      expect(defaultProps.onCancel).toHaveBeenCalled()
    })

    it('allows adding and removing tags', async () => {
      const user = userEvent.setup()
      render(<QuestForm {...defaultProps} />)

      const tagInput = screen.getByPlaceholderText('Nueva etiqueta')
      await user.type(tagInput, 'test-tag')

      const addButton = screen.getByRole('button', { name: '' }) // Plus icon button
      await user.click(addButton)

      expect(screen.getByText('test-tag')).toBeInTheDocument()
    })

    it('shows different tabs for actions, rewards, and connections', () => {
      render(<QuestForm {...defaultProps} />)

      expect(
        screen.getByRole('tab', { name: /información básica/i })
      ).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: /acciones/i })).toBeInTheDocument()
      expect(
        screen.getByRole('tab', { name: /recompensas/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('tab', { name: /conexiones/i })
      ).toBeInTheDocument()
    })

    it('populates form when editing existing quest', () => {
      render(<QuestForm {...defaultProps} quest={sampleQuest} />)

      expect(screen.getByDisplayValue('The Lost Treasure')).toBeInTheDocument()
      expect(
        screen.getByDisplayValue(
          'Find the legendary treasure hidden in ancient ruins'
        )
      ).toBeInTheDocument()
    })
  })

  describe('QuestTimeline Component', () => {
    const defaultProps = {
      quest: sampleQuest,
      onUpdateQuest: vi.fn(),
    }

    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('renders quest title and description', () => {
      render(<QuestTimeline {...defaultProps} />)

      expect(screen.getByText('The Lost Treasure')).toBeInTheDocument()
      expect(
        screen.getByText('Find the legendary treasure hidden in ancient ruins')
      ).toBeInTheDocument()
    })

    it('shows progress overview', () => {
      render(<QuestTimeline {...defaultProps} />)

      expect(screen.getByText('Progreso General')).toBeInTheDocument()
      expect(screen.getByText('1/2 acciones completadas')).toBeInTheDocument()
    })

    it('displays timeline actions in order', () => {
      render(<QuestTimeline {...defaultProps} />)

      expect(screen.getByText('Talk to Village Elder')).toBeInTheDocument()
      expect(screen.getByText('Find the Map')).toBeInTheDocument()
    })

    it('shows action completion status', () => {
      render(<QuestTimeline {...defaultProps} />)

      // First action should be available (not completed, no prerequisites)
      expect(screen.getByText('Completar')).toBeInTheDocument()

      // Second action should show as completed
      expect(screen.getByText('Completada')).toBeInTheDocument()
    })

    it('displays NPC and item information for actions', () => {
      render(<QuestTimeline {...defaultProps} />)

      expect(screen.getByText('NPC: Elder Marcus')).toBeInTheDocument()
      expect(screen.getByText('Objeto: Ancient Map')).toBeInTheDocument()
    })

    it('shows completion information for finished actions', () => {
      render(<QuestTimeline {...defaultProps} />)

      expect(screen.getByText(/completada.*por Player 1/i)).toBeInTheDocument()
    })

    it('allows toggling between compact and detailed view', async () => {
      const user = userEvent.setup()
      render(<QuestTimeline {...defaultProps} />)

      const toggleButton = screen.getByRole('button', {
        name: /vista compacta/i,
      })
      await user.click(toggleButton)

      expect(
        screen.getByRole('button', { name: /vista detallada/i })
      ).toBeInTheDocument()
    })

    it('handles action completion', async () => {
      const user = userEvent.setup()
      render(<QuestTimeline {...defaultProps} />)

      const completeButton = screen.getByRole('button', { name: /completar/i })
      await user.click(completeButton)

      // Should open completion dialog
      expect(screen.getByTestId('dialog')).toBeInTheDocument()
      expect(screen.getByText('Completar Acción')).toBeInTheDocument()
    })

    it('shows progress statistics correctly', () => {
      render(<QuestTimeline {...defaultProps} />)

      expect(screen.getByText('1')).toBeInTheDocument() // Completed actions
      expect(screen.getByText('Completadas')).toBeInTheDocument()
      expect(screen.getByText('50%')).toBeInTheDocument() // Progress percentage
    })
  })

  describe('Component Integration', () => {
    it('QuestCard integrates properly with quest progress calculation', () => {
      // Quest with mixed completion status
      const mixedQuest = {
        ...sampleQuest,
        actions: [
          { ...sampleActions[0], isCompleted: true },
          { ...sampleActions[1], isCompleted: false },
        ],
      }

      const props = {
        quest: mixedQuest,
        onEdit: vi.fn(),
        onDelete: vi.fn(),
        onViewTimeline: vi.fn(),
      }

      render(<QuestCard {...props} />)

      expect(screen.getByText('1/2 acciones completadas')).toBeInTheDocument()
    })

    it('QuestTimeline updates quest correctly when action is completed', async () => {
      const user = userEvent.setup()
      const mockUpdate = vi.fn()

      render(<QuestTimeline quest={sampleQuest} onUpdateQuest={mockUpdate} />)

      const completeButton = screen.getByRole('button', { name: /completar/i })
      await user.click(completeButton)

      // Simulate completing the action in the dialog
      const confirmButton = screen.getByRole('button', { name: /completar/i })
      await user.click(confirmButton)

      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          actions: expect.arrayContaining([
            expect.objectContaining({
              id: 'action-1',
              isCompleted: true,
            }),
          ]),
        })
      )
    })
  })
})
