
function populateModal(row) {
    document.querySelector('#userModalBody [data-field="name"]').textContent = row.dataset.name;
    document.querySelector('#userModalBody [data-field="email"]').textContent = row.dataset.email;
    document.querySelector('#userModalBody [data-field="role"]').textContent = row.dataset.role;
    document.querySelector('#userModalBody [data-field="status"]').textContent = row.dataset.status;
    document.querySelector('#userModalBody [data-field="created-at"]').textContent = row.dataset.createdAt;
    // store userID for ban/suspend buttons
    document.getElementById('banUserForm').action = `/admin/ban-user/${row.dataset.userid}`;
    document.getElementById('suspendUserForm').action = `/admin/suspend-user/${row.dataset.userid}`;
    document.getElementById('reinstateUserForm').action = `/admin/reinstate-user/${row.dataset.userid}`;
}

function populateDisputeModal(row) {
    document.querySelector('#disputesModalBody [data-field="customer"]').textContent = row.dataset.customer;
    document.querySelector('#disputesModalBody [data-field="vendor"]').textContent = row.dataset.vendor;
    document.querySelector('#disputesModalBody [data-field="orderid"]').textContent = row.dataset.orderid;
    document.querySelector('#disputesModalBody [data-field="createdAt"]').textContent = row.dataset.createdAt;
    document.querySelector('#disputesModalBody [data-field="total"]').textContent = row.dataset.total;
    document.querySelector('#disputesModalBody [data-field="status"]').textContent = row.dataset.status;
    document.querySelector('#disputesModalBody [data-field="description"]').textContent = row.dataset.description || 'No description provided';
    
    // store disputeID for action buttons
    const disputeId = row.dataset.disputeid;
    document.getElementById('resolveDisputeForm').action = `/admin/resolve-dispute/${disputeId}`;
    document.getElementById('appealDisputeForm').action = `/admin/appeal-dispute/${disputeId}`;

}

