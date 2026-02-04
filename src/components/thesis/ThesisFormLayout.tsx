// src/components/thesis/ThesisFormsLayout.tsx

import React, {useMemo, useState} from 'react';
import {FormState, ThesisForm} from '../../types';
import {ThesisFormCard} from './ThesisFormCard';
import {ActionButton, ThesisFormDetails} from './ThesisFormDetails';
import {Calendar, Filter, Search, SortAsc, SortDesc, X} from 'lucide-react';

// Sort options type
type SortField = 'createdAt' | 'title' | 'studentName' | 'state';
type SortDirection = 'asc' | 'desc';

interface SortOption {
    field: SortField;
    direction: SortDirection;
}

interface FilterOptions {
    searchTerm: string;
    statusFilter: FormState | 'ALL';
    dateFrom: string;
    dateTo: string;
}

interface Props {
    title: string;
    forms: ThesisForm[];
    isLoading: boolean;
    error: Error | null;
    selectedForm: ThesisForm | null;
    onSelectForm: (form: ThesisForm | null) => void;
    emptyMessage: string;
    getActionsForForm: (form: ThesisForm) => ActionButton[];
    actionLoading: boolean;
    onRetry?: () => void;
    children?: React.ReactNode;
    availableStatuses?: FormState[];
}

const DEFAULT_STATUSES: FormState[] = [
    FormState.SUBMITTED,
    FormState.INSTRUCTOR_APPROVED,
    FormState.INSTRUCTOR_REVISION_REQUESTED,
    FormState.INSTRUCTOR_REJECTED,
    FormState.ADMIN_APPROVED,
    FormState.ADMIN_REVISION_REQUESTED_FOR_STUDENT,
    FormState.ADMIN_REVISION_REQUESTED_FOR_INSTRUCTOR,
    FormState.ADMIN_REJECTED,
    FormState.MANAGER_APPROVED,
    FormState.MANAGER_REVISION_REQUESTED_FOR_STUDENT,
    FormState.MANAGER_REVISION_REQUESTED_FOR_INSTRUCTOR,
    FormState.MANAGER_REVISION_REQUESTED_FOR_ADMIN,
    FormState.MANAGER_REJECTED
];

