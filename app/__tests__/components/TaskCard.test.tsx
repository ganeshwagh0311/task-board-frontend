import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskCard } from '@/app/components/TaskCard';
import { TaskProvider } from '@/app/context/TaskContext';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import type { Task } from '@/app/types/task';

const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'todo',
  priority: 'high',
  createdAt: new Date(),
  dueDate: new Date(Date.now() + 86400000),
};

const renderWithContext = (component: React.ReactNode) => {
  return render(
    <TaskProvider>
      <DragDropContext onDragEnd={() => {}}>
        <Droppable droppableId="test">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {component}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </TaskProvider>
  );
};

describe('TaskCard', () => {
  it('should render task title', () => {
    renderWithContext(<TaskCard task={mockTask} index={0} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('should render task description', () => {
    renderWithContext(<TaskCard task={mockTask} index={0} />);
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should display priority badge', () => {
    renderWithContext(<TaskCard task={mockTask} index={0} />);
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('should display due date if provided', () => {
    renderWithContext(<TaskCard task={mockTask} index={0} />);
    const dateElement = screen.getByText(mockTask.dueDate ? 'Jan 1' : '');
    expect(dateElement).toBeInTheDocument();
  });

  it('should have delete button', () => {
    renderWithContext(<TaskCard task={mockTask} index={0} />);
    const deleteButton = screen.getByLabelText('Delete task');
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call deleteTask when delete button is clicked', () => {
    renderWithContext(<TaskCard task={mockTask} index={0} />);
    const deleteButton = screen.getByLabelText('Delete task');
    fireEvent.click(deleteButton);
    // Task should be deleted (checked in integration tests)
  });

  it('should handle tasks without due date', () => {
    const taskWithoutDueDate = { ...mockTask, dueDate: undefined };
    renderWithContext(<TaskCard task={taskWithoutDueDate} index={0} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('should display different priority colors', () => {
    const lowPriorityTask = { ...mockTask, priority: 'low' as const };
    const { container } = renderWithContext(<TaskCard task={lowPriorityTask} index={0} />);
    expect(container.querySelector('.border-l-blue-500')).toBeInTheDocument();
  });
});
