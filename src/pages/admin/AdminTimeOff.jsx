import { useState, useMemo } from 'react';
import { HiMagnifyingGlass, HiCheckCircle, HiXCircle, HiChatBubbleLeftRight } from 'react-icons/hi2';
import StatusBadge from '../../components/common/StatusBadge';
import CommentModal from '../../components/admin/CommentModal';

/**
 * Admin Time Off Management Page
 * Admin/HR can view, approve, reject, and comment on employee leave requests
 */
const AdminTimeOff = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [leaveTypeFilter, setLeaveTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  // Mock leave requests data - will be replaced with API call
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      employeeName: 'Ethan Antonio',
      startDate: '2024-01-15',
      endDate: '2024-01-17',
      timeOffType: 'Paid Leave',
      status: 'Pending',
      appliedDate: '2024-01-10',
      reason: 'Family vacation - need to attend a family function',
      comments: [],
    },
    {
      id: 2,
      employeeName: 'Louis B. Kimble',
      startDate: '2024-01-20',
      endDate: '2024-01-20',
      timeOffType: 'Sick Leave',
      status: 'Approved',
      appliedDate: '2024-01-18',
      comments: [
        {
          comment: 'Approved - Medical certificate verified',
          author: 'Admin',
          date: '2024-01-19',
        },
      ],
    },
    {
      id: 3,
      employeeName: 'Calvin C. Landry',
      startDate: '2024-01-25',
      endDate: '2024-01-27',
      timeOffType: 'Unpaid Leave',
      status: 'Pending',
      appliedDate: '2024-01-22',
      reason: 'Personal work - need to handle urgent personal matters',
      comments: [],
    },
    {
      id: 4,
      employeeName: 'Mabel L. Lee',
      startDate: '2024-02-01',
      endDate: '2024-02-03',
      timeOffType: 'Paid Leave',
      status: 'Rejected',
      appliedDate: '2024-01-28',
      comments: [
        {
          comment: 'Rejected - Insufficient leave balance',
          author: 'HR Manager',
          date: '2024-01-29',
        },
      ],
    },
  ]);

  // Filter leave requests
  const filteredRequests = useMemo(() => {
    return leaveRequests.filter((request) => {
      const matchesSearch =
        request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.timeOffType.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLeaveType = !leaveTypeFilter || request.timeOffType === leaveTypeFilter;
      const matchesStatus =
        !statusFilter || request.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesLeaveType && matchesStatus;
    });
  }, [leaveRequests, searchQuery, leaveTypeFilter, statusFilter]);

  const handleApprove = async (requestId, comment) => {
    // API call: await approveLeaveRequest(requestId, comment)
    setLeaveRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: 'Approved',
              comments: comment
                ? [
                    ...req.comments,
                    {
                      comment,
                      author: 'Admin',
                      date: new Date().toISOString(),
                    },
                  ]
                : req.comments,
            }
          : req
      )
    );
    setIsCommentModalOpen(false);
  };

  const handleReject = async (requestId, comment) => {
    // API call: await rejectLeaveRequest(requestId, comment)
    setLeaveRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: 'Rejected',
              comments: comment
                ? [
                    ...req.comments,
                    {
                      comment,
                      author: 'Admin',
                      date: new Date().toISOString(),
                    },
                  ]
                : req.comments,
            }
          : req
      )
    );
    setIsCommentModalOpen(false);
  };

  const handleSaveComment = async (requestId, comment) => {
    // API call: await saveLeaveComment(requestId, comment)
    setLeaveRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              comments: [
                ...req.comments,
                {
                  comment,
                  author: 'Admin',
                  date: new Date().toISOString(),
                },
              ],
            }
          : req
      )
    );
  };

  const handleCommentClick = (request) => {
    setSelectedRequest(request);
    setIsCommentModalOpen(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <nav className="text-sm text-gray-500 mb-2">
          <span>Admin</span> <span className="mx-2">/</span>{' '}
          <span className="text-gray-900 font-medium">Time Off Management</span>
        </nav>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Time Off Management
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Review and manage employee leave requests
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Bar */}
          <div className="relative">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by employee name or leave type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Leave Type Filter */}
          <select
            value={leaveTypeFilter}
            onChange={(e) => setLeaveTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Leave Types</option>
            <option value="Paid Leave">Paid Leave</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Unpaid Leave">Unpaid Leave</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Leave Requests ({filteredRequests.length})
          </h2>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No leave requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time Off Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {request.employeeName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(request.startDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(request.endDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {request.timeOffType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={request.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        {request.status.toLowerCase() === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(request.id, null)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve"
                              aria-label="Approve leave request"
                            >
                              <HiCheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleReject(request.id, null)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                              aria-label="Reject leave request"
                            >
                              <HiXCircle className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleCommentClick(request)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Comment/Reply"
                          aria-label="Add comment or reply"
                        >
                          <HiChatBubbleLeftRight className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Comment Modal */}
      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => {
          setIsCommentModalOpen(false);
          setSelectedRequest(null);
        }}
        leaveRequest={selectedRequest}
        onSaveComment={handleSaveComment}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default AdminTimeOff;

