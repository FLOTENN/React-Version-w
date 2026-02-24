export const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

export const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const slugify = (text) => {
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
};

export const truncate = (str, length = 100) => {
    if (!str) return '';
    return str.length > length ? str.substring(0, length) + '...' : str;
};

export const stripHtml = (html) => {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
};

export const getStatusBadgeClass = (status) => {
    const map = {
        new: 'status-warning',
        pending: 'status-warning',
        confirmed: 'status-success',
        in_progress: 'status-warning',
        completed: 'status-success',
        cancelled: 'status-danger',
        contacted: 'status-success',
        urgent: 'status-danger',
        closed: 'status-danger',
        resolved: 'status-success',
        reviewed: 'status-success',
        rejected: 'status-danger',
    };
    return map[status] || 'status-warning';
};