export const ThesisFormsLayout: React.FC<Props> = ({
                                                       title,
                                                       forms,
                                                       isLoading,
                                                       error,
                                                       selectedForm,
                                                       onSelectForm,
                                                       emptyMessage,
                                                       getActionsForForm,
                                                       actionLoading,
                                                       onRetry,
                                                       children,
                                                       availableStatuses = DEFAULT_STATUSES,
                                                   }) => {
    // Filter state
    const [filters, setFilters] = useState<FilterOptions>({
        searchTerm: '',
        statusFilter: 'ALL',
        dateFrom: '',
        dateTo: '',
    });

    // Sort state
    const [sortOption, setSortOption] = useState<SortOption>({
        field: 'createdAt',
        direction: 'desc',
    });

    // Show/hide advanced filters
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    // Helper function to get full student name
    const getStudentFullName = (form: ThesisForm): string => {
        return `${form.studentFirstName || ''} ${form.studentLastName || ''}`.toLowerCase().trim();
    };

    // Helper function to format status label
    const formatStatusLabel = (status: FormState | 'ALL'): string => {
        if (status === 'ALL') return 'All Statuses';
        return status
            .replace(/_/g, ' ')
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    // Filter and sort forms
    const filteredAndSortedForms = useMemo(() => {
        let result = [...forms];

        // Apply search filter
        if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            result = result.filter(
                (form) =>
                    form.title.toLowerCase().includes(searchLower) ||
                    getStudentFullName(form).includes(searchLower) ||
                    form.abstractText?.toLowerCase().includes(searchLower) ||
                    form.studentId?.toString().includes(searchLower)
            );
        }

        // Apply status filter
        if (filters.statusFilter !== 'ALL') {
            result = result.filter((form) => form.state === filters.statusFilter);
        }

        // Apply date range filter
        if (filters.dateFrom) {
            const fromDate = new Date(filters.dateFrom);
            result = result.filter((form) => new Date(form.createdAt) >= fromDate);
        }

        if (filters.dateTo) {
            const toDate = new Date(filters.dateTo);
            toDate.setHours(23, 59, 59, 999); // Include the entire day
            result = result.filter((form) => new Date(form.createdAt) <= toDate);
        }

        // Apply sorting
        result.sort((a, b) => {
            let comparison = 0;

            switch (sortOption.field) {
                case 'createdAt':
                    comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                    break;
                case 'title':
                    comparison = a.title.localeCompare(b.title);
                    break;
                case 'studentName':
                    comparison = getStudentFullName(a).localeCompare(getStudentFullName(b));
                    break;
                case 'state':
                    comparison = a.state.localeCompare(b.state);
                    break;
                default:
                    comparison = 0;
            }

            return sortOption.direction === 'asc' ? comparison : -comparison;
        });

        return result;
    }, [forms, filters, sortOption]);

    // Count forms by status for badges
    const statusCounts = useMemo(() => {
        const counts: Record<string, number> = { ALL: forms.length };
        forms.forEach((form) => {
            counts[form.state] = (counts[form.state] || 0) + 1;
        });
        return counts;
    }, [forms]);

    // Clear all filters
    const clearFilters = () => {
        setFilters({
            searchTerm: '',
            statusFilter: 'ALL',
            dateFrom: '',
            dateTo: '',
        });
    };

    // Check if any filters are active
    const hasActiveFilters =
        filters.searchTerm ||
        filters.statusFilter !== 'ALL' ||
        filters.dateFrom ||
        filters.dateTo;

    // Toggle sort direction or change field
    const handleSortChange = (field: SortField) => {
        setSortOption((prev) => ({
            field,
            direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    if (isLoading) {
        return (
            <div className="thesis-forms-container">
                <div className="loading-spinner">Loading thesis forms...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="thesis-forms-container">
                <div className="error-message">{error.message || 'Failed to fetch forms'}</div>
                {onRetry && (
                    <button onClick={onRetry} className="btn-retry">
                        Retry
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="thesis-forms-container">
            {/* Header */}
            <div className="page-header">
                <h1>{title}</h1>
                <div className="stats">
                    <span className="stat-badge">
                        {forms.length} form{forms.length !== 1 ? 's' : ''} total
                    </span>
                    {filteredAndSortedForms.length !== forms.length && (
                        <span className="stat-badge stat-badge-filtered">
                            {filteredAndSortedForms.length} showing
                        </span>
                    )}
                </div>
            </div>

            {/* Filter & Sort Controls */}
            <div className="filter-sort-container">
                {/* Search Bar */}
                <div className="search-bar">
                    <div className="search-input-wrapper">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search by title, student name, or ID..."
                            value={filters.searchTerm}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))
                            }
                            className="search-input"
                        />
                        {filters.searchTerm && (
                            <button
                                onClick={() => setFilters((prev) => ({ ...prev, searchTerm: '' }))}
                                className="clear-search-btn"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Advanced Filters Toggle */}
                    <button
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className={`btn-advanced-filters ${showAdvancedFilters ? 'active' : ''}`}
                    >
                        <Filter size={18} />
                        <span>Filters</span>
                        {hasActiveFilters && <span className="filter-indicator" />}
                    </button>
                </div>

                {/* Status Filter Pills */}
                <div className="status-filters">
                    <button
                        onClick={() => setFilters((prev) => ({ ...prev, statusFilter: 'ALL' }))}
                        className={`status-pill ${filters.statusFilter === 'ALL' ? 'active' : ''}`}
                    >
                        All
                        <span className="status-count">{statusCounts['ALL'] || 0}</span>
                    </button>
                    {availableStatuses.map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilters((prev) => ({ ...prev, statusFilter: status }))}
                            className={`status-pill ${filters.statusFilter === status ? 'active' : ''} status-${status.toLowerCase()}`}
                        >
                            {formatStatusLabel(status)}
                            <span className="status-count">{statusCounts[status] || 0}</span>
                        </button>
                    ))}
                </div>

                {/* Advanced Filters Panel */}
                {showAdvancedFilters && (
                    <div className="advanced-filters-panel">
                        <div className="filter-group">
                            <label>
                                <Calendar size={16} />
                                Date Range
                            </label>
                            <div className="date-range-inputs">
                                <input
                                    type="date"
                                    value={filters.dateFrom}
                                    onChange={(e) =>
                                        setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))
                                    }
                                    className="date-input"
                                    placeholder="From"
                                />
                                <span className="date-separator">to</span>
                                <input
                                    type="date"
                                    value={filters.dateTo}
                                    onChange={(e) =>
                                        setFilters((prev) => ({ ...prev, dateTo: e.target.value }))
                                    }
                                    className="date-input"
                                    placeholder="To"
                                />
                            </div>
                        </div>

                        {hasActiveFilters && (
                            <button onClick={clearFilters} className="btn-clear-filters">
                                <X size={16} />
                                Clear All Filters
                            </button>
                        )}
                    </div>
                )}

                {/* Sort Controls */}
                <div className="sort-controls">
                    <span className="sort-label">Sort by:</span>
                    <div className="sort-buttons">
                        {[
                            { field: 'createdAt' as SortField, label: 'Date' },
                            { field: 'title' as SortField, label: 'Title' },
                            { field: 'studentName' as SortField, label: 'Student' },
                            { field: 'state' as SortField, label: 'Status' },
                        ].map(({ field, label }) => (
                            <button
                                key={field}
                                onClick={() => handleSortChange(field)}
                                className={`sort-btn ${sortOption.field === field ? 'active' : ''}`}
                            >
                                {label}
                                {sortOption.field === field &&
                                    (sortOption.direction === 'asc' ? (
                                        <SortAsc size={14} />
                                    ) : (
                                        <SortDesc size={14} />
                                    ))}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Forms List */}
            {filteredAndSortedForms.length === 0 ? (
                <div className="empty-state">
                    {hasActiveFilters ? (
                        <>
                            <p>No forms match your current filters.</p>
                            <button onClick={clearFilters} className="btn-clear-filters-empty">
                                Clear Filters
                            </button>
                        </>
                    ) : (
                        <p>{emptyMessage}</p>
                    )}
                </div>
            ) : (
                <div className="forms-layout">
                    <div className="forms-list">
                        {filteredAndSortedForms.map((form) => (
                            <ThesisFormCard
                                key={form.id}
                                form={form}
                                selected={selectedForm?.id === form.id}
                                onSelect={() => onSelectForm(form)}
                            />
                        ))}
                    </div>

                    {selectedForm && (
                        <ThesisFormDetails
                            form={selectedForm}
                            onClose={() => onSelectForm(null)}
                            actions={getActionsForForm(selectedForm)}
                            actionLoading={actionLoading}
                        />
                    )}
                </div>
            )}

            {/* Slot for modals */}
            {children}
        </div>
    );
};
