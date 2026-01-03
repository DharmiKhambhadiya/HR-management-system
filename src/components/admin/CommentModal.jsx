import { useState } from 'react';
import { HiXMark } from 'react-icons/hi2';
import Modal from '../common/Modal';
import FormTextarea from '../common/FormTextarea';

/**
 * CommentModal Component
 * Modal for viewing leave details and adding admin comments
 */
const CommentModal = ({
  isOpen,
  onClose,
  leaveRequest,
  onSaveComment,
  onApprove,
  onReject,
}) => {
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!comment.trim()) {
      alert('Please enter a comment');
      return;
    }

    setIsLoading(true);
    try {
      // API call will go here: await saveComment(leaveRequest.id, comment)
      await onSaveComment(leaveRequest.id, comment);
      setComment('');
      onClose();
    } catch (error) {
      console.error('Error saving comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (window.confirm('Are you sure you want to approve this leave request?')) {
      setIsLoading(true);
      try {
        // API call will go here: await approveLeave(leaveRequest.id, comment)
        await onApprove(leaveRequest.id, comment || null);
        setComment('');
        onClose();
      } catch (error) {
        console.error('Error approving leave:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleReject = async () => {
    if (window.confirm('Are you sure you want to reject this leave request?')) {
      setIsLoading(true);
      try {
        // API call will go here: await rejectLeave(leaveRequest.id, comment)
        await onReject(leaveRequest.id, comment || null);
        setComment('');
        onClose();
      } catch (error) {
        console.error('Error rejecting leave:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!leaveRequest) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isPending = leaveRequest.status?.toLowerCase() === 'pending';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Leave Request Details" size="md">
      <div className="space-y-6">
        {/* Leave Details */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Employee Name</p>
              <p className="text-base text-gray-900">{leaveRequest.employeeName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Time Off Type</p>
              <p className="text-base text-gray-900">{leaveRequest.timeOffType}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Start Date</p>
              <p className="text-base text-gray-900">{formatDate(leaveRequest.startDate)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">End Date</p>
              <p className="text-base text-gray-900">{formatDate(leaveRequest.endDate)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Status</p>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  leaveRequest.status?.toLowerCase() === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : leaveRequest.status?.toLowerCase() === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {leaveRequest.status}
              </span>
            </div>
          </div>
          {leaveRequest.reason && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-600 mb-2">Reason for Leave</p>
              <p className="text-base text-gray-900 bg-gray-50 rounded-lg p-3">
                {leaveRequest.reason}
              </p>
            </div>
          )}
        </div>

        {/* Previous Comments */}
        {leaveRequest.comments && leaveRequest.comments.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Previous Comments</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {leaveRequest.comments.map((cmt, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-3 text-sm">
                  <p className="text-gray-900">{cmt.comment}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {cmt.author} - {new Date(cmt.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comment Input */}
        {isPending && (
          <FormTextarea
            label="Add Comment / Reason"
            name="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your comment or reason for approval/rejection..."
            rows={4}
          />
        )}

        {/* Action Buttons */}
        {isPending && (
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              Save Comment
            </button>
            <button
              type="button"
              onClick={handleReject}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              Reject
            </button>
            <button
              type="button"
              onClick={handleApprove}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              Approve
            </button>
          </div>
        )}

        {!isPending && (
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CommentModal;

