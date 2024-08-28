import React from "react";

const InstantBookModal = () => {
  return (
<div className="modal fade" id="instantBookModal" tabIndex="-1" aria-labelledby="instantBookLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="instantBookLabel">Instant Book</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <form>
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="name" className="form-label">Name</label>
              <input type="text" className="form-control" id="name" />
            </div>
            <div className="col-md-6">
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <input type="tel" className="form-control" id="phone" />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="eventVision" className="form-label">Share your event vision</label>
            <textarea className="form-control" id="eventVision" rows="3"></textarea>
          </div>
        </form>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn instant-btn" data-bs-dismiss="modal">Confirm Booking</button>
      </div>
    </div>
  </div>
</div>

  );
};

export default InstantBookModal;
