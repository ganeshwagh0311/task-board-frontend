import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterBar } from '@/app/components/FilterBar';
import { TaskProvider } from '@/app/context/TaskContext';
import userEvent from '@testing-library/user-event';

const renderWithContext = (component: React.ReactNode) => {
  return render(<TaskProvider>{component}</TaskProvider>);
};

describe('FilterBar', () => {
  it('should render title', () => {
    renderWithContext(<FilterBar onAddTaskClick={() => {}} />);
    expect(screen.getByText('Task Board')).toBeInTheDocument();
  });

  it('should render Add Task button', () => {
    renderWithContext(<FilterBar onAddTaskClick={() => {}} />);
    expect(screen.getByRole('button', { name: /Add Task/i })).toBeInTheDocument();
  });

  it('should call onAddTaskClick when Add Task button is clicked', () => {
    const onAddTaskClick = vi.fn();
    renderWithContext(<FilterBar onAddTaskClick={onAddTaskClick} />);
    const addButton = screen.getByRole('button', { name: /Add Task/i });
    fireEvent.click(addButton);
    expect(onAddTaskClick).toHaveBeenCalled();
  });

  it('should render search input', () => {
    renderWithContext(<FilterBar onAddTaskClick={() => {}} />);
    expect(screen.getByPlaceholderText('Search tasks...')).toBeInTheDocument();
  });

  it('should render priority filter select', () => {
    renderWithContext(<FilterBar onAddTaskClick={() => {}} />);
    expect(screen.getByLabelText('Priority') || screen.getByRole('combobox', { name: '' })).toBeInTheDocument();
  });

  it('should render status filter select', () => {
    renderWithContext(<FilterBar onAddTaskClick={() => {}} />);
    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBeGreaterThanOrEqual(2);
  });

  it('should allow searching for tasks', async () => {
    renderWithContext(<FilterBar onAddTaskClick={() => {}} />);
    const searchInput = screen.getByPlaceholderText('Search tasks...');
    await userEvent.type(searchInput, 'setup');
    expect(searchInput).toHaveValue('setup');
  });

  it('should allow filtering by priority', async () => {
    renderWithContext(<FilterBar onAddTaskClick={() => {}} />);
    const selects = screen.getAllByRole('combobox');
    const prioritySelect = selects[0];
    await userEvent.selectOptions(prioritySelect, 'high');
    expect(prioritySelect).toHaveValue('high');
  });

  it('should allow filtering by status', async () => {
    renderWithContext(<FilterBar onAddTaskClick={() => {}} />);
    const selects = screen.getAllByRole('combobox');
    const statusSelect = selects[1];
    await userEvent.selectOptions(statusSelect, 'todo');
    expect(statusSelect).toHaveValue('todo');
  });

  it('should have default filter values', () => {
    renderWithContext(<FilterBar onAddTaskClick={() => {}} />);
    const selects = screen.getAllByRole('combobox');
    const prioritySelect = selects[0];
    const statusSelect = selects[1];
    expect(prioritySelect).toHaveValue('all');
    expect(statusSelect).toHaveValue('all');
  });
});
