import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskForm } from '@/app/components/TaskForm';
import { TaskProvider } from '@/app/context/TaskContext';
import userEvent from '@testing-library/user-event';

const renderWithContext = (component: React.ReactNode) => {
  return render(<TaskProvider>{component}</TaskProvider>);
};

describe('TaskForm', () => {
  it('should render form fields', () => {
    renderWithContext(<TaskForm />);
    expect(screen.getByLabelText('Task Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Priority')).toBeInTheDocument();
    expect(screen.getByLabelText('Due Date')).toBeInTheDocument();
  });

  it('should have Add Task button', () => {
    renderWithContext(<TaskForm />);
    expect(screen.getByRole('button', { name: /Add Task/i })).toBeInTheDocument();
  });

  it('should accept input for task title', async () => {
    renderWithContext(<TaskForm />);
    const titleInput = screen.getByLabelText('Task Title');
    await userEvent.type(titleInput, 'New Task');
    expect(titleInput).toHaveValue('New Task');
  });

  it('should accept input for description', async () => {
    renderWithContext(<TaskForm />);
    const descriptionInput = screen.getByLabelText('Description');
    await userEvent.type(descriptionInput, 'Task description');
    expect(descriptionInput).toHaveValue('Task description');
  });

  it('should allow priority selection', async () => {
    renderWithContext(<TaskForm />);
    const prioritySelect = screen.getByLabelText('Priority');
    await userEvent.selectOptions(prioritySelect, 'high');
    expect(prioritySelect).toHaveValue('high');
  });

  it('should allow due date selection', async () => {
    renderWithContext(<TaskForm />);
    const dateInput = screen.getByLabelText('Due Date');
    await userEvent.type(dateInput, '2025-12-31');
    expect(dateInput).toHaveValue('2025-12-31');
  });

  it('should submit form with valid data', async () => {
    const onClose = vi.fn();
    renderWithContext(<TaskForm onClose={onClose} />);

    const titleInput = screen.getByLabelText('Task Title');
    await userEvent.type(titleInput, 'New Task');

    const submitButton = screen.getByRole('button', { name: /Add Task/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(titleInput).toHaveValue('');
    });
  });

  it('should call onClose when form is submitted', async () => {
    const onClose = vi.fn();
    renderWithContext(<TaskForm onClose={onClose} />);

    const titleInput = screen.getByLabelText('Task Title');
    await userEvent.type(titleInput, 'New Task');

    const submitButton = screen.getByRole('button', { name: /Add Task/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('should call onClose when Cancel button is clicked', async () => {
    const onClose = vi.fn();
    renderWithContext(<TaskForm onClose={onClose} />);

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('should reset form after submission', async () => {
    renderWithContext(<TaskForm />);

    const titleInput = screen.getByLabelText('Task Title') as HTMLInputElement;
    const prioritySelect = screen.getByLabelText('Priority') as HTMLSelectElement;

    await userEvent.type(titleInput, 'New Task');
    await userEvent.selectOptions(prioritySelect, 'high');

    const submitButton = screen.getByRole('button', { name: /Add Task/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(titleInput.value).toBe('');
      expect(prioritySelect.value).toBe('medium');
    });
  });
});
